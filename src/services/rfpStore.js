import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const STORAGE_KEY = 'buildify_enterprise_rfps';
const FIRESTORE_COLLECTION = 'proposals';

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

// Initial sample enterprise proposals for initial demonstration
const SAMPLE_PROPOSALS = [
  {
    id: 'rfp-1726838400000',
    category: 'IoT Hardware',
    inquiryType: 'IoT Hardware',
    companyName: 'Ceylon Tea Agro-Tech PLC',
    contactPerson: 'Eng. Kasun Silva (Head of Automation)',
    phone: '+94 77 123 4567',
    email: 'kasun@ceylontea.lk',
    contractType: 'Smart Agriculture & Soil Microclimate Array',
    volumeQty: 120,
    estimatedValueLKR: 1548000,
    projectBrief: 'Need 120 solar-backed wireless LoRaWAN soil moisture/temperature probes with automated telemetry dashboard across our Nuwara Eliya estates.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    adminNotes: 'Priority client. Requested discovery call for next Tuesday.'
  },
  {
    id: 'rfp-1726752000000',
    category: 'Web Development',
    inquiryType: 'Web Development',
    companyName: 'Apex Lanka Logistics (Pvt) Ltd',
    contactPerson: 'Nimali Jayawardena',
    phone: '+94 71 445 6789',
    email: 'nimali@apexlanka.com',
    contractType: 'Web Dev: Warehouse Inventory & ERP',
    volumeQty: 1,
    estimatedValueLKR: 121000,
    addons: ['Custom Domain & DNS Setup', 'Firebase Cloud DB & Hosting'],
    projectBrief: 'Need a complete warehouse inventory management web application with multi-user roles, barcode scanning integration, and automated low-stock WhatsApp notifications.',
    status: 'In Review',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    adminNotes: 'Tech specs drafted. Preparing quotation for deployment.'
  }
];

class RFPStore {
  constructor() {
    this.listeners = new Set();
    this.proposals = this.loadLocalProposals();
    this.firestoreUnsubscribe = null;
    this.initFirestoreSync();
  }

  loadLocalProposals() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn('Failed to load local RFPs:', err);
    }
    return SAMPLE_PROPOSALS;
  }

  saveToStorage(proposals) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
    } catch (err) {
      console.error('Failed to save RFPs to localStorage:', err);
    }
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.proposals);
      } catch (err) {
        console.error('Error in rfpStore listener:', err);
      }
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    try {
      listener(this.proposals);
    } catch (e) {}
    return () => {
      this.listeners.delete(listener);
    };
  }

  getProposals() {
    return [...this.proposals];
  }

  async initFirestoreSync() {
    if (isFirebaseConfigured() && db) {
      try {
        const colRef = collection(db, FIRESTORE_COLLECTION);
        this.firestoreUnsubscribe = onSnapshot(colRef, (snapshot) => {
          if (!snapshot.empty) {
            const firestoreProposals = [];
            snapshot.forEach((d) => {
              firestoreProposals.push({ id: d.id, ...d.data() });
            });
            // Sort by createdAt descending (newest first)
            firestoreProposals.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            this.proposals = firestoreProposals;
            this.saveToStorage(this.proposals);
            this.notify();
            console.log(`🔥 Real-time sync: Loaded ${firestoreProposals.length} RFPs/Proposals from Firestore.`);
          } else {
            // Seed initial sample proposals into Firestore if empty
            this.seedFirestore();
          }
        }, (err) => {
          console.warn('Firestore proposals subscription notice:', err.message);
        });
      } catch (err) {
        console.warn('Firestore proposals initialization error:', err);
      }
    }
  }

  async seedFirestore() {
    if (!isFirebaseConfigured() || !db) return;
    try {
      for (const p of this.proposals) {
        await setDoc(doc(db, FIRESTORE_COLLECTION, p.id), sanitizeForFirestore(p), { merge: true });
      }
      console.log('✅ Firestore proposals seeded successfully.');
    } catch (e) {
      console.warn('Failed to seed proposals to Firestore:', e);
    }
  }

  async addProposal(formData) {
    const newRFP = {
      id: `rfp-${Date.now()}`,
      category: formData.category || (formData.inquiryType || 'IoT Hardware'),
      inquiryType: formData.inquiryType || (formData.category || 'IoT Hardware'),
      companyName: formData.companyName || 'Direct Client',
      contactPerson: formData.contactPerson || 'Representative',
      phone: formData.phone || '',
      email: formData.email || '',
      contractType: formData.contractType || 'Custom Project Scope',
      volumeQty: parseInt(formData.volumeQty, 10) || 1,
      estimatedValueLKR: parseFloat(formData.estimatedValueLKR) || 0,
      projectBrief: formData.projectBrief || '',
      addons: Array.isArray(formData.addons) ? formData.addons : [],
      status: 'New',
      createdAt: new Date().toISOString(),
      adminNotes: ''
    };

    // Save locally
    this.proposals = [newRFP, ...this.proposals];
    this.saveToStorage(this.proposals);
    this.notify();

    // Sync to Firestore
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, FIRESTORE_COLLECTION, newRFP.id), sanitizeForFirestore(newRFP));
        console.log('✅ Proposal synced to Firebase Firestore:', newRFP.id);
      } catch (err) {
        console.warn('Firestore add proposal error:', err);
      }
    }

    return newRFP;
  }

  async updateProposalStatus(id, newStatus, adminNotes) {
    let updatedItem = null;
    this.proposals = this.proposals.map((p) => {
      if (p.id === id) {
        updatedItem = {
          ...p,
          status: newStatus || p.status,
          adminNotes: adminNotes !== undefined ? adminNotes : p.adminNotes
        };
        return updatedItem;
      }
      return p;
    });

    this.saveToStorage(this.proposals);
    this.notify();

    if (isFirebaseConfigured() && db && updatedItem) {
      try {
        await setDoc(doc(db, FIRESTORE_COLLECTION, id), sanitizeForFirestore(updatedItem), { merge: true });
      } catch (err) {
        console.warn('Firestore update proposal notice:', err);
      }
    }

    return updatedItem;
  }

  async deleteProposal(id) {
    this.proposals = this.proposals.filter((p) => p.id !== id);
    this.saveToStorage(this.proposals);
    this.notify();

    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, FIRESTORE_COLLECTION, id));
      } catch (err) {
        console.warn('Firestore delete proposal error:', err);
      }
    }
  }
}

export const rfpStore = new RFPStore();
