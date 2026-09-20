import React, { useState, useEffect, useMemo, useRef } from 'react';
import { productStore } from '../../services/productStore';
import { rfpStore } from '../../services/rfpStore';
import { authService } from '../../services/authService';
import { isFirebaseConfigured, getFirebaseConfig, saveFirebaseConfig } from '../../services/firebase';
import Logo from '../Logo';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Percent,
  Search,
  Filter,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Cpu,
  Package,
  Layers,
  Zap,
  ArrowLeft,
  DollarSign,
  TrendingDown,
  Box,
  Sliders,
  X,
  Sparkles,
  HelpCircle,
  Upload,
  Image as ImageIcon,
  Cloud,
  Database,
  Check,
  Copy,
  Loader2,
  FileText,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Building,
  CheckCheck,
  User,
  Clock
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'esp32', name: 'ESP32 & Wireless' },
  { id: 'arduino', name: 'Arduino & AVR' },
  { id: 'raspberry', name: 'Raspberry Pi & SBC' },
  { id: 'sensors', name: 'Sensors & Probes' },
  { id: 'modules', name: 'Power & Relays' },
  { id: 'robotics', name: 'Robotics & Servos' },
  { id: 'kits', name: 'STEM Starter Kits' },
  { id: '3dprint', name: '3D Printing & CNC' },
  { id: 'tools', name: 'Tools & Soldering' }
];

