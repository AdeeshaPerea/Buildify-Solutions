import { BUILDIFY_DATA } from '../data/buildifyData';
import { db, storage, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import { currencyService } from './currencyService';

const STORAGE_KEY = 'buildify_iot_products';
const CATEGORIES_STORAGE_KEY = 'buildify_iot_categories';
const FIRESTORE_COLLECTION = 'products';
const FIRESTORE_CATEGORIES_COLLECTION = 'categories';

// Clean object to ensure no `undefined` properties are sent to Firestore
function sanitizeForFirestore(obj) {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);

  const clean = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === 'object') {
        clean[key] = sanitizeForFirestore(val);
      } else {
        clean[key] = val;
      }
    }
  });
  return clean;
}

class ProductStore {
  constructor() {
    this.listeners = new Set();
    this.categoryListeners = new Set();
    this.products = this.loadLocalProducts();
    this.categories = this.loadLocalCategories();
    this.firestoreUnsubscribe = null;
    this.firestoreCategoriesUnsubscribe = null;
    this.cloudConnected = false;
    this.initFirestoreSync();
  }

  async testCloudConnection() {
    if (!isFirebaseConfigured() || !db) {
      return { success: false, message: 'Firebase configuration is missing or invalid.' };
    }
    try {
      const pingRef = doc(db, '_connection_test', 'ping');
      await setDoc(pingRef, { timestamp: Date.now(), service: 'Buildify Admin Test' }, { merge: true });
      this.cloudConnected = true;
      return { success: true, message: 'Connected to Firebase Cloud Firestore successfully!' };
    } catch (err) {
      this.cloudConnected = false;
      return { success: false, message: err.message };
    }
  }

  loadLocalProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load local products:', err);
    }
    const initial = BUILDIFY_DATA.products ? [...BUILDIFY_DATA.products] : [];
    this.saveToStorage(initial);
    return initial;
  }

  loadLocalCategories() {
    try {
      const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load local categories:', err);
    }
    const initial = BUILDIFY_DATA.storeCategories && BUILDIFY_DATA.storeCategories.length > 0
      ? [...BUILDIFY_DATA.storeCategories]
      : [
          { id: "all", name: "All Products", icon: "bi-grid-fill" },
          { id: "esp32", name: "ESP32", icon: "bi-cpu" },
          { id: "arduino", name: "Arduino", icon: "bi-lightning-charge-fill" },
          { id: "raspberry", name: "Raspberry Pi", icon: "bi-motherboard" },
          { id: "sensors", name: "Sensors", icon: "bi-broadcast-pin" },
          { id: "modules", name: "Modules", icon: "bi-cpu-fill" },
          { id: "robotics", name: "Robotics", icon: "bi-robot" },
          { id: "kits", name: "Kits", icon: "bi-box-seam-fill" },
          { id: "3dprint", name: "3D Printing", icon: "bi-printer" },
          { id: "tools", name: "Tools & Passives", icon: "bi-tools" }
        ];
    this.saveCategoriesToStorage(initial);
    return initial;
  }

  saveToStorage(products) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }

  saveCategoriesToStorage(categories) {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (err) {
      console.error('Failed to save categories to localStorage:', err);
    }
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.products);
      } catch (err) {
        console.error('Error in productStore listener:', err);
      }
    });
  }

  notifyCategories() {
    this.categoryListeners.forEach((listener) => {
      try {
        listener(this.categories);
      } catch (err) {
        console.error('Error in productStore category listener:', err);
      }
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Initial call
    try {
      listener(this.products);
    } catch (e) {}
    return () => {
      this.listeners.delete(listener);
    };
  }

  subscribeCategories(listener) {
    this.categoryListeners.add(listener);
    try {
      listener(this.categories);
    } catch (e) {}
    return () => {
      this.categoryListeners.delete(listener);
    };
  }

  getProducts() {
    return [...this.products];
  }

  getProductById(id) {
    return this.products.find((p) => p.id === id);
  }

  getCategories() {
    return [...this.categories];
  }

  async addCategory(categoryData) {
    if (!categoryData || !categoryData.name) {
      throw new Error('Category name is required.');
    }

    const name = categoryData.name.trim();
    let id = categoryData.id 
      ? categoryData.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    if (!id) {
      id = `cat-${Date.now()}`;
    }

    const existing = this.categories.find(c => c.id === id || c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      throw new Error(`Category "${name}" already exists.`);
    }

    const newCategory = {
      id,
      name,
      icon: categoryData.icon || 'bi-tag-fill'
    };

    this.categories.push(newCategory);
    this.saveCategoriesToStorage(this.categories);
    this.notifyCategories();

    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, FIRESTORE_CATEGORIES_COLLECTION, id), sanitizeForFirestore(newCategory), { merge: true });
        console.log(`🔥 Synced new category "${name}" to Firestore.`);
      } catch (err) {
        console.warn('Failed to sync category to Firestore:', err);
      }
    }

    return newCategory;
  }

  async deleteCategory(id) {
    if (id === 'all') {
      throw new Error('Cannot delete default "All Products" category.');
    }
    this.categories = this.categories.filter(c => c.id !== id);
    this.saveCategoriesToStorage(this.categories);
    this.notifyCategories();

    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, FIRESTORE_CATEGORIES_COLLECTION, id));
        console.log(`🔥 Deleted category "${id}" from Firestore.`);
      } catch (err) {
        console.warn('Failed to delete category from Firestore:', err);
      }
    }
    return true;
  }

  /**
   * Initializes real-time listener with Cloud Firestore if available
   */
  async initFirestoreSync() {
    if (isFirebaseConfigured() && db) {
      try {
        const colRef = collection(db, FIRESTORE_COLLECTION);
        
        // Listen for real-time updates from Firestore for products
        this.firestoreUnsubscribe = onSnapshot(colRef, (snapshot) => {
          if (!snapshot.empty) {
            const firestoreProducts = [];
            snapshot.forEach((d) => {
              firestoreProducts.push({ id: d.id, ...d.data() });
            });
            this.products = firestoreProducts;
            this.saveToStorage(this.products);
            this.notify();
            console.log(`🔥 Real-time sync: Loaded ${firestoreProducts.length} products from Firestore.`);
          } else {
            // Collection is empty, seed with initial catalog
            this.seedFirestoreFromCatalog();
          }
        }, (err) => {
          console.warn('Firestore subscription notice (using local fallback):', err.message);
        });

        // Listen for real-time updates from Firestore for categories
        const catColRef = collection(db, FIRESTORE_CATEGORIES_COLLECTION);
        this.firestoreCategoriesUnsubscribe = onSnapshot(catColRef, (snapshot) => {
          if (!snapshot.empty) {
            const firestoreCategories = [];
            snapshot.forEach((d) => {
              firestoreCategories.push({ id: d.id, ...d.data() });
            });
            if (!firestoreCategories.some(c => c.id === 'all')) {
              firestoreCategories.unshift({ id: 'all', name: 'All Products', icon: 'bi-grid-fill' });
            }
            this.categories = firestoreCategories;
            this.saveCategoriesToStorage(this.categories);
            this.notifyCategories();
            console.log(`🔥 Real-time sync: Loaded ${firestoreCategories.length} categories from Firestore.`);
          } else {
            this.seedFirestoreCategories();
          }
        }, (err) => {
          console.warn('Firestore categories subscription notice:', err.message);
        });
      } catch (err) {
        console.warn('Firestore initialization error:', err);
      }
    }
  }

  /**
   * Seeds Cloud Firestore with default catalog items if database is empty
   */
  async seedFirestoreFromCatalog() {
    if (!isFirebaseConfigured() || !db) return;
    try {
      const initial = this.products.length > 0 ? this.products : (BUILDIFY_DATA.products || []);
      console.log('Seeding initial products into Firestore...');
      for (const p of initial) {
        const cleanId = String(p.id || `prod-${Date.now()}`);
        await setDoc(doc(db, FIRESTORE_COLLECTION, cleanId), sanitizeForFirestore(p), { merge: true });
      }
      console.log('✅ Firestore seeded with initial catalog successfully.');
    } catch (err) {
      console.warn('Failed to seed Firestore:', err);
    }
  }

  async seedFirestoreCategories() {
    if (!isFirebaseConfigured() || !db) return;
    try {
      const initial = this.categories.length > 0 ? this.categories : (BUILDIFY_DATA.storeCategories || []);
      for (const c of initial) {
        await setDoc(doc(db, FIRESTORE_CATEGORIES_COLLECTION, c.id), sanitizeForFirestore(c), { merge: true });
      }
      console.log('✅ Firestore seeded with initial categories successfully.');
    } catch (err) {
      console.warn('Failed to seed categories to Firestore:', err);
    }
  }

  /**
   * Automatically compress images in browser before saving/uploading
   * Resizes large camera/phone photos to max 800px width and ~60KB JPEG
   */
  compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(event.target.result);
      };
      reader.onerror = () => resolve(null);
    });
  }

  /**
   * Upload an image file from the Admin PC to Firebase Storage (or fallback to optimized compressed Base64)
   * @param {File} file - The file from <input type="file" />
   * @param {Function} onProgress - Optional callback for upload percentage (0-100)
   * @returns {Promise<string>} The public download link/URL for the image
   */
  async uploadProductImage(file, onProgress) {
    if (!file) throw new Error('No file provided');

    // 1. First compress the image in-browser to ~40-60KB JPEG (ensures super fast upload & saves storage)
    if (onProgress) onProgress(20);
    let compressedDataUrl = await this.compressImage(file);
    if (!compressedDataUrl) {
      // Fallback: read directly if canvas compression fails on unsupported image
      compressedDataUrl = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = (e) => resolve(e.target.result);
        r.onerror = () => resolve(null);
        r.readAsDataURL(file);
      });
    }
    if (!compressedDataUrl) throw new Error('Could not read image file.');
    if (onProgress) onProgress(40);

    // 2. Try Firebase Storage if configured (with a 5-second timeout so it never hangs)
    if (isFirebaseConfigured() && storage) {
      try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileRef = storageRef(storage, `products/${Date.now()}_${cleanName}`);
        
        // Convert compressed data URL to Blob for upload
        const response = await fetch(compressedDataUrl);
        const blob = await response.blob();
        
        const uploadTask = uploadBytesResumable(fileRef, blob, { contentType: 'image/jpeg' });

        const storageUrl = await new Promise((resolve) => {
          let resolved = false;

          // 5-second safety timer: if Firebase Storage bucket is not ready, don't keep user waiting
          const timer = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              console.warn('Firebase Storage upload taking longer than 5s. Falling back to direct cloud-optimized image.');
              try { uploadTask.cancel(); } catch (e) {}
              if (onProgress) onProgress(100);
              resolve(compressedDataUrl);
            }
          }, 5000);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              if (resolved) return;
              const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 55) + 40;
              if (onProgress) onProgress(pct);
            },
            (error) => {
              if (resolved) return;
              resolved = true;
              clearTimeout(timer);
              console.warn('Firebase Storage notice (using cloud-ready image):', error.message);
              if (onProgress) onProgress(100);
              resolve(compressedDataUrl);
            },
            async () => {
              if (resolved) return;
              resolved = true;
              clearTimeout(timer);
              try {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                if (onProgress) onProgress(100);
                resolve(downloadUrl);
              } catch (e) {
                if (onProgress) onProgress(100);
                resolve(compressedDataUrl);
              }
            }
          );
        });

        return storageUrl;
      } catch (err) {
        console.warn('Firebase Storage upload error, using compressed image:', err);
      }
    }

    // 3. Instant local / Firestore direct fallback
    if (onProgress) onProgress(100);
    return compressedDataUrl;
  }

  async addProduct(productData) {
    const liveRate = currencyService.getUsdRateNumber();
    const priceLKR = parseFloat(productData.priceLKR) || 0;
    const priceUSD = parseFloat((priceLKR / liveRate).toFixed(2));
    const originalPriceLKR = productData.originalPriceLKR ? parseFloat(productData.originalPriceLKR) : null;
    const originalPriceUSD = originalPriceLKR ? parseFloat((originalPriceLKR / liveRate).toFixed(2)) : null;
    const stockQuantity = parseInt(productData.stockQuantity, 10) || 0;

    const newProduct = {
      id: productData.id || `prod-${Date.now()}`,
      sku: productData.sku || `BF-${Math.floor(1000 + Math.random() * 9000)}`,
      name: productData.name || 'Untitled Hardware Component',
      category: productData.category || 'esp32',
      brand: productData.brand || 'Buildify',
      operatingVoltage: productData.operatingVoltage || '3.3V - 5V',
      packageType: productData.packageType || 'Module',
      pinCount: parseInt(productData.pinCount, 10) || 0,
      price: priceUSD,
      priceLKR: priceLKR,
      originalPrice: originalPriceUSD,
      originalPriceLKR: originalPriceLKR,
      stockQuantity: stockQuantity,
      lowStockThreshold: parseInt(productData.lowStockThreshold, 10) || 5,
      rating: parseFloat(productData.rating) || 5.0,
      reviewsCount: parseInt(productData.reviewsCount, 10) || 0,
      image: productData.image || '/images/products/esp32-devkit-v1.jpg',
      description: productData.description || '',
      badge: productData.badge || (originalPriceLKR && originalPriceLKR > priceLKR ? 'Promo Sale' : 'New Arrival'),
      inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : stockQuantity > 0,
      datasheetUrl: productData.datasheetUrl || '',
      specs: productData.specs || {},
      pinoutSummary: productData.pinoutSummary || ''
    };

    // Save locally
    this.products = [newProduct, ...this.products];
    this.saveToStorage(this.products);
    this.notify();

    // Sync to Firestore if online
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, FIRESTORE_COLLECTION, newProduct.id), sanitizeForFirestore(newProduct));
      } catch (err) {
        console.warn('Firestore addDoc notice:', err);
      }
    }

    return newProduct;
  }

  async updateProduct(id, updates) {
    let updatedItem = null;
    this.products = this.products.map((p) => {
      if (p.id === id) {
        const merged = { ...p, ...updates };

        const liveRate = currencyService.getUsdRateNumber();

        if (updates.priceLKR !== undefined) {
          merged.priceLKR = parseFloat(updates.priceLKR) || 0;
          merged.price = parseFloat((merged.priceLKR / liveRate).toFixed(2));
        }
        if (updates.originalPriceLKR !== undefined) {
          if (updates.originalPriceLKR === null || updates.originalPriceLKR === '') {
            merged.originalPriceLKR = null;
            merged.originalPrice = null;
          } else {
            merged.originalPriceLKR = parseFloat(updates.originalPriceLKR);
            merged.originalPrice = parseFloat((merged.originalPriceLKR / liveRate).toFixed(2));
          }
        }
        if (updates.stockQuantity !== undefined) {
          merged.stockQuantity = parseInt(updates.stockQuantity, 10) || 0;
          if (updates.inStock === undefined) {
            merged.inStock = merged.stockQuantity > 0;
          }
        }

        updatedItem = merged;
        return merged;
      }
      return p;
    });

    if (updatedItem) {
      this.saveToStorage(this.products);
      this.notify();

      // Sync to Firestore if online
      if (isFirebaseConfigured() && db) {
        try {
          await setDoc(doc(db, FIRESTORE_COLLECTION, id), sanitizeForFirestore(updatedItem), { merge: true });
        } catch (err) {
          console.warn('Firestore setDoc notice:', err);
        }
      }
    }
    return updatedItem;
  }

  async applyDiscount(id, { discountPercent, salePriceLKR, customBadge }) {
    const product = this.products.find((p) => p.id === id);
    if (!product) return null;

    let basePrice = product.originalPriceLKR || product.priceLKR;
    let newPriceLKR = product.priceLKR;

    if (discountPercent !== undefined && discountPercent > 0) {
      const pct = Math.min(95, Math.max(1, parseFloat(discountPercent)));
      newPriceLKR = Math.round(basePrice * (1 - pct / 100));
    } else if (salePriceLKR !== undefined && salePriceLKR > 0) {
      newPriceLKR = parseFloat(salePriceLKR);
    }

    const pctNumber = Math.round(((basePrice - newPriceLKR) / basePrice) * 100);
    const badge = customBadge || (pctNumber > 0 ? `-${pctNumber}% OFF` : product.badge);

    return this.updateProduct(id, {
      originalPriceLKR: basePrice,
      priceLKR: newPriceLKR,
      badge: badge
    });
  }

  async removeDiscount(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) return null;

    const restoredPriceLKR = product.originalPriceLKR || product.priceLKR;
    return this.updateProduct(id, {
      priceLKR: restoredPriceLKR,
      originalPriceLKR: null,
      originalPrice: null,
      badge: product.badge?.includes('%') ? null : product.badge
    });
  }

  async toggleStock(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) return null;

    const newInStock = !product.inStock;
    return this.updateProduct(id, {
      inStock: newInStock,
      stockQuantity: newInStock && product.stockQuantity === 0 ? 10 : product.stockQuantity
    });
  }

  async deleteProduct(id) {
    const prevLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    if (this.products.length !== prevLen) {
      this.saveToStorage(this.products);
      this.notify();

      // Sync deletion to Firestore if online
      if (isFirebaseConfigured() && db) {
        try {
          await deleteDoc(doc(db, FIRESTORE_COLLECTION, id));
        } catch (err) {
          console.warn('Firestore deleteDoc notice:', err);
        }
      }
      return true;
    }
    return false;
  }

  resetToDefaults() {
    const initial = BUILDIFY_DATA.products ? [...BUILDIFY_DATA.products] : [];
    this.products = initial;
    this.saveToStorage(initial);
    this.notify();
    return initial;
  }

  exportCatalogJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `buildify_iot_catalog_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}

export const productStore = new ProductStore();
export default productStore;