const SAMPLE_IMAGES = [
  { label: 'ESP32 DevKit', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' },
  { label: 'Microcontroller Chip', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sensor Module', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
  { label: 'Robotics & Motor', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Circuit Board', url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80' }
];

export default function AdminPortal({ onBackToStore }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Products State synced with productStore & Firestore
  const [products, setProducts] = useState(productStore.getProducts());

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterDiscountOnly, setFilterDiscountOnly] = useState(false);
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Modals State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountTargetProduct, setDiscountTargetProduct] = useState(null);
  const [discountPercentInput, setDiscountPercentInput] = useState('15');
  const [customDiscountPrice, setCustomDiscountPrice] = useState('');
  const [customBadgeInput, setCustomBadgeInput] = useState('');

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirmPass: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Firebase Configuration Modal State
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [firebaseConfigForm, setFirebaseConfigForm] = useState(getFirebaseConfig());
  const [firebaseMessage, setFirebaseMessage] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // PC Image Upload State
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Delete Confirmation Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Notifications
  const [bannerNotice, setBannerNotice] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setBannerNotice({ msg, type });
    setTimeout(() => setBannerNotice(null), 3500);
  };

  // Product Form Initial Data
  const defaultFormData = {
    name: '',
    sku: '',
    category: 'esp32',
    brand: 'Buildify',
    operatingVoltage: '3.3V - 5V',
    packageType: 'Module',
    pinCount: 0,
    priceLKR: '',
    originalPriceLKR: '',
    stockQuantity: '25',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    description: '',
    badge: 'New Item',
    datasheetUrl: '',
    pinoutSummary: ''
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [formDiscountPct, setFormDiscountPct] = useState('');

  // Primary Section Navigation ('inventory' | 'rfps')
  const [activeSection, setActiveSection] = useState('inventory');

  // RFP / Client Proposals State
  const [proposals, setProposals] = useState(rfpStore.getProposals());
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [rfpSearchQuery, setRfpSearchQuery] = useState('');
  const [rfpStatusFilter, setRfpStatusFilter] = useState('all');
  const [rfpCategoryFilter, setRfpCategoryFilter] = useState('all');
  const [editingRfpNotes, setEditingRfpNotes] = useState('');

  // Subscribe to product store updates (and Cloud Firestore)
  useEffect(() => {
    const unsubscribe = productStore.subscribe((updatedList) => {
      setProducts(updatedList);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to RFP proposals updates (and Cloud Firestore)
  useEffect(() => {
    const unsubscribe = rfpStore.subscribe((updatedList) => {
      setProposals(updatedList);
    });
    return () => unsubscribe();
  }, []);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const res = authService.login(loginUsername, loginPassword);
    if (res.success) {
      setIsAuthenticated(true);
      setLoginSuccess(`Welcome back, ${res.user}! Access authorized.`);
      showNotification('🔐 Admin session verified. Welcome to Command Center.');
    } else {
      setLoginError(res.message);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setLoginPassword('');
    showNotification('Logged out successfully.', 'info');
  };

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...defaultFormData,
      sku: `BF-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setFormDiscountPct('');
    setUploadingImage(false);
    setUploadProgress(0);
    setIsAddEditOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || 'esp32',
      brand: product.brand || 'Buildify',
      operatingVoltage: product.operatingVoltage || '3.3V - 5V',
      packageType: product.packageType || 'Module',
      pinCount: product.pinCount || 0,
      priceLKR: product.priceLKR !== undefined ? String(product.priceLKR) : '',
      originalPriceLKR: product.originalPriceLKR !== undefined && product.originalPriceLKR !== null ? String(product.originalPriceLKR) : '',
      stockQuantity: product.stockQuantity !== undefined ? String(product.stockQuantity) : '20',
      inStock: product.inStock !== false,
      image: product.image || '',
      description: product.description || '',
      badge: product.badge || '',
      datasheetUrl: product.datasheetUrl || '',
      pinoutSummary: product.pinoutSummary || ''
    });

    if (product.originalPriceLKR && product.priceLKR && parseFloat(product.originalPriceLKR) > parseFloat(product.priceLKR)) {
      const pct = Math.round(((parseFloat(product.originalPriceLKR) - parseFloat(product.priceLKR)) / parseFloat(product.originalPriceLKR)) * 100);
      setFormDiscountPct(String(pct));
    } else {
      setFormDiscountPct('');
    }

    setUploadingImage(false);
    setUploadProgress(0);
    setIsAddEditOpen(true);
  };

  // Automatic Discount & Price Calculation Handlers
  const handleFormOriginalPriceChange = (val) => {
    const orig = parseFloat(val);
    const pct = parseFloat(formDiscountPct);

    setFormData((prev) => {
      const next = { ...prev, originalPriceLKR: val };
      if (!isNaN(orig) && orig > 0) {
        if (!isNaN(pct) && pct > 0) {
          const sale = Math.round(orig * (1 - pct / 100));
          next.priceLKR = String(sale);
          next.badge = `-${pct}% OFF`;
        } else if (!prev.priceLKR || prev.priceLKR === prev.originalPriceLKR) {
          next.priceLKR = val;
        }
      }
      return next;
    });
  };

  const handleFormDiscountPctChange = (pctVal) => {
    setFormDiscountPct(pctVal);
    const pct = parseFloat(pctVal);

    setFormData((prev) => {
      const orig = parseFloat(prev.originalPriceLKR || prev.priceLKR);
      if (!isNaN(orig) && orig > 0) {
        if (!isNaN(pct) && pct > 0) {
          const sale = Math.round(orig * (1 - pct / 100));
          return {
            ...prev,
            originalPriceLKR: prev.originalPriceLKR ? prev.originalPriceLKR : prev.priceLKR,
            priceLKR: String(sale),
            badge: `-${pct}% OFF`
          };
        } else {
          return {
            ...prev,
            priceLKR: prev.originalPriceLKR || prev.priceLKR,
            originalPriceLKR: '',
            badge: prev.badge && prev.badge.includes('% OFF') ? 'New Item' : prev.badge
          };
        }
      }
      return prev;
    });
  };

  const handleFormSalePriceChange = (val) => {
    const sale = parseFloat(val);
    setFormData((prev) => {
      const orig = parseFloat(prev.originalPriceLKR);
      const next = { ...prev, priceLKR: val };
      if (!isNaN(orig) && orig > 0 && !isNaN(sale) && sale > 0 && sale < orig) {
        const pct = Math.round(((orig - sale) / orig) * 100);
        setFormDiscountPct(String(pct));
        next.badge = `-${pct}% OFF`;
      } else if (!isNaN(sale) && !isNaN(orig) && sale >= orig) {
        setFormDiscountPct('');
        if (next.badge && next.badge.includes('% OFF')) next.badge = 'New Item';
      }
      return next;
    });
  };

  // Process and Upload Image from PC
  const processImageFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    try {
      setUploadingImage(true);
      setUploadProgress(25);
      const publicUrl = await productStore.uploadProductImage(file, (progress) => {
        setUploadProgress(progress);
      });
      if (publicUrl) {
        setFormData((prev) => ({ ...prev, image: publicUrl }));
        showNotification('📷 Image uploaded from PC and connected to product!');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  // Handle Save Product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.priceLKR) {
      alert('Please fill in product name and price.');
      return;
    }

    if (editingProduct) {
      await productStore.updateProduct(editingProduct.id, {
        ...formData,
        priceLKR: parseFloat(formData.priceLKR),
        originalPriceLKR: formData.originalPriceLKR ? parseFloat(formData.originalPriceLKR) : null,
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
        pinCount: parseInt(formData.pinCount, 10) || 0,
        inStock: formData.inStock
      });
      showNotification(`✅ Updated product "${formData.name}" in Cloud DB!`);
    } else {
      await productStore.addProduct({
        ...formData,
        priceLKR: parseFloat(formData.priceLKR),
        originalPriceLKR: formData.originalPriceLKR ? parseFloat(formData.originalPriceLKR) : null,
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
        pinCount: parseInt(formData.pinCount, 10) || 0,
        inStock: formData.inStock
      });
      showNotification(`✨ New product "${formData.name}" added to Cloud DB & IoT Store!`);
    }

    setIsAddEditOpen(false);
  };

  // Open Quick Discount Modal
  const handleOpenDiscountModal = (product) => {
    setDiscountTargetProduct(product);
    setDiscountPercentInput('15');
    const base = product.originalPriceLKR || product.priceLKR;
    setCustomDiscountPrice(String(Math.round(base * 0.85)));
    setCustomBadgeInput('-15% OFF');
    setIsDiscountModalOpen(true);
  };

  // Preset percentage clicked
  const handleSelectDiscountPct = (pct) => {
    setDiscountPercentInput(String(pct));
    if (discountTargetProduct) {
      const base = discountTargetProduct.originalPriceLKR || discountTargetProduct.priceLKR;
      const calculated = Math.round(base * (1 - pct / 100));
      setCustomDiscountPrice(String(calculated));
      setCustomBadgeInput(`-${pct}% OFF`);
    }
  };

  // Apply Discount
  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    if (!discountTargetProduct) return;

    const base = discountTargetProduct.originalPriceLKR || discountTargetProduct.priceLKR;
    const sale = parseFloat(customDiscountPrice) || Math.round(base * 0.85);

    await productStore.applyDiscount(discountTargetProduct.id, {
      salePriceLKR: sale,
      customBadge: customBadgeInput.trim() || `${Math.round(((base - sale) / base) * 100)}% OFF`
    });

    showNotification(`🔥 Promo discount applied to "${discountTargetProduct.name}"!`);
    setIsDiscountModalOpen(false);
  };

  // Remove Discount
  const handleRemoveDiscount = async () => {
    if (!discountTargetProduct) return;
    await productStore.removeDiscount(discountTargetProduct.id);
    showNotification(`Discount removed from "${discountTargetProduct.name}". Restored regular price.`);
    setIsDiscountModalOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    const p = products.find(item => item.id === id);
    await productStore.deleteProduct(id);
    setDeleteConfirmId(null);
    showNotification(`🗑️ Removed "${p?.name || 'product'}" from Cloud DB.`);
  };

  // Toggle Stock Status
  const handleToggleStock = async (id) => {
    const updated = await productStore.toggleStock(id);
    if (updated) {
      showNotification(
        updated.inStock ? `🟢 Item marked IN STOCK` : `🔴 Item marked OUT OF STOCK`
      );
    }
  };

  // Handle Change Password
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPass !== passwordForm.confirmPass) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    const res = authService.changePassword(passwordForm.current, passwordForm.newPass);
    if (res.success) {
      setPasswordSuccess(res.message);
      setPasswordForm({ current: '', newPass: '', confirmPass: '' });
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setPasswordSuccess('');
      }, 2000);
    } else {
      setPasswordError(res.message);
    }
  };

  // Handle Save Firebase Config
  const handleSaveFirebase = (e) => {
    e.preventDefault();
    const res = saveFirebaseConfig(firebaseConfigForm);
    if (res.success) {
      setFirebaseMessage('Firebase project settings updated. Reloading connection...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setFirebaseMessage('Error saving config: ' + res.message);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await productStore.testCloudConnection();
      setTestResult(res);
      if (res.success) {
        showNotification('🔥 Firebase Cloud Connected Successfully!');
      } else {
        showNotification('⚠️ Cloud connection test: ' + res.message, 'error');
      }
    } catch (e) {
      setTestResult({ success: false, message: e.message });
    } finally {
      setTestingConnection(false);
    }
  };

  // Computed Metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const discounted = products.filter(p => p.originalPriceLKR && p.originalPriceLKR > p.priceLKR).length;
    const lowStock = products.filter(p => !p.inStock || p.stockQuantity <= (p.lowStockThreshold || 5)).length;
    const totalValueLKR = products.reduce((acc, p) => acc + (p.priceLKR * (p.stockQuantity || 1)), 0);

    return { total, discounted, lowStock, totalValueLKR };
  }, [products]);

  // Filtered Products for Admin Table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBrand = (p.brand || '').toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchBrand) return false;
      }
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (filterDiscountOnly && (!p.originalPriceLKR || p.originalPriceLKR <= p.priceLKR)) return false;
      if (filterLowStockOnly && p.inStock && p.stockQuantity > (p.lowStockThreshold || 5)) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategory, filterDiscountOnly, filterLowStockOnly]);

  // Computed RFP Metrics
  const rfpMetrics = useMemo(() => {
    const total = proposals.length;
    const newCount = proposals.filter((p) => p.status === 'New').length;
    const inReview = proposals.filter((p) => p.status === 'In Review').length;
    const totalPipelineLKR = proposals.reduce((acc, p) => acc + (parseFloat(p.estimatedValueLKR) || 0), 0);
    return { total, newCount, inReview, totalPipelineLKR };
  }, [proposals]);

  // Filtered RFPs / Proposals
  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      if (rfpStatusFilter !== 'all' && p.status !== rfpStatusFilter) return false;
      
      const isWeb = (p.category || '').toLowerCase().includes('web') || (p.contractType || '').toLowerCase().includes('web');
      if (rfpCategoryFilter === 'web' && !isWeb) return false;
      if (rfpCategoryFilter === 'iot' && isWeb) return false;

      if (rfpSearchQuery.trim()) {
        const q = rfpSearchQuery.toLowerCase();
        const matchComp = (p.companyName || '').toLowerCase().includes(q);
        const matchPerson = (p.contactPerson || '').toLowerCase().includes(q);
        const matchPhone = (p.phone || '').toLowerCase().includes(q);
        const matchEmail = (p.email || '').toLowerCase().includes(q);
        const matchType = (p.contractType || '').toLowerCase().includes(q);
        const matchBrief = (p.projectBrief || '').toLowerCase().includes(q);
        if (!matchComp && !matchPerson && !matchPhone && !matchEmail && !matchType && !matchBrief) return false;
      }
      return true;
    });
  }, [proposals, rfpStatusFilter, rfpCategoryFilter, rfpSearchQuery]);

  const handleUpdateRfpStatus = async (id, status) => {
    await rfpStore.updateProposalStatus(id, status);
    showNotification(`Proposal marked as "${status}" in Cloud DB.`);
    if (selectedProposal && selectedProposal.id === id) {
      setSelectedProposal(prev => ({ ...prev, status }));
    }
  };

  const handleSaveRfpNotes = async (id, notes) => {
    await rfpStore.updateProposalStatus(id, undefined, notes);
    showNotification('Saved internal admin notes to Cloud DB.');
    if (selectedProposal && selectedProposal.id === id) {
      setSelectedProposal(prev => ({ ...prev, adminNotes: notes }));
    }
  };

  const handleDeleteRfp = async (id) => {
    if (window.confirm('Delete this Request for Proposal from the database?')) {
      await rfpStore.deleteProposal(id);
      if (selectedProposal && selectedProposal.id === id) {
        setSelectedProposal(null);
      }
      showNotification('RFP deleted from database.', 'info');
    }
  };

  const handleOpenProposalDetails = (rfp) => {
    setSelectedProposal(rfp);
    setEditingRfpNotes(rfp.adminNotes || '');
  };

  // =========================================================================
  // VIEW 1: AUTHENTICATION GATE (RESTRICTED LOGIN SCREEN)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 20%, rgba(245, 158, 11, 0.12) 0%, #080b11 75%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(245, 158, 11, 0.15)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          padding: '2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle circuit lines accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #f59e0b, #ef4444, #38bdf8)'
          }} />

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '1rem' }}>
              <Lock size={32} color="#f59e0b" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
              Buildify Operations Terminal
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              Authorized Personnel Only • Hardware Inventory System
            </p>
          </div>

          {loginError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem'
            }}>
              <AlertTriangle size={16} color="#ef4444" />
              <span>{loginError}</span>
            </div>
          )}

          {loginSuccess && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#86efac',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem'
            }}>
              <CheckCircle2 size={16} color="#22c55e" />
              <span>{loginSuccess}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admin Username
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. admin"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(2, 6, 23, 0.7)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Security Access Key / Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter security key"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '13px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.35)',
                transition: 'all 0.2s',
                marginTop: '0.5rem'
              }}
            >
              <Unlock size={18} />
              <span>Authenticate & Access Terminal</span>
            </button>
          </form>

          {/* Helper box for admin owner */}
          <div style={{
            marginTop: '1.5rem',
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px dashed rgba(245, 158, 11, 0.25)',
            fontSize: '0.78rem',
            color: '#cbd5e1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 600, marginBottom: '4px' }}>
              <Key size={14} />
              <span>Default Credentials (Initial Setup):</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span>User: <code style={{ color: '#fcd34d' }}>admin</code></span>
              <span>Pass: <code style={{ color: '#fcd34d' }}>buildify2026!</code></span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginUsername('admin');
                setLoginPassword('buildify2026!');
              }}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '5px 8px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '6px',
                color: '#f59e0b',
                fontSize: '0.74rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Fill Default Credentials
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onBackToStore}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={15} />
              Return to Public IoT Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN COMMAND CENTER
  // =========================================================================
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0d14',
      color: '#f1f5f9',
      fontFamily: 'Inter, system-ui, sans-serif',
      paddingBottom: '4rem'
    }}>
      {/* Top Banner Notice */}
      {bannerNotice && (
        <div style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 99999,
          background: bannerNotice.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '0.9rem',
          fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {bannerNotice.msg}
        </div>
      )}

      {/* Top Command Bar */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.9)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.85rem 2rem'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Logo />
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              fontSize: '0.75rem',
              color: '#f59e0b',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              <ShieldCheck size={14} />
              ADMIN OPERATIONS PORTAL
            </div>

            {/* Firebase Live Cloud Status Indicator */}
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              title="Click to configure or view Firebase Cloud Database & Storage"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: isFirebaseConfigured() ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.12)',
                border: isFirebaseConfigured() ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
                fontSize: '0.74rem',
                color: isFirebaseConfigured() ? '#4ade80' : '#38bdf8',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Database size={13} />
              <span>{isFirebaseConfigured() ? '🔥 Cloud DB & Storage: Active' : '⚡ Cloud DB Setup'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={onBackToStore}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ExternalLink size={15} />
              View Public IoT Store
            </button>

            <button
              onClick={() => productStore.exportCatalogJSON()}
              title="Download full catalog backup as JSON"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(148, 163, 184, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                color: '#cbd5e1',
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              <Download size={15} />
              Backup JSON
            </button>

            <button
              onClick={() => setIsChangePasswordOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(148, 163, 184, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                color: '#cbd5e1',
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              <Key size={15} />
              Security Key
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 2rem' }}>
        
        {/* Primary View Navigation Switcher: Hardware Inventory vs Enterprise RFPs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '1.75rem',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          paddingBottom: '0.85rem'
        }}>
          <button
            type="button"
            onClick={() => setActiveSection('inventory')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: activeSection === 'inventory' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))' : 'rgba(255,255,255,0.03)',
              border: activeSection === 'inventory' ? '1px solid #f59e0b' : '1px solid rgba(148, 163, 184, 0.2)',
              color: activeSection === 'inventory' ? '#f59e0b' : '#94a3b8',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Package size={17} />
            <span>Hardware Catalog</span>
            <span style={{
              background: activeSection === 'inventory' ? '#f59e0b' : 'rgba(255,255,255,0.1)',
              color: activeSection === 'inventory' ? '#000' : '#cbd5e1',
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '0.74rem',
              fontWeight: 800
            }}>
              {metrics.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('rfps')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: activeSection === 'rfps' ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(2, 132, 199, 0.2))' : 'rgba(255,255,255,0.03)',
              border: activeSection === 'rfps' ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.2)',
              color: activeSection === 'rfps' ? '#38bdf8' : '#94a3b8',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={17} />
            <span>Client Proposals & RFPs</span>
            <span style={{
              background: rfpMetrics.newCount > 0 ? '#ef4444' : (activeSection === 'rfps' ? '#38bdf8' : 'rgba(255,255,255,0.1)'),
              color: rfpMetrics.newCount > 0 ? '#fff' : (activeSection === 'rfps' ? '#000' : '#cbd5e1'),
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '0.74rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {rfpMetrics.newCount > 0 && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', display: 'inline-block' }}></span>}
              {rfpMetrics.newCount > 0 ? `${rfpMetrics.newCount} NEW` : proposals.length}
            </span>
          </button>
        </div>

        {activeSection === 'inventory' && (
          <div>
            {/* KPI Metrics Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}>
          {/* Metric 1 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Package size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total IoT Catalog Items</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>{metrics.total}</div>
            </div>
          </div>

          {/* Metric 2 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Tag size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Promo Discounts</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>{metrics.discounted}</div>
            </div>
          </div>

          {/* Metric 3 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Low / Out of Stock Items</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ef4444' }}>{metrics.lowStock}</div>
            </div>
          </div>

          {/* Metric 4 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Inventory Valuation</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
                Rs. {Math.round(metrics.totalValueLKR).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Action & Filter Bar */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Search Input */}
            <div style={{
              position: 'relative',
              flex: '1 1 300px',
              maxWidth: '450px'
            }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by SKU, Name, or Brand..."
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  background: 'rgba(2, 6, 23, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Quick Filter Toggles & Add Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterDiscountOnly(!filterDiscountOnly)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: filterDiscountOnly ? 'rgba(245, 158, 11, 0.25)' : 'rgba(2, 6, 23, 0.5)',
                  border: filterDiscountOnly ? '1px solid #f59e0b' : '1px solid rgba(148, 163, 184, 0.25)',
                  color: filterDiscountOnly ? '#f59e0b' : '#cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Percent size={14} />
                Promo Deals Only ({metrics.discounted})
              </button>

              <button
                onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: filterLowStockOnly ? 'rgba(239, 68, 68, 0.25)' : 'rgba(2, 6, 23, 0.5)',
                  border: filterLowStockOnly ? '1px solid #ef4444' : '1px solid rgba(148, 163, 184, 0.25)',
                  color: filterLowStockOnly ? '#ef4444' : '#cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <AlertTriangle size={14} />
                Low / Out of Stock ({metrics.lowStock})
              </button>

              {/* Primary Add Button */}
              <button
                onClick={handleOpenAddModal}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
                }}
              >
                <Plus size={18} />
                Add New Product
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: selectedCategory === cat.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: selectedCategory === cat.id ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: selectedCategory === cat.id ? '#f59e0b' : '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{
                  background: 'rgba(2, 6, 23, 0.8)',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                  color: '#94a3b8',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <th style={{ padding: '14px 16px' }}>Hardware Item</th>
                  <th style={{ padding: '14px 16px' }}>SKU & Spec</th>
                  <th style={{ padding: '14px 16px' }}>Category</th>
                  <th style={{ padding: '14px 16px' }}>Price (LKR)</th>
                  <th style={{ padding: '14px 16px' }}>Discount & Promo</th>
                  <th style={{ padding: '14px 16px' }}>Stock Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                      <Box size={40} style={{ margin: '0 auto 10px auto', opacity: 0.4 }} />
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#cbd5e1' }}>No hardware components found</div>
                      <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Try adjusting your search query or filters.</div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isDiscounted = p.originalPriceLKR && p.originalPriceLKR > p.priceLKR;
                    const discountPct = isDiscounted ? Math.round(((p.originalPriceLKR - p.priceLKR) / p.originalPriceLKR) * 100) : 0;

                    return (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                          transition: 'background 0.15s'
                        }}
                      >
                        {/* Product Title & Thumbnail */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '8px',
                              background: '#1e293b',
                              overflow: 'hidden',
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80';
                                  }}
                                />
                              ) : (
                                <Cpu size={20} color="#f59e0b" />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.92rem' }}>{p.name}</div>
                              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{p.brand || 'Buildify Hardware'}</div>
                            </div>
                          </div>
                        </td>

                        {/* SKU & Spec */}
                        <td style={{ padding: '14px 16px' }}>
                          <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', color: '#38bdf8' }}>
                            {p.sku}
                          </code>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                            {p.operatingVoltage} • {p.packageType}
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'rgba(148, 163, 184, 0.1)',
                            fontSize: '0.78rem',
                            color: '#cbd5e1',
                            textTransform: 'capitalize'
                          }}>
                            {p.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                            Rs. {Math.round(p.priceLKR).toLocaleString()}
                          </div>
                          {isDiscounted && (
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                              Rs. {Math.round(p.originalPriceLKR).toLocaleString()}
                            </div>
                          )}
                        </td>

                        {/* Discount & Promo */}
                        <td style={{ padding: '14px 16px' }}>
                          {isDiscounted ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.35)',
                                color: '#ef4444',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '12px'
                              }}>
                                -{discountPct}% OFF
                              </span>
                              {p.badge && (
                                <span style={{
                                  background: 'rgba(245, 158, 11, 0.15)',
                                  color: '#f59e0b',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  padding: '2px 6px',
                                  borderRadius: '6px'
                                }}>
                                  {p.badge}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Regular Price</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => handleToggleStock(p.id)}
                            title="Click to toggle In/Out of Stock"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: p.inStock ? (p.stockQuantity <= 5 ? '#f59e0b' : '#22c55e') : '#ef4444'
                            }}
                          >
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: p.inStock ? (p.stockQuantity <= 5 ? '#f59e0b' : '#22c55e') : '#ef4444'
                            }} />
                            {p.inStock ? `${p.stockQuantity} in Stock` : 'Out of Stock'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {/* Manage Discount Button */}
                            <button
                              onClick={() => handleOpenDiscountModal(p)}
                              title="Give discount / Flash sale"
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: isDiscounted ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                border: isDiscounted ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                                color: isDiscounted ? '#f59e0b' : '#cbd5e1',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Tag size={13} />
                              <span>Discount</span>
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              title="Edit product details"
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: 'rgba(56, 189, 248, 0.1)',
                                border: '1px solid rgba(56, 189, 248, 0.25)',
                                color: '#38bdf8',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setDeleteConfirmId(p.id)}
                              title="Delete product"
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                color: '#ef4444',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

        {/* ========================================================= */}
        {/* SECTION 2: CLIENT PROPOSALS & RFPs VIEW                   */}
        {/* ========================================================= */}
        {activeSection === 'rfps' && (
          <div>
            {/* RFP KPI Metrics Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}>
              {/* Metric 1: Total RFPs */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Inquiries Received</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>{rfpMetrics.total}</div>
                </div>
              </div>

              {/* Metric 2: New Submissions */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New / Action Required</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ef4444' }}>{rfpMetrics.newCount}</div>
                </div>
              </div>

              {/* Metric 3: Under Technical Review */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Review / Discovery</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>{rfpMetrics.inReview}</div>
                </div>
              </div>

              {/* Metric 4: Estimated Pipeline Value */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  <DollarSign size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Pipeline Value</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
                    Rs. {Math.round(rfpMetrics.totalPipelineLKR).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* RFP Action & Filter Bar */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '450px' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={rfpSearchQuery}
                  onChange={(e) => setRfpSearchQuery(e.target.value)}
                  placeholder="Search by Company, Contact Person, Phone, Scope..."
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 42px',
                    background: 'rgba(2, 6, 23, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Category & Status Filter Tabs */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Category Switcher */}
                <div style={{ display: 'inline-flex', background: 'rgba(2, 6, 23, 0.7)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                  <button
                    type="button"
                    onClick={() => setRfpCategoryFilter('all')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      background: rfpCategoryFilter === 'all' ? 'rgba(255,255,255,0.15)' : 'transparent',
                      color: rfpCategoryFilter === 'all' ? '#fff' : '#94a3b8'
                    }}
                  >
                    All Types
                  </button>
                  <button
                    type="button"
                    onClick={() => setRfpCategoryFilter('web')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      background: rfpCategoryFilter === 'web' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                      color: rfpCategoryFilter === 'web' ? '#38bdf8' : '#94a3b8'
                    }}
                  >
                    🌐 Web Quotes
                  </button>
                  <button
                    type="button"
                    onClick={() => setRfpCategoryFilter('iot')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      background: rfpCategoryFilter === 'iot' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                      color: rfpCategoryFilter === 'iot' ? '#f59e0b' : '#94a3b8'
                    }}
                  >
                    ⚡ IoT RFPs
                  </button>
                </div>

                {/* Status Filter Tabs */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['all', 'New', 'In Review', 'Quoted', 'Completed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRfpStatusFilter(st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: rfpStatusFilter === st ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: rfpStatusFilter === st ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                        color: rfpStatusFilter === st ? '#38bdf8' : '#cbd5e1'
                      }}
                    >
                      {st === 'all' ? 'All Statuses' : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RFPs Data Table */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(2, 6, 23, 0.6)', borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                      <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: 600 }}>Date</th>
                      <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: 600 }}>Company & Contact</th>
                      <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: 600 }}>Communication</th>
                      <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: 600 }}>Contract Scope & Est. Value</th>
                      <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProposals.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                          <FileText size={40} style={{ margin: '0 auto 12px auto', opacity: 0.3 }} />
                          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#cbd5e1' }}>No Proposals Found</div>
                          <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                            {rfpSearchQuery ? 'Try adjusting your search criteria.' : 'Client Request for Proposals submitted on the website will appear here in real-time.'}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProposals.map((rfp) => {
                        const dateStr = rfp.createdAt ? new Date(rfp.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
                        const cleanPhone = (rfp.phone || '').replace(/[^0-9]/g, '');

                        return (
                          <tr
                            key={rfp.id}
                            style={{
                              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            {/* Date */}
                            <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', color: '#94a3b8', fontSize: '0.8rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={13} color="#94a3b8" />
                                <span>{dateStr}</span>
                              </div>
                            </td>

                            {/* Company & Contact */}
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.94rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Building size={15} color="#38bdf8" />
                                <span>{rfp.companyName}</span>
                              </div>
                              <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={13} color="#94a3b8" />
                                <span>{rfp.contactPerson}</span>
                              </div>
                            </td>

                            {/* Communication */}
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {rfp.phone && (
                                  <a
                                    href={`https://wa.me/${cleanPhone.startsWith('94') ? cleanPhone : '94' + cleanPhone.replace(/^0/, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      color: '#22c55e',
                                      textDecoration: 'none',
                                      fontSize: '0.82rem',
                                      fontWeight: 600
                                    }}
                                  >
                                    <Phone size={13} />
                                    <span>{rfp.phone}</span>
                                  </a>
                                )}
                                {rfp.email && (
                                  <a
                                    href={`mailto:${rfp.email}`}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      color: '#94a3b8',
                                      textDecoration: 'none',
                                      fontSize: '0.8rem'
                                    }}
                                  >
                                    <Mail size={13} />
                                    <span>{rfp.email}</span>
                                  </a>
                                )}
                              </div>
                            </td>

                            {/* Contract Scope & Value */}
                            <td style={{ padding: '14px 16px', maxWidth: '320px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                {((rfp.category || '').toLowerCase().includes('web') || (rfp.contractType || '').toLowerCase().includes('web')) ? (
                                  <span style={{
                                    background: 'rgba(56, 189, 248, 0.15)',
                                    border: '1px solid rgba(56, 189, 248, 0.35)',
                                    color: '#38bdf8',
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700
                                  }}>
                                    🌐 Web App Quote
                                  </span>
                                ) : (
                                  <span style={{
                                    background: 'rgba(245, 158, 11, 0.15)',
                                    border: '1px solid rgba(245, 158, 11, 0.35)',
                                    color: '#f59e0b',
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700
                                  }}>
                                    ⚡ IoT Hardware RFP
                                  </span>
                                )}
                              </div>
                              <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.86rem' }}>
                                {rfp.contractType}
                              </div>
                              <div style={{ color: '#cbd5e1', fontSize: '0.82rem', marginTop: '2px' }}>
                                <strong>{rfp.volumeQty} {rfp.volumeQty === 1 ? 'project' : 'units'}</strong> • Est. Rs. {Math.round(rfp.estimatedValueLKR || 0).toLocaleString()}
                              </div>
                              {Array.isArray(rfp.addons) && rfp.addons.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                                  {rfp.addons.map((ad, idx) => (
                                    <span key={idx} style={{
                                      fontSize: '0.7rem',
                                      background: 'rgba(255,255,255,0.06)',
                                      color: '#94a3b8',
                                      padding: '1px 5px',
                                      borderRadius: '3px'
                                    }}>
                                      +{ad}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {rfp.projectBrief && (
                                <div style={{
                                  fontSize: '0.76rem',
                                  color: '#94a3b8',
                                  marginTop: '4px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '280px'
                                }}>
                                  "{rfp.projectBrief}"
                                </div>
                              )}
                            </td>

                            {/* Status */}
                            <td style={{ padding: '14px 16px' }}>
                              <select
                                value={rfp.status}
                                onChange={(e) => handleUpdateRfpStatus(rfp.id, e.target.value)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '20px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  background: rfp.status === 'New' ? 'rgba(239, 68, 68, 0.2)' : rfp.status === 'In Review' ? 'rgba(245, 158, 11, 0.2)' : rfp.status === 'Quoted' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                  color: rfp.status === 'New' ? '#f87171' : rfp.status === 'In Review' ? '#fbbf24' : rfp.status === 'Quoted' ? '#38bdf8' : '#4ade80',
                                  border: `1px solid ${rfp.status === 'New' ? 'rgba(239, 68, 68, 0.4)' : rfp.status === 'In Review' ? 'rgba(245, 158, 11, 0.4)' : rfp.status === 'Quoted' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
                                  outline: 'none'
                                }}
                              >
                                <option value="New" style={{ background: '#0f172a', color: '#fff' }}>🔴 New</option>
                                <option value="In Review" style={{ background: '#0f172a', color: '#fff' }}>🟡 In Review</option>
                                <option value="Quoted" style={{ background: '#0f172a', color: '#fff' }}>🔵 Quoted</option>
                                <option value="Completed" style={{ background: '#0f172a', color: '#fff' }}>🟢 Completed</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenProposalDetails(rfp)}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: 'rgba(56, 189, 248, 0.12)',
                                    border: '1px solid rgba(56, 189, 248, 0.3)',
                                    color: '#38bdf8',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <FileText size={13} />
                                  <span>View Scope</span>
                                </button>

                                {rfp.phone && (
                                  <a
                                    href={`https://wa.me/${cleanPhone.startsWith('94') ? cleanPhone : '94' + cleanPhone.replace(/^0/, '')}?text=${encodeURIComponent(`Hello ${rfp.contactPerson} from ${rfp.companyName}, this is Buildify Solutions regarding your Enterprise Request for Proposal.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Chat directly on WhatsApp"
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      background: 'rgba(34, 197, 94, 0.15)',
                                      border: '1px solid rgba(34, 197, 94, 0.3)',
                                      color: '#22c55e',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      textDecoration: 'none',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <Phone size={13} />
                                    <span>WhatsApp</span>
                                  </a>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleDeleteRfp(rfp.id)}
                                  title="Delete proposal"
                                  style={{
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.25)',
                                    color: '#ef4444',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* MODAL 1: ADD / EDIT PRODUCT (WITH PC IMAGE UPLOAD TO CLOUD)           */}
      {/* ===================================================================== */}
      {isAddEditOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '720px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#0f172a',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                  {editingProduct ? <Edit2 size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {editingProduct ? `Edit Component: ${editingProduct.name}` : 'Add New Hardware Component'}
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    Upload images from your PC directly to Cloud Storage and update website in real time.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEditOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Row 1: Name & SKU */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. ESP32-S3 Dual-Core N16R8"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                    Part Number / SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="BF-ESP32-S3"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '8px',
                      color: '#38bdf8',
                      fontFamily: 'monospace',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Category & Brand */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                    Brand / Manufacturer
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Espressif, Arduino, Waveshare, etc."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Operating Voltage & Package Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                    Operating Voltage
                  </label>
                  <input
                    type="text"
                    value={formData.operatingVoltage}
                    onChange={(e) => setFormData({ ...formData, operatingVoltage: e.target.value })}
                    placeholder="3.3V, 5V, 12V..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                    Package Type
                  </label>
                  <select
                    value={formData.packageType}
                    onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Breakout">Breakout Board</option>
                    <option value="Module">Module</option>
                    <option value="DIP">DIP</option>
                    <option value="SMD">SMD</option>
                    <option value="Chassis Kit">Chassis Kit</option>
                    <option value="Tool">Tool / Accessory</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                    Pin Count
                  </label>
                  <input
                    type="number"
                    value={formData.pinCount}
                    onChange={(e) => setFormData({ ...formData, pinCount: e.target.value })}
                    placeholder="e.g. 30"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Row 4: Pricing & Automatic Discount Calculator */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.65)',
                padding: '1.25rem',
                borderRadius: '14px',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} />
                    Pricing & Automatic Discount Calculator
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Enter original price & discount % to get sale price automatically
                  </span>
                </div>

                {/* 4 Columns: Original Price, Discount %, Final Sale Price, Badge */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1.2fr 1.1fr',
                  gap: '1rem'
                }}>
                  {/* Original / Regular Price */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                      Original Price (LKR)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={formData.originalPriceLKR}
                      onChange={(e) => handleFormOriginalPriceChange(e.target.value)}
                      placeholder="e.g. 2500"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(2, 6, 23, 0.8)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                      Regular item price
                    </div>
                  </div>

                  {/* Discount Percentage % */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8', marginBottom: '5px' }}>
                      Discount %
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={formDiscountPct}
                        onChange={(e) => handleFormDiscountPctChange(e.target.value)}
                        placeholder="e.g. 50"
                        style={{
                          width: '100%',
                          padding: '10px 28px 10px 12px',
                          background: 'rgba(2, 6, 23, 0.8)',
                          border: formDiscountPct ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.3)',
                          borderRadius: '8px',
                          color: '#38bdf8',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem' }}>
                        %
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: '4px' }}>
                      Auto-computes sum
                    </div>
                  </div>

                  {/* Final Sale Price (Customer Pays) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', marginBottom: '5px' }}>
                      Sale Price (LKR) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={formData.priceLKR}
                      onChange={(e) => handleFormSalePriceChange(e.target.value)}
                      placeholder="e.g. 1250"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1.5px solid #f59e0b',
                        borderRadius: '8px',
                        color: '#f59e0b',
                        fontWeight: 800,
                        fontSize: '1rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#f59e0b', marginTop: '4px', fontWeight: 600 }}>
                      Customer pays (auto)
                    </div>
                  </div>

                  {/* Badge / Tag */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. -50% OFF"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(2, 6, 23, 0.8)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.88rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                      Auto-syncs with %
                    </div>
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, marginRight: '4px' }}>
                    Quick %:
                  </span>
                  {[5, 10, 15, 20, 25, 30, 40, 50, 60, 75].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleFormDiscountPctChange(String(pct))}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: formDiscountPct === String(pct) ? '#f59e0b' : 'rgba(255, 255, 255, 0.06)',
                        color: formDiscountPct === String(pct) ? '#000' : '#cbd5e1',
                        border: formDiscountPct === String(pct) ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.12)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {pct}%
                    </button>
                  ))}
                  {formDiscountPct && (
                    <button
                      type="button"
                      onClick={() => handleFormDiscountPctChange('')}
                      style={{
                        padding: '4px 9px',
                        borderRadius: '6px',
                        fontSize: '0.73rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        marginLeft: '4px'
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Live Automatic Calculation Summary */}
                {formData.originalPriceLKR && formData.priceLKR && parseFloat(formData.originalPriceLKR) > parseFloat(formData.priceLKR) && (
                  <div style={{
                    background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.12), rgba(245, 158, 11, 0.12))',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#86efac', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✨</span>
                      <span>
                        Regular <strong>Rs. {Math.round(parseFloat(formData.originalPriceLKR)).toLocaleString()}</strong> with{' '}
                        <strong style={{ color: '#38bdf8' }}>{formDiscountPct || Math.round(((parseFloat(formData.originalPriceLKR) - parseFloat(formData.priceLKR)) / parseFloat(formData.originalPriceLKR)) * 100)}% Discount</strong>:
                      </span>
                    </span>
                    <span style={{ color: '#f59e0b', fontWeight: 800 }}>
                      Customer Pays: Rs. {Math.round(parseFloat(formData.priceLKR)).toLocaleString()}{' '}
                      <span style={{ color: '#86efac', fontWeight: 600, marginLeft: '6px' }}>
                        (Save Rs. {Math.round(parseFloat(formData.originalPriceLKR) - parseFloat(formData.priceLKR)).toLocaleString()})
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Row 5: Inventory Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                    Stock Units Available
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    placeholder="e.g. 50"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }}
                    />
                    <span style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
                      Mark as In Stock & Active for Sale
                    </span>
                  </label>
                </div>
              </div>

              {/* Row 6: ADVANCED IMAGE UPLOAD (FROM PC TO CLOUD STORAGE / DB) */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '14px',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cloud size={16} />
                    Product Image (Upload from PC to Cloud Database)
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>PNG, JPG, WEBP</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '1rem', alignItems: 'center' }}>
                  {/* File Upload Zone */}
                  <div>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) processImageFile(file);
                      }}
                      style={{
                        position: 'relative',
                        border: isDragging ? '2px dashed #38bdf8' : '2px dashed rgba(56, 189, 248, 0.45)',
                        borderRadius: '10px',
                        padding: '1.25rem 1rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: isDragging ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 6, 23, 0.5)',
                        transition: 'all 0.2s',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Native file input overlaid on top of dropzone for 100% reliable clicks */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                        onChange={handleImageFileUpload}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                          zIndex: 10
                        }}
                      />

                      {uploadingImage ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <Loader2 size={26} color="#38bdf8" style={{ animation: 'spin 1s linear infinite' }} />
                          <span style={{ fontSize: '0.84rem', color: '#38bdf8', fontWeight: 600 }}>
                            Optimizing & Uploading... {uploadProgress}%
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                            <Upload size={20} />
                          </div>
                          <span style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 700 }}>
                            Click to Choose Image from PC
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                            or drag and drop photo file here
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Image URL text fallback / review */}
                    <div style={{ marginTop: '10px' }}>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '3px' }}>
                        Stored Image Link (URL):
                      </label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://..."
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          background: 'rgba(2, 6, 23, 0.8)',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '6px',
                          color: '#38bdf8',
                          fontSize: '0.76rem',
                          fontFamily: 'monospace',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Image Live Preview */}
                  <div style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '10px',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    background: '#020617',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#64748b' }}>
                        <ImageIcon size={28} style={{ margin: '0 auto 4px auto' }} />
                        <span style={{ fontSize: '0.7rem' }}>No Image</span>
                      </div>
                    )}
                    <span style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '4px',
                      background: 'rgba(0,0,0,0.7)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      color: '#cbd5e1'
                    }}>
                      Preview
                    </span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Or choose sample:</span>
                  {SAMPLE_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.url })}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#cbd5e1',
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 7: Description & Datasheet */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                  Technical Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key features, wireless capabilities, pinout details..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                  Datasheet / Documentation URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.datasheetUrl}
                  onChange={(e) => setFormData({ ...formData, datasheetUrl: e.target.value })}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '8px',
                    color: '#38bdf8',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#cbd5e1',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#000',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} />
                  {editingProduct ? 'Save to Cloud DB' : 'Publish Product to DB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: QUICK DISCOUNT & FLASH SALE MANAGER                          */}
      {/* ===================================================================== */}
      {isDiscountModalOpen && discountTargetProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            background: '#0f172a',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                  <Tag size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    Manage Promotional Discount
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    {discountTargetProduct.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDiscountModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Current Price Display */}
            <div style={{
              background: 'rgba(2, 6, 23, 0.6)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.84rem', color: '#94a3b8' }}>Base Original Price:</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                  Rs. {Math.round(discountTargetProduct.originalPriceLKR || discountTargetProduct.priceLKR).toLocaleString()}
                </span>
              </div>
              {discountTargetProduct.originalPriceLKR && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.84rem', color: '#f59e0b' }}>Current Sale Price:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>
                    Rs. {Math.round(discountTargetProduct.priceLKR).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleApplyDiscount} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Preset Percentages */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                  Choose Discount Percentage
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[5, 10, 15, 20, 25, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSelectDiscountPct(pct)}
                      style={{
                        flex: '1 1 50px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        background: discountPercentInput === String(pct) ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.05)',
                        border: discountPercentInput === String(pct) ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                        color: discountPercentInput === String(pct) ? '#f59e0b' : '#cbd5e1',
                        cursor: 'pointer'
                      }}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Sale Price & Badge */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                    Calculated Sale Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={customDiscountPrice}
                    onChange={(e) => {
                      setCustomDiscountPrice(e.target.value);
                      const base = discountTargetProduct.originalPriceLKR || discountTargetProduct.priceLKR;
                      const val = parseFloat(e.target.value) || 0;
                      if (val < base) {
                        const pct = Math.round(((base - val) / base) * 100);
                        setCustomBadgeInput(`-${pct}% OFF`);
                      }
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '8px',
                      color: '#f59e0b',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                    Promo Badge
                  </label>
                  <input
                    type="text"
                    value={customBadgeInput}
                    onChange={(e) => setCustomBadgeInput(e.target.value)}
                    placeholder="e.g. -20% OFF"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem' }}>
                {discountTargetProduct.originalPriceLKR ? (
                  <button
                    type="button"
                    onClick={handleRemoveDiscount}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#ef4444',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Remove Discount
                  </button>
                ) : <div />}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsDiscountModalOpen(false)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#cbd5e1',
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: '#000',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Sparkles size={16} />
                    Apply Discount to DB
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: FIREBASE CLOUD DB & STORAGE SETTINGS                         */}
      {/* ===================================================================== */}
      {isFirebaseModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            background: '#0f172a',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  <Database size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    Firebase Cloud DB & Storage
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    Connect Firestore Database and Cloud Storage for photos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFirebaseModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: isFirebaseConfigured() ? 'rgba(34, 197, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: isFirebaseConfigured() ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
              marginBottom: '1.25rem',
              fontSize: '0.82rem',
              color: isFirebaseConfigured() ? '#86efac' : '#fcd34d'
            }}>
              {isFirebaseConfigured() 
                ? '✅ Cloud Firebase Connected. Real-time sync & image uploads are LIVE!' 
                : '⚡ Currently operating in Smart Dual Mode (Local persistence active). Paste your Firebase credentials below to enable cloud sync.'}
            </div>

            {firebaseMessage && (
              <div style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '1rem'
              }}>
                {firebaseMessage}
              </div>
            )}

            <form onSubmit={handleSaveFirebase} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  Firebase API Key (apiKey)
                </label>
                <input
                  type="text"
                  value={firebaseConfigForm.apiKey}
                  onChange={(e) => setFirebaseConfigForm({ ...firebaseConfigForm, apiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    Project ID
                  </label>
                  <input
                    type="text"
                    value={firebaseConfigForm.projectId}
                    onChange={(e) => setFirebaseConfigForm({ ...firebaseConfigForm, projectId: e.target.value })}
                    placeholder="buildify-solutions"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.84rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    Storage Bucket
                  </label>
                  <input
                    type="text"
                    value={firebaseConfigForm.storageBucket}
                    onChange={(e) => setFirebaseConfigForm({ ...firebaseConfigForm, storageBucket: e.target.value })}
                    placeholder="buildify-solutions.appspot.com"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.84rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  Auth Domain
                </label>
                <input
                  type="text"
                  value={firebaseConfigForm.authDomain}
                  onChange={(e) => setFirebaseConfigForm({ ...firebaseConfigForm, authDomain: e.target.value })}
                  placeholder="buildify-solutions.firebaseapp.com"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {testResult && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: testResult.success ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: testResult.success ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                  color: testResult.success ? '#86efac' : '#fca5a5',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {testResult.success ? <CheckCircle2 size={16} color="#22c55e" /> : <AlertTriangle size={16} color="#ef4444" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#38bdf8',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: testingConnection ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={14} className={testingConnection ? 'spin-animation' : ''} />
                  <span>{testingConnection ? 'Testing Connection...' : 'Test Connection'}</span>
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsFirebaseModalOpen(false)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#cbd5e1',
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Save & Connect Firebase
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: CHANGE SECURITY PASSWORD                                     */}
      {/* ===================================================================== */}
      {isChangePasswordOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            background: '#0f172a',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} color="#f59e0b" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Update Security Password
                </h3>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {passwordError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                marginBottom: '1rem'
              }}>
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                color: '#86efac',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                marginBottom: '1rem'
              }}>
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '8px',
                    color: '#fff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '8px',
                    color: '#fff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '8px',
                    color: '#fff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#cbd5e1',
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: '#f59e0b',
                    color: '#000',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 5: DELETE CONFIRMATION                                          */}
      {/* ===================================================================== */}
      {deleteConfirmId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            background: '#0f172a',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
              Delete Hardware Item?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1.5rem 0' }}>
              This action will remove this item from the Cloud DB and store catalog.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  background: '#ef4444',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Yes, Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 5: PROPOSAL SCOPE & CLIENT DETAILS MODAL                        */}
      {/* ===================================================================== */}
      {selectedProposal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#0f172a',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <Building size={20} color="#38bdf8" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {selectedProposal.companyName}
                  </h3>
                  <span style={{
                    background: ((selectedProposal.category || '').toLowerCase().includes('web') || (selectedProposal.contractType || '').toLowerCase().includes('web')) ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    border: `1px solid ${((selectedProposal.category || '').toLowerCase().includes('web') || (selectedProposal.contractType || '').toLowerCase().includes('web')) ? 'rgba(56, 189, 248, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
                    color: ((selectedProposal.category || '').toLowerCase().includes('web') || (selectedProposal.contractType || '').toLowerCase().includes('web')) ? '#38bdf8' : '#f59e0b',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700
                  }}>
                    {((selectedProposal.category || '').toLowerCase().includes('web') || (selectedProposal.contractType || '').toLowerCase().includes('web')) ? '🌐 Web App Project Quote' : '⚡ IoT Hardware RFP'}
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                  Contact: <strong style={{ color: '#cbd5e1' }}>{selectedProposal.contactPerson}</strong> • Submitted on {new Date(selectedProposal.createdAt || 0).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProposal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Quick Contact & Quotation Bar */}
            <div style={{
              background: 'rgba(2, 6, 23, 0.6)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase' }}>Contract Architecture</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>
                  {selectedProposal.contractType}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase' }}>Target Scale / Volume</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
                  {selectedProposal.volumeQty} {selectedProposal.volumeQty === 1 ? 'Project' : 'Units'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase' }}>Estimated Budget</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#22c55e', marginTop: '2px' }}>
                  Rs. {Math.round(selectedProposal.estimatedValueLKR || 0).toLocaleString()}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase' }}>Status</div>
                <select
                  value={selectedProposal.status}
                  onChange={(e) => handleUpdateRfpStatus(selectedProposal.id, e.target.value)}
                  style={{
                    marginTop: '2px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: '#020617',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    color: '#f8fafc',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  <option value="New">🔴 New Inquiry</option>
                  <option value="In Review">🟡 In Technical Review</option>
                  <option value="Quoted">🔵 Official Quotation Sent</option>
                  <option value="Completed">🟢 Project Contract Signed</option>
                </select>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {selectedProposal.phone && (
                <a
                  href={`https://wa.me/${(selectedProposal.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '94')}?text=${encodeURIComponent(`Hello ${selectedProposal.contactPerson} from ${selectedProposal.companyName}, this is Buildify Solutions engineering director contacting you regarding your project inquiry for ${selectedProposal.contractType}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: '#4ade80',
                    textDecoration: 'none',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Phone size={15} />
                  <span>Chat on WhatsApp ({selectedProposal.phone})</span>
                </a>
              )}

              {selectedProposal.email && (
                <a
                  href={`mailto:${selectedProposal.email}?subject=${encodeURIComponent(`Buildify Solutions Official Quotation & Scope Discovery - ${selectedProposal.companyName}`)}`}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Mail size={15} />
                  <span>Send Email ({selectedProposal.email})</span>
                </a>
              )}
            </div>

            {/* Requested Add-ons if present */}
            {Array.isArray(selectedProposal.addons) && selectedProposal.addons.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8', marginBottom: '6px' }}>
                  Requested Cloud & Stack Add-ons:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedProposal.addons.map((addon, idx) => (
                    <span key={idx} style={{
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#7dd3fc',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      ✓ {addon}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Scope & Brief Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Client Project Scope, Requirements & Specifications:
              </label>
              <div style={{
                background: 'rgba(2, 6, 23, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '10px',
                padding: '1rem',
                color: '#f1f5f9',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {selectedProposal.projectBrief || 'No additional technical notes provided by the client.'}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b', marginBottom: '6px' }}>
                Internal Admin Notes (Saved to Cloud DB):
              </label>
              <textarea
                rows={3}
                value={editingRfpNotes}
                onChange={(e) => setEditingRfpNotes(e.target.value)}
                placeholder="Write discovery meeting notes, quotation revisions, or engineer assignments..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(2, 6, 23, 0.8)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.86rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => handleSaveRfpNotes(selectedProposal.id, editingRfpNotes)}
                style={{
                  marginTop: '8px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid #f59e0b',
                  color: '#f59e0b',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save Notes
              </button>
            </div>

            {/* Footer buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => handleDeleteRfp(selectedProposal.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#ef4444',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Delete Inquiry
              </button>

              <button
                type="button"
                onClick={() => setSelectedProposal(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
