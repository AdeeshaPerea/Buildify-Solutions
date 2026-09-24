import React, { useState, useEffect, useMemo, useRef } from 'react';
import Logo from './Logo';
import { BUILDIFY_DATA } from '../data/buildifyData';
import { productStore } from '../services/productStore';
import { rfpStore } from '../services/rfpStore';
import { currencyService } from '../services/currencyService';
import {
  Cpu,
  Zap,
  Flame,
  Truck,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Lock,
  SlidersHorizontal,
  Search,
  ShoppingCart,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Trash2,
  Award,
  Wrench,
  Layers,
  Box,
  Sparkles,
  Send,
  Radio,
  Activity,
  FileText,
  Maximize2,
  HelpCircle,
  ChevronDown,
  Copy,
  Check,
  Calculator,
  Navigation,
  AlertCircle,
  AlertTriangle,
  Building2
} from 'lucide-react';
import StoreMaintenanceView from './StoreMaintenanceView';

// =========================================================================
// HARDWARE STORE MAINTENANCE MODE TOGGLE
// Default is FALSE (active live hardware store with updated stock).
// Set to TRUE to display the Mascot Under-Maintenance / Lab Restock screen.
// Can also be previewed by adding ?maintenance=true to the URL.
// =========================================================================
export const IS_STORE_UNDER_MAINTENANCE = false;

const checkMaintenanceMode = () => {
  if (typeof window === 'undefined') return IS_STORE_UNDER_MAINTENANCE;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('maintenance') === 'true' || params.get('restock') === 'true') return true;
    if (params.get('maintenance') === 'false' || params.get('restock') === 'false') return false;
    const stored = localStorage.getItem('buildify_store_maintenance');
    if (stored !== null) return stored === 'true';
  } catch (e) {}
  return IS_STORE_UNDER_MAINTENANCE;
};

export default function IoTPage({ 
  onBackToGateway, 
  onSwitchToWeb, 
  onOpenAdmin,
  activeTab: propActiveTab = 'store',
  onTabChange
}) {
  const isMaintenanceActive = checkMaintenanceMode();
  // Navigation tabs: 'store' (Hardware Store) | 'about' (About Us) | 'contracts' (Bulk Stock & Custom Projects) | 'delivery' | 'policies' | 'faq'
  const [internalTab, setInternalTab] = useState(propActiveTab);
  const activeTab = propActiveTab || internalTab;

  useEffect(() => {
    if (propActiveTab && propActiveTab !== internalTab) {
      setInternalTab(propActiveTab);
    }
  }, [propActiveTab]);

  const setActiveTab = (tab) => {
    setInternalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Currency State: 'LKR' | 'USD' (Powered by Live Real-Time Forex Rate)
  const [currency, setCurrency] = useState('LKR');
  const [forexData, setForexData] = useState(currencyService.getRate());

  useEffect(() => {
    const unsubForex = currencyService.subscribe((data) => {
      setForexData(data);
    });
    return () => unsubForex();
  }, []);

  // Search & Filter States for Store
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedVoltage, setSelectedVoltage] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Cart Drawer State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Video / Canvas Lab State
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const fpsReadoutRef = useRef(null);
  const canvasRef = useRef(null);

  // Bulk / Custom Contract Estimator State
  const [contractType, setContractType] = useState('industrial_iot');
  const [volumeQty, setVolumeQty] = useState(50);
  const [includeFirmware, setIncludeFirmware] = useState(true);
  const [includeCloudServer, setIncludeCloudServer] = useState(true);
  const [include3DEnclosure, setInclude3DEnclosure] = useState(false);
  const [contractForm, setContractForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    projectBrief: '',
    bomList: ''
  });
  const [contractSubmitted, setContractSubmitted] = useState(false);

  // Interactive Delivery Rate Calculator & Vehicle State
  const [deliveryWeight, setDeliveryWeight] = useState(1.0);
  const [deliveryVehicle, setDeliveryVehicle] = useState('motorcycle');
  const [copiedKey, setCopiedKey] = useState(null);

  const calculateCourierFee = (weightKg) => {
    const w = Math.max(0.01, parseFloat(weightKg) || 0.01);
    if (w <= 1.0) {
      return {
        baseFee: 580,
        extraKg: 0,
        extraFee: 0,
        total: 580,
        breakdownText: "Rs. 580 (Minimum charge for first 1kg)"
      };
    }
    const extraKg = Math.ceil(w - 1.0);
    const extraFee = extraKg * 160;
    const total = 580 + extraFee;
    return {
      baseFee: 580,
      extraKg,
      extraFee,
      total,
      breakdownText: `Rs. 580 (1st kg) + Rs. ${extraFee.toLocaleString()} (${extraKg}kg additional) = Rs. ${total.toLocaleString()} total`
    };
  };

  const handleCopyText = (text, key) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Cyber-Modules Interactive Tab State
  const [pillarTab, setPillarTab] = useState({
    firmware: 'overview',
    telemetry: 'overview',
    pcb: 'overview'
  });

  // Policy Claim FAQ State
  const [openPolicyFaq, setOpenPolicyFaq] = useState(null);

  // FAQ Filter & Accordion State
  const [faqCategory, setFaqCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqItems = [
    {
      category: 'delivery',
      q: "Do you guarantee 24-hour delivery across Sri Lanka?",
      a: "Yes! All orders confirmed before 1:00 PM on working days are dispatched on the same day. Deliveries in Colombo and Greater Suburbs typically arrive within 12–24 hours, while all other 25 islandwide districts arrive within 24–48 hours via registered express courier (First 1kg: Rs. 580, +Rs. 160 per additional kg)."
    },
    {
      category: 'delivery',
      q: "Can I get 1-hour urgent delivery within the Colombo district?",
      a: "Yes! For urgent deliveries within the Colombo district, you can choose Quick Delivery via PickMe Flash or Uber Package. Place your order with 'Uber / Pickme collection' in the comments, and our team at Buildify Solutions (Wewalduwa, Tyre Junction, Kelaniya / 071 7790035) will prepare your items for immediate driver handover within the hour."
    },
    {
      category: 'technical',
      q: "Why do ESP32 and Raspberry Pi GPIOs burn when connected to 5V sensors?",
      a: "Devices such as Raspberry Pi and NodeMCU (ESP8266, ESP32) operate strictly at 3.3V TTL logic levels. If you connect an Arduino 5V output directly to a 3.3V GPIO without a bidirectional logic level shifter or voltage divider, it can permanently burn the silicon chip, which voids the warranty. Always verify your voltage logic before powering."
    },
    {
      category: 'technical',
      q: "Are all microcontrollers, sensors, and ICs 100% genuine?",
      a: "Yes. All our development boards (Espressif ESP32, Arduino, Raspberry Pi, RP2040) and semiconductor ICs are sourced directly from authorized manufacturers and verified global distributors. Every batch undergoes visual inspection and sample power-on bootloader tests in our lab."
    },
    {
      category: 'warranty',
      q: "What is your warranty policy for electronic modules and tools?",
      a: "We provide a 6-month warranty on Electronic Modules and Electronic Tools, and 1-year warranty on 3D Printers against genuine manufacturing defects. Passive components (ICs, transistors, diodes, resistors), batteries, and jumper wires are excluded. All transport and courier charges for warranty inspections must be borne by the customer."
    },
    {
      category: 'warranty',
      q: "Why is there a testing fee of Rs. 1,000/hour if an item is found working or burned due to misuse?",
      a: "If an item submitted for warranty is tested and found fully functional, or burned due to reverse polarity/overvoltage/miswiring, our qualified engineering team issues a technical test report/video proof. A fee of Rs. 1,000 per hour is charged for the diagnostic bench time spent by our technical staff."
    },
    {
      category: 'warranty',
      q: "Can I return or exchange an item after opening the packaging or breaking the seal?",
      a: "No. We maintain a strict No-Return and No-Exchange policy once the security seal is broken, heat-sealed anti-static bag is cut, or the product is taken out of its factory packaging. Because microcontrollers, ICs, and sensors are highly sensitive to Electrostatic Discharge (ESD), reverse polarity, and soldering heat, goods are strictly non-returnable once unsealed. Returns or exchanges are only eligible within 7 days if the item is 100% unopened in pristine original factory sealed condition."
    },
    {
      category: 'technical',
      q: "Can you solder headers or pre-flash custom firmware for my order?",
      a: "Absolutely! We provide pin header soldering, bootloader flashing, and pre-configured test firmware on request. Simply mention your requirement in your WhatsApp order message or checkout note."
    },
    {
      category: 'custom',
      q: "How do I place bulk orders for school or university STEM labs?",
      a: "Navigate to our 'Bulk Stock & Custom Contracts' tab where you can use our interactive volume estimator (discounts up to 20% for 50+ units). You can also submit an official RFP or contact us directly on 071 7790035 (buildifysoluition@gmail.com) for formal institutional quotations."
    }
  ];

  // Currency Formatter Helper (Real-time live forex conversion)
  const formatPrice = (lkrAmount) => {
    return currencyService.formatPrice(lkrAmount, currency);
  };

  // Cart Operations
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartSubtotalLKR = cart.reduce((sum, item) => sum + (item.priceLKR * item.qty), 0);
  const cartTotalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // Checkout via WhatsApp
  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const itemsList = cart.map(item => `• ${item.name} (x${item.qty}) - ${formatPrice(item.priceLKR * item.qty)}`).join('\n');
    const text = encodeURIComponent(
      `Hello Buildify Solutions IoT Order Desk,\n\nI want to place an order for the following hardware items:\n\n${itemsList}\n\nTotal: ${formatPrice(cartSubtotalLKR)} (${currency})\nDelivery: 24-Hour Express Islandwide Delivery\n\nPlease confirm stock and send payment / bank details.`
    );
    window.open(`https://wa.me/94717790035?text=${text}`, '_blank');
  };

  // Direct 1-Click Buy for a Single Item
  const handleInstantBuy = (product) => {
    const text = encodeURIComponent(
      `Hello Buildify Solutions IoT Desk,\n\nI want to buy:\nItem: ${product.name} (SKU: ${product.sku})\nPrice: ${formatPrice(product.priceLKR)} (${currency})\nDelivery: 24-Hour Express Delivery\n\nPlease confirm availability and dispatch details.`
    );
    window.open(`https://wa.me/94717790035?text=${text}`, '_blank');
  };

  // Dynamic Products Catalog & Categories (Synced with productStore and LocalStorage)
  const [allProducts, setAllProducts] = useState(productStore.getProducts());
  const [storeCategories, setStoreCategories] = useState(productStore.getCategories());

  useEffect(() => {
    const unsubscribe = productStore.subscribe((updated) => {
      setAllProducts(updated);
    });
    const unsubscribeCategories = productStore.subscribeCategories((cats) => {
      setStoreCategories(cats);
    });
    return () => {
      unsubscribe();
      unsubscribeCategories();
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchDesc) return false;
      }
      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      // Brand
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
      // Voltage
      if (selectedVoltage !== 'All' && !p.operatingVoltage.includes(selectedVoltage)) return false;
      // In Stock
      if (inStockOnly && !p.inStock) return false;
      // Discounted / Flash Deals
      if (onlyDiscounted && (!p.originalPriceLKR || p.originalPriceLKR <= p.priceLKR)) return false;

      return true;
    });
  }, [allProducts, searchQuery, selectedCategory, selectedBrand, selectedVoltage, inStockOnly, onlyDiscounted]);

  // Flash Sale / Discounted Products for Highlight Carousel
  const flashSaleProducts = useMemo(() => {
    return allProducts.filter(p => p.originalPriceLKR && p.originalPriceLKR > p.priceLKR);
  }, [allProducts]);

  // Custom Contract Types & Pricing Calculation
  const contractTiers = {
    industrial_iot: {
      title: "Industrial Telemetry & Factory SCADA Grid",
      unitBaseLKR: 18500,
      desc: "Robust ESP32/RS485 sensor nodes, central MQTT telemetry gateway, DIN-rail mounting & web dashboard integration."
    },
    smart_agri: {
      title: "Smart Agriculture & Soil Microclimate Array",
      unitBaseLKR: 14200,
      desc: "Solar-backed wireless sensor hubs, soil moisture/EC probes, solenoid valve actuators & cloud telemetry."
    },
    robotics_auto: {
      title: "Custom Conveyor & Robotic Sorting Arm Cell",
      unitBaseLKR: 45000,
      desc: "Stepper/servo motion control, vision sensor sorting, industrial PLC interface & safety interlocks."
    },
    stem_kits: {
      title: "Bulk University / STEM Maker Lab Kits",
      unitBaseLKR: 9800,
      desc: "Custom branded boxed starter kits (ESP32, 25+ sensors, breadboards, OLED, jumper wires, digital manual)."
    }
  };

  const selectedTier = contractTiers[contractType] || contractTiers.industrial_iot;
  let unitAddOnsLKR = 0;
  if (includeFirmware) unitAddOnsLKR += 2500;
  if (includeCloudServer) unitAddOnsLKR += 3000;
  if (include3DEnclosure) unitAddOnsLKR += 1800;

  // Volume discount calculation (5% at 50 units, 12% at 100+, 20% at 250+)
  let volumeDiscountPct = 0;
  if (volumeQty >= 250) volumeDiscountPct = 20;
  else if (volumeQty >= 100) volumeDiscountPct = 12;
  else if (volumeQty >= 50) volumeDiscountPct = 5;

  const grossContractLKR = (selectedTier.unitBaseLKR + unitAddOnsLKR) * volumeQty;
  const netContractLKR = grossContractLKR * (1 - volumeDiscountPct / 100);

  const handleContractSubmit = async (e) => {
    e.preventDefault();
    if (!contractForm.companyName || !contractForm.phone) return;

    try {
      await rfpStore.addProposal({
        category: 'IoT Hardware',
        inquiryType: 'IoT Hardware',
        companyName: contractForm.companyName,
        contactPerson: contractForm.contactPerson,
        phone: contractForm.phone,
        email: contractForm.email,
        projectBrief: contractForm.projectBrief,
        contractType: selectedTier.title,
        volumeQty: volumeQty,
        estimatedValueLKR: netContractLKR
      });
    } catch (err) {
      console.warn('Failed to record proposal in database:', err);
    }

    setContractSubmitted(true);
  };

  const handleContractWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Buildify Solutions Engineering Directors,\n\nI would like to submit a Custom Project / Bulk Stock Inquiry.\nCompany: ${contractForm.companyName || 'Enterprise'}\nContact Person: ${contractForm.contactPerson || 'Representative'}\nPhone: ${contractForm.phone || 'N/A'}\nContract Type: ${selectedTier.title}\nQuantity: ${volumeQty} units\nEstimated Contract Value: ${formatPrice(netContractLKR)} (${currency})\nVolume Discount Applied: ${volumeDiscountPct}%\nProject Brief: ${contractForm.projectBrief || 'See attached requirements'}\n\nPlease contact me to schedule a technical discovery meeting.`
    );
    window.open(`https://wa.me/94717790035?text=${text}`, '_blank');
  };

  // High-Performance Hardware-Accelerated Canvas Animation for Video Lab Theater
  useEffect(() => {
    if (activeTab !== 'about') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Pause animation when scrolled off-screen to save 100% GPU / CPU
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    }, { threshold: 0.1 });
    observer.observe(canvas);

    // Simulated animated circuit trace particles
    const nodes = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2.5 + 2,
      pulse: Math.random() * Math.PI
    }));

    let frameCount = 0;
    let lastTime = performance.now();

    const render = (time) => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      frameCount++;
      if (time - lastTime >= 1000) {
        if (fpsReadoutRef.current) {
          fpsReadoutRef.current.textContent = frameCount;
        }
        frameCount = 0;
        lastTime = time;
      }

      ctx.fillStyle = 'rgba(7, 9, 14, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw Nodes and Connecting Traces
      nodes.forEach((node, i) => {
        if (isPlayingVideo) {
          node.x += node.vx;
          node.y += node.vy;
          node.pulse += 0.04;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(255, 133, 27, ${1 - dist / 120})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw glow node using fast native GPU alpha blending (no expensive shadowBlur fallback)
        const glow = Math.sin(node.pulse) * 1.5 + 2.5;
        ctx.fillStyle = 'rgba(255, 107, 0, 0.25)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + glow + 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + glow * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Center IC Processor Core Hologram
      const cx = width / 2;
      const cy = height / 2;
      const icSize = 110;
      ctx.strokeStyle = '#ff851b';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - icSize / 2, cy - icSize / 2, icSize, icSize);

      ctx.fillStyle = 'rgba(255, 107, 0, 0.12)';
      ctx.fillRect(cx - icSize / 2, cy - icSize / 2, icSize, icSize);

      ctx.font = '12px monospace';
      ctx.fillStyle = '#ffaa00';
      ctx.textAlign = 'center';
      ctx.fillText('BUILDIFY IoT CORE', cx, cy - 8);
      ctx.fillText('ESP32 / LoRaWAN', cx, cy + 12);
      ctx.fillText('TELEMETRY: ACTIVE', cx, cy + 28);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, isPlayingVideo]);

  return (
    <div className="iot-platform-page">
      {/* Amber Circuit Background Ambient & Cyber Cloud Atmosphere */}
      <div className="iot-circuit-ambient">
        {/* Animated Cyber Cloud Atmosphere (Solar Amber) */}
        <div className="cyber-cloud-backdrop iot-cloud-backdrop">
          <div className="cloud-puff cloud-amber-1"></div>
          <div className="cloud-puff cloud-amber-2"></div>
          <div className="cloud-puff cloud-amber-3"></div>
          <div className="cloud-puff cloud-amber-4"></div>
          <div className="cloud-puff cloud-amber-5"></div>
          <div className="cloud-mist-stream stream-amber-1"></div>
          <div className="cloud-mist-stream stream-amber-2"></div>
        </div>

        <div className="iot-matrix-grid"></div>
        <div className="iot-glow-spot spot-1"></div>
        <div className="iot-glow-spot spot-2"></div>
        <div className="iot-glow-spot spot-3"></div>
        <svg className="iot-traces-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="amberTraceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff851b" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#ff4500" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="pulseAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff851b" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffaa00" />
            </linearGradient>
            <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Static Traces */}
          <path d="M 0 140 H 260 L 320 200 H 680 L 740 140 H 1600" stroke="url(#amberTraceGrad)" strokeWidth="1.5" fill="none" />
          <path d="M 180 0 V 180 L 240 240 H 840 L 900 300 V 900" stroke="url(#amberTraceGrad)" strokeWidth="1.5" fill="none" />
          <path d="M 400 800 L 460 740 H 960 L 1020 800 H 1800" stroke="url(#amberTraceGrad)" strokeWidth="1.5" fill="none" />
          <path d="M 100 500 L 350 500 L 410 560 H 1150 L 1210 500 H 1700" stroke="url(#amberTraceGrad)" strokeWidth="1.5" fill="none" />

          {/* Animated Laser Pulse Beams Shooting Along The Traces */}
          <path d="M 0 140 H 260 L 320 200 H 680 L 740 140 H 1600" stroke="url(#pulseAmberGrad)" strokeWidth="2.5" fill="none" filter="url(#glowAmber)" className="laser-pulse-run-amber pulse-fast" />
          <path d="M 180 0 V 180 L 240 240 H 840 L 900 300 V 900" stroke="url(#pulseAmberGrad)" strokeWidth="2.5" fill="none" filter="url(#glowAmber)" className="laser-pulse-run-amber pulse-medium" />
          <path d="M 400 800 L 460 740 H 960 L 1020 800 H 1800" stroke="url(#pulseAmberGrad)" strokeWidth="2.5" fill="none" filter="url(#glowAmber)" className="laser-pulse-run-amber pulse-slow" />
          <path d="M 100 500 L 350 500 L 410 560 H 1150 L 1210 500 H 1700" stroke="url(#pulseAmberGrad)" strokeWidth="2.5" fill="none" filter="url(#glowAmber)" className="laser-pulse-run-amber pulse-reverse" />

          {/* Glowing Junction Nodes with Shockwaves */}
          <g className="pulsing-node" transform="translate(320, 200)">
            <circle cx="0" cy="0" r="8" fill="rgba(255, 133, 27, 0.25)" className="node-shockwave" />
            <circle cx="0" cy="0" r="4" fill="#ff851b" />
          </g>
          <g className="pulsing-node" transform="translate(740, 140)">
            <circle cx="0" cy="0" r="8" fill="rgba(255, 133, 27, 0.25)" className="node-shockwave delay-1" />
            <circle cx="0" cy="0" r="4" fill="#ff851b" />
          </g>
          <g className="pulsing-node" transform="translate(900, 300)">
            <circle cx="0" cy="0" r="8" fill="rgba(255, 133, 27, 0.25)" className="node-shockwave delay-2" />
            <circle cx="0" cy="0" r="4" fill="#ff851b" />
          </g>
          <g className="pulsing-node" transform="translate(1020, 800)">
            <circle cx="0" cy="0" r="8" fill="rgba(255, 133, 27, 0.25)" className="node-shockwave delay-3" />
            <circle cx="0" cy="0" r="4" fill="#ff851b" />
          </g>
        </svg>

        {/* Ambient Floating Digital Particles */}
        <div className="cyber-particles-field">
          <span className="c-particle-amber p1"></span>
          <span className="c-particle-amber p2"></span>
          <span className="c-particle-amber p3"></span>
          <span className="c-particle-amber p4"></span>
          <span className="c-particle-amber p5"></span>
          <span className="c-particle-amber p6"></span>
        </div>
      </div>

      {/* Express 24-Hour Islandwide Delivery Top Banner */}
      <div className="iot-express-strip">
        <div className="express-strip-container">
          <div className="strip-badge-live">
            <span className="live-amber-dot"></span>
            <strong>24-HOUR EXPRESS ISLANDWIDE DELIVERY</strong>
          </div>
          <div className="strip-info-ticker">
            <span>⚡ Orders placed before 3:00 PM dispatched same-day via prompt courier across all 25 districts in Sri Lanka.</span>
          </div>
          <div className="strip-action-contact">
            <a href="tel:0717790035" className="strip-phone-link">
              <Phone size={13} /> 071 7790035
            </a>
          </div>
        </div>
      </div>

      {/* Main High-Tech IoT Header */}
      <header className="iot-main-nav-bar">
        <div className="iot-nav-container">
          <div className="iot-nav-brand-group">
            <div 
              className="iot-brand-wrap" 
              onClick={onBackToGateway} 
              style={{ cursor: 'pointer' }}
              title="Return to Buildify Gateway"
            >
              <Logo size="small" showTagline={true} />
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="iot-primary-tabs">
            <button
              className={`iot-tab-item ${activeTab === 'store' ? 'active' : ''}`}
              onClick={() => setActiveTab('store')}
            >
              <Box size={15} />
              <span>Hardware Store</span>
              {isMaintenanceActive && (
                <span className="tab-maintenance-tag">Upgrading</span>
              )}
            </button>

            <button
              className={`iot-tab-item ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <Radio size={15} />
              <span>About Us</span>
            </button>

            <button
              className={`iot-tab-item tab-highlight ${activeTab === 'contracts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contracts')}
            >
              <Award size={15} />
              <span>Bulk Stock & Custom Contracts</span>
            </button>

            <button
              className={`iot-tab-item ${activeTab === 'delivery' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivery')}
            >
              <Truck size={15} />
              <span>Delivery</span>
            </button>

            <button
              className={`iot-tab-item ${activeTab === 'policies' ? 'active' : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              <ShieldCheck size={15} />
              <span>Policies</span>
            </button>

            <button
              className={`iot-tab-item ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <HelpCircle size={15} />
              <span>FAQ</span>
            </button>
          </nav>

          {/* Right Controls: Currency Switcher & Cart */}
          <div className="iot-nav-actions">
            {/* Currency Switcher (LKR / USD with Real-Time Forex) */}
            <div className="iot-currency-toggle" title={`Real-time Forex: 1 USD ≈ Rs. ${forexData.rate} (${forexData.lastUpdated})`}>
              <button
                className={`curr-toggle-btn ${currency === 'LKR' ? 'active' : ''}`}
                onClick={() => setCurrency('LKR')}
              >
                LKR
              </button>
              <button
                className={`curr-toggle-btn ${currency === 'USD' ? 'active' : ''}`}
                onClick={() => setCurrency('USD')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                title={`Live Real-Time Rate: 1 USD ≈ Rs. ${forexData.rate}`}
              >
                <span>USD</span>
                {forexData.isLive && (
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                )}
              </button>
            </div>

            {/* Switch to Web */}
            <button className="switch-portal-btn" onClick={onSwitchToWeb} title="Switch to Web Development">
              <span>Web Studio</span>
              <ArrowRight size={13} />
            </button>

            {/* Cart Drawer Trigger */}
            <button className="iot-cart-btn" onClick={() => setIsCartOpen(true)} title="View Shopping Cart">
              <ShoppingCart size={18} />
              {cartTotalItems > 0 && <span className="cart-counter-badge">{cartTotalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          TAB 1: HARDWARE STORE & FLASH DEALS
          ========================================================= */}
      {activeTab === 'store' && (
        isMaintenanceActive ? (
          <StoreMaintenanceView
            onSwitchToContracts={() => setActiveTab('contracts')}
            onSwitchToWeb={onSwitchToWeb}
          />
        ) : (
        <main className="iot-store-view">
          {/* Flash Deals & Sale Highlights Carousel */}
          <section className="iot-flash-sales-section">
            <div className="section-container">
              <div className="flash-sale-header">
                <div className="flash-title-wrap">
                  <div className="fire-icon-badge">
                    <Flame size={18} className="flame-icon" />
                  </div>
                  <div>
                    <h3 className="flash-section-title">Flash Deals & Maker Discounts</h3>
                    <p className="flash-section-sub">Limited-time promotional discounts with guaranteed 24-hour dispatch.</p>
                  </div>
                </div>

                <button
                  className={`deal-filter-toggle ${onlyDiscounted ? 'active' : ''}`}
                  onClick={() => setOnlyDiscounted(!onlyDiscounted)}
                >
                  <Sparkles size={14} />
                  <span>{onlyDiscounted ? 'Show All Products' : 'Filter Sale Items Only'}</span>
                </button>
              </div>

              <div className="flash-cards-carousel">
                {flashSaleProducts.slice(0, 4).map((deal) => {
                  const discountPct = Math.round(((deal.originalPriceLKR - deal.priceLKR) / deal.originalPriceLKR) * 100);
                  return (
                    <div key={deal.id} className="deal-card-item">
                      <div className="deal-img-wrap" onClick={() => setActiveModalProduct(deal)}>
                        <img src={deal.image} alt={deal.name} className="deal-thumb" />
                        <span className="deal-discount-badge">-{discountPct}% OFF</span>
                        <span className="deal-express-badge">
                          <Truck size={11} /> 24H Delivery
                        </span>
                      </div>

                      <div className="deal-card-info">
                        <span className="deal-sku-tag">{deal.sku}</span>
                        <h4 className="deal-name" onClick={() => setActiveModalProduct(deal)}>{deal.name}</h4>
                        <div className="deal-pricing-row">
                          <strong className="deal-sale-price">{formatPrice(deal.priceLKR)}</strong>
                          <span className="deal-orig-price">{formatPrice(deal.originalPriceLKR)}</span>
                        </div>
                        <div className="deal-stock-bar">
                          <div className="stock-fill" style={{ width: `${Math.min(100, (deal.stockQuantity / 50) * 100)}%` }}></div>
                        </div>
                        <div className="deal-stock-label">{deal.stockQuantity} units left in stock</div>

                        <div className="deal-btn-row">
                          <button className="deal-add-cart-btn" onClick={() => addToCart(deal)}>
                            <ShoppingCart size={13} /> Add
                          </button>
                          <button className="deal-buy-btn" onClick={() => handleInstantBuy(deal)}>
                            Instant Buy ↗
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Master Storefront: Left Faceted Sidebar + Right Products Grid */}
          <section className="iot-store-layout-section">
            <div className="section-container">
              {/* Mobile Filter & Quick Category Bar (Visible only on <= 992px) */}
              <div className="iot-mobile-filter-bar">
                <button 
                  className={`mobile-filter-toggle-btn ${isMobileFiltersOpen ? 'active' : ''}`}
                  onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                  <SlidersHorizontal size={15} />
                  <span>{isMobileFiltersOpen ? 'Close Filters' : 'Filter by Specs & Voltage'}</span>
                  {(selectedCategory !== 'all' || selectedBrand !== 'All' || selectedVoltage !== 'All' || inStockOnly || onlyDiscounted || searchQuery) && (
                    <span className="mobile-filter-count-badge">Active</span>
                  )}
                </button>

                {(selectedCategory !== 'all' || selectedBrand !== 'All' || selectedVoltage !== 'All' || inStockOnly || onlyDiscounted || searchQuery) && (
                  <button 
                    className="mobile-filter-reset-btn"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedBrand('All');
                      setSelectedVoltage('All');
                      setInStockOnly(false);
                      setOnlyDiscounted(false);
                      setSearchQuery('');
                    }}
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Mobile Quick Category Horizontal Scroller */}
              <div className="mobile-quick-cats-scroller">
                {(storeCategories || []).map((cat) => (
                  <button
                    key={cat.id}
                    className={`quick-cat-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="section-container store-grid-wrapper">
              {/* LEFT: Faceted Categories & Technical Filter Sidebar */}
              <aside className={`store-faceted-sidebar ${isMobileFiltersOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-filter-header">
                  <div className="filter-title">
                    <SlidersHorizontal size={15} />
                    <span>Hardware Filters</span>
                  </div>
                  {(selectedCategory !== 'all' || selectedBrand !== 'All' || selectedVoltage !== 'All' || inStockOnly || onlyDiscounted || searchQuery) && (
                    <button
                      className="reset-filters-btn"
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedBrand('All');
                        setSelectedVoltage('All');
                        setInStockOnly(false);
                        setOnlyDiscounted(false);
                        setSearchQuery('');
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Search in Catalog */}
                <div className="sidebar-search-box">
                  <Search size={14} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search SKU, chip, sensor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="filter-group">
                  <label className="filter-group-label">Component Categories</label>
                  <div className="category-pills-list">
                    {(storeCategories || []).map((cat) => {
                      const count = cat.id === 'all'
                        ? allProducts.length
                        : allProducts.filter(p => p.category === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          className={`cat-pill-item ${selectedCategory === cat.id ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(cat.id)}
                        >
                          <span className="cat-name">{cat.name}</span>
                          <span className="cat-count">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Operating Voltage */}
                <div className="filter-group">
                  <label className="filter-group-label">Operating Voltage</label>
                  <div className="voltage-pills">
                    {["All", "3.3V", "5V", "12V"].map((volt) => (
                      <button
                        key={volt}
                        className={`voltage-btn ${selectedVoltage === volt ? 'active' : ''}`}
                        onClick={() => setSelectedVoltage(volt)}
                      >
                        {volt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="filter-group">
                  <label className="filter-group-label">Manufacturer / Brand</label>
                  <select
                    className="brand-select-dropdown"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="All">All Manufacturers</option>
                    <option value="Espressif">Espressif Systems</option>
                    <option value="Arduino">Arduino Official</option>
                    <option value="Raspberry Pi">Raspberry Pi Foundation</option>
                    <option value="Waveshare">Waveshare</option>
                    <option value="TowerPro">TowerPro</option>
                    <option value="Creality">Creality 3D</option>
                  </select>
                </div>

                {/* Stock Status Toggles */}
                <div className="filter-group">
                  <label className="filter-group-label">Availability & Delivery</label>
                  <label className="checkbox-filter-row">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <span>In-Stock Ready for Dispatch</span>
                  </label>

                  <label className="checkbox-filter-row">
                    <input
                      type="checkbox"
                      checked={onlyDiscounted}
                      onChange={(e) => setOnlyDiscounted(e.target.checked)}
                    />
                    <span>Flash Sale Discounts Only</span>
                  </label>
                </div>

                {/* 24H Courier Coverage Info Box */}
                <div className="sidebar-express-box">
                  <div className="express-box-title">
                    <Truck size={16} className="truck-amber" />
                    <strong>24H Express Islandwide</strong>
                  </div>
                  <p>Colombo, Gampaha, Kandy, Galle, Jaffna & all regional areas serviced with rapid courier dispatch.</p>
                  <span className="tracking-support-label">Full tracking SMS provided</span>
                </div>
              </aside>

              {/* RIGHT: Products Grid & Search Status */}
              <div className="store-products-main">
                <div className="products-results-bar">
                  <div className="results-count">
                    Showing <strong>{filteredProducts.length}</strong> IoT hardware items
                  </div>

                  <div className="active-filter-tags">
                    {selectedCategory !== 'all' && (
                      <span className="active-tag-bubble">
                        Category: {selectedCategory} <X size={11} onClick={() => setSelectedCategory('all')} />
                      </span>
                    )}
                    {selectedBrand !== 'All' && (
                      <span className="active-tag-bubble">
                        Brand: {selectedBrand} <X size={11} onClick={() => setSelectedBrand('All')} />
                      </span>
                    )}
                    {selectedVoltage !== 'All' && (
                      <span className="active-tag-bubble">
                        Voltage: {selectedVoltage} <X size={11} onClick={() => setSelectedVoltage('All')} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid of Products */}
                {filteredProducts.length === 0 ? (
                  <div className="empty-catalog-state">
                    <Cpu size={42} className="empty-icon" />
                    <h3>No Matching Hardware Components Found</h3>
                    <p>Try resetting filters or searching for alternative microcontrollers or sensor keywords.</p>
                    <button
                      className="reset-catalog-btn"
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedBrand('All');
                        setSelectedVoltage('All');
                        setSearchQuery('');
                        setInStockOnly(false);
                      }}
                    >
                      Show All Hardware
                    </button>
                  </div>
                ) : (
                  <div className="catalog-products-grid">
                    {filteredProducts.map((product) => {
                      const hasDiscount = product.originalPriceLKR && product.originalPriceLKR > product.priceLKR;
                      const discountPct = hasDiscount
                        ? Math.round(((product.originalPriceLKR - product.priceLKR) / product.originalPriceLKR) * 100)
                        : null;

                      return (
                        <div key={product.id} className="hardware-item-card">
                          <div className="card-img-container" onClick={() => setActiveModalProduct(product)}>
                            <div className="card-top-badges">
                              {hasDiscount ? (
                                <span className="badge-discount">-{discountPct}%</span>
                              ) : (
                                <span className="badge-voltage">{product.operatingVoltage}</span>
                              )}
                              <span className="badge-brand">{product.brand}</span>
                            </div>
                            <img src={product.image} alt={product.name} className="product-image" />
                            <div className="img-hover-overlay">
                              <span className="quick-view-btn">
                                <Maximize2 size={13} /> View Pinout & Specs
                              </span>
                            </div>
                          </div>

                          <div className="card-content-body">
                            <span className="card-sku-code">{product.sku}</span>
                            <h4 className="card-product-title" onClick={() => setActiveModalProduct(product)}>
                              {product.name}
                            </h4>
                            <p className="card-brief-desc">{product.description}</p>

                            <div className="card-specs-micro">
                              <span>⚡ {product.operatingVoltage}</span>
                              {product.pinCount && <span>📌 {product.pinCount}-Pin</span>}
                              <span>📦 {product.packageType}</span>
                            </div>

                            <div className="card-price-row">
                              <div>
                                <strong className="card-curr-price">{formatPrice(product.priceLKR)}</strong>
                                {hasDiscount && (
                                  <span className="card-orig-price">{formatPrice(product.originalPriceLKR)}</span>
                                )}
                              </div>
                              <span className={`stock-pill ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                                {product.inStock ? 'In Stock (24H)' : 'Pre-order'}
                              </span>
                            </div>

                            <div className="card-actions-grid">
                              <button
                                className="add-cart-action-btn"
                                onClick={() => addToCart(product)}
                              >
                                <ShoppingCart size={14} /> Add
                              </button>
                              <button
                                className="instant-whatsapp-btn"
                                onClick={() => handleInstantBuy(product)}
                                title="Order directly via WhatsApp"
                              >
                                <Phone size={13} /> Buy Now
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
        )
      )}

      {/* =========================================================
          TAB 2: ABOUT US (WHO WE ARE, WHAT WE SELL, AI ROBOT & SERVICES)
          ========================================================= */}
      {activeTab === 'about' && (
        <main className="iot-about-view">
          {/* Top Retail & Engineering Mission Identity */}
          <section className="about-identity-hero">
            <div className="hero-ambient-glow"></div>
            <div className="section-container">
              <div className="about-intro-badge">
                <span className="live-radar-dot"></span>
                <Radio size={14} />
                <span>Sri Lanka's Premier Maker Hardware Store & IoT Lab</span>
              </div>

              <h1 className="about-main-title">
                Who We Are & What We Do
              </h1>

              <p className="about-main-lead">
                <strong>Buildify Solutions</strong> is your one-stop destination for genuine robotics hardware, precision sensors, microcontrollers, and turnkey embedded engineering in Sri Lanka.
              </p>

              <div className="about-pillars-overview-grid">
                {/* Pillar 1: Genuine Hardware Store */}
                <div className="about-overview-card card-hardware">
                  <div className="card-ambient-corner"></div>
                  <div className="card-top-row">
                    <div className="card-top-icon icon-amber">
                      <Box size={26} />
                    </div>
                    <span className="overview-tag tag-amber">
                      <span className="live-mini-dot"></span> 2,500+ SKUs in Stock
                    </span>
                  </div>

                  <h3 className="card-pillar-title">Genuine Hardware Store</h3>
                  <p className="card-pillar-desc">
                    We stock and retail over 2,500+ genuine electronic modules, ESP32, Arduino, Raspberry Pi, LoRaWAN radios, power modules, and precision sensors with same-day dispatch and 24-hour delivery.
                  </p>

                  <div className="card-chips-row">
                    <span className="micro-chip">ESP32 & Arduino</span>
                    <span className="micro-chip">Sensors & Modules</span>
                    <span className="micro-chip highlight">24H Dispatch</span>
                  </div>
                </div>

                {/* Pillar 2: Embedded Firmware Engineering */}
                <div className="about-overview-card card-firmware">
                  <div className="card-ambient-corner"></div>
                  <div className="card-top-row">
                    <div className="card-top-icon icon-cyan">
                      <Cpu size={26} />
                    </div>
                    <span className="overview-tag tag-cyan">
                      <Zap size={12} /> ESP-IDF & FreeRTOS
                    </span>
                  </div>

                  <h3 className="card-pillar-title">Embedded Firmware Engineering</h3>
                  <p className="card-pillar-desc">
                    From student STEM prototypes to mission-critical industrial controllers, our engineering lab writes production-grade C/C++ firmware using ESP-IDF, FreeRTOS, and Zephyr.
                  </p>

                  <div className="card-chips-row">
                    <span className="micro-chip">Bare-Metal C/C++</span>
                    <span className="micro-chip">Zero-Crash RTOS</span>
                    <span className="micro-chip highlight-cyan">Industrial PLC</span>
                  </div>
                </div>

                {/* Pillar 3: Telemetry & IoT Dashboards */}
                <div className="about-overview-card card-telemetry">
                  <div className="card-ambient-corner"></div>
                  <div className="card-top-row">
                    <div className="card-top-icon icon-green">
                      <Layers size={26} />
                    </div>
                    <span className="overview-tag tag-green">
                      <Activity size={12} /> MQTT & LoRaWAN
                    </span>
                  </div>

                  <h3 className="card-pillar-title">Telemetry & IoT Dashboards</h3>
                  <p className="card-pillar-desc">
                    We bridge physical hardware to the cloud with real-time MQTT pipelines, LoRaWAN gateways, and custom telemetry web dashboards for agribusiness, factories, and smart energy.
                  </p>

                  <div className="card-chips-row">
                    <span className="micro-chip">Cloud Telemetry</span>
                    <span className="micro-chip">Live WebSockets</span>
                    <span className="micro-chip highlight-green">Agri & SCADA</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Trust Ribbon */}
              <div className="about-trust-strip">
                <div className="trust-strip-item">
                  <Truck size={15} className="text-amber" />
                  <span>24h Islandwide Dispatch</span>
                </div>
                <span className="trust-strip-sep">•</span>
                <div className="trust-strip-item">
                  <ShieldCheck size={15} className="text-green" />
                  <span>100% Genuine Silicon Guarantee</span>
                </div>
                <span className="trust-strip-sep">•</span>
                <div className="trust-strip-item">
                  <Wrench size={15} className="text-amber" />
                  <span>In-House Lab Bench Tested</span>
                </div>
                <span className="trust-strip-sep">•</span>
                <div className="trust-strip-item">
                  <Zap size={15} className="text-cyan" />
                  <span>1-Hour Colombo Quick Delivery</span>
                </div>
              </div>
            </div>
          </section>

          {/* AI Robot Engineering Video & Holographic Telemetry Theater */}
          <section className="video-lab-hero-section">
            <div className="section-container">
              <div className="video-lab-header-centered">
                <div className="section-eyebrow eyebrow-amber">
                  <Cpu size={13} /> Automated AI Robotic Fabrication & Telemetry Lab
                </div>
                <h2 className="video-lab-title">
                  Next-Gen SMT Fabrication & Live Firmware Testing
                </h2>
                <p className="video-lab-subtitle">
                  Watch our automated cybernetic AI workstation assembling high-density microcontroller boards and streaming telemetry.
                </p>
              </div>

              {/* High-Tech Animated AI Robot Video Frame */}
              <div className="video-theater-wrapper">
                <div className="theater-screen-frame">
                  {/* Top HUD Status Bar */}
                  <div className="theater-hud-bar">
                    <div className="hud-dots">
                      <span className="h-dot red"></span>
                      <span className="h-dot yellow"></span>
                      <span className="h-dot green"></span>
                    </div>
                    <div className="hud-telemetry-badge">
                      <span className="live-amber-dot"></span>
                      <span>AI ROBOTIC WORKCELL // FEED: SMT COMPONENT REFLOW & LASER TEST</span>
                    </div>
                    <div className="hud-fps-readout">
                      <span ref={fpsReadoutRef}>60</span> FPS | 8K AI Telemetry
                    </div>
                  </div>

                  {/* AI Robot Media Display with Holographic Scanline Overlay */}
                  <div className="ai-robot-media-container">
                    <img 
                      src="/images/ai-robot-lab.jpg" 
                      alt="Buildify AI Robotic IoT Engineering Workstation" 
                      className={`ai-robot-lab-img ${isPlayingVideo ? 'active-feed' : 'paused-feed'}`} 
                    />
                    
                    {/* Futuristic Laser Scanning Animation */}
                    {isPlayingVideo && <div className="cyber-laser-scanner"></div>}

                    {/* Holographic Floating HUD Nodes */}
                    <div className="floating-hud-overlay">
                      <div className="hud-box-chip top-left">
                        <span className="hud-chip-title">PROCESSOR CORE</span>
                        <strong>Xtensa Dual-Core 240MHz</strong>
                        <span className="hud-chip-val">SMD PINS: 48 OK</span>
                      </div>

                      <div className="hud-box-chip top-right">
                        <span className="hud-chip-title">SYSTEM STATUS</span>
                        <strong className="text-green">ONLINE / ACTIVE</strong>
                        <span className="hud-chip-val">TELEMETRY: 60 FPS</span>
                      </div>

                      <div className="hud-box-chip bottom-left">
                        <span className="hud-chip-title">FIRMWARE PIPELINE</span>
                        <strong>FreeRTOS v10.4.3</strong>
                        <span className="hud-chip-val">FLASH ENCRYPTION: AES-256</span>
                      </div>
                    </div>
                  </div>

                  {/* On-Screen HUD Overlay Controls */}
                  <div className="theater-bottom-controls">
                    <div className="left-controls">
                      <button
                        className="hud-control-btn"
                        onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                        type="button"
                      >
                        {isPlayingVideo ? <Pause size={16} /> : <Play size={16} />}
                        <span>{isPlayingVideo ? 'Pause Stream' : 'Resume Stream'}</span>
                      </button>

                      <button
                        className="hud-control-btn"
                        onClick={() => setIsMuted(!isMuted)}
                        type="button"
                      >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        <span>{isMuted ? 'Telemetry Audio Off' : 'Audio Live'}</span>
                      </button>
                    </div>

                    <div className="right-hud-stats">
                      <span className="hud-stat-chip">ROBOT: AETHEL-9 ACTIVE</span>
                      <span className="hud-stat-chip">NODES: 35 CONNECTED</span>
                      <span className="hud-stat-chip">LATENCY: 14ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Stats Counter */}
              <div className="lab-metrics-bar">
                <div className="metric-col">
                  <div className="m-val">2,500<span className="text-amber">+</span></div>
                  <div className="m-lbl">Hardware SKUs in Stock</div>
                </div>
                <div className="m-divider"></div>

                <div className="metric-col">
                  <div className="m-val">450<span className="text-amber">+</span></div>
                  <div className="m-lbl">Active Student & STEM Projects</div>
                </div>
                <div className="m-divider"></div>

                <div className="metric-col">
                  <div className="m-val">1,200<span className="text-amber">+</span></div>
                  <div className="m-lbl">Custom Builds Delivered</div>
                </div>
                <div className="m-divider"></div>

                <div className="metric-col">
                  <div className="m-val">24<span className="text-amber">H</span></div>
                  <div className="m-lbl">Islandwide Delivery Guarantee</div>
                </div>
              </div>
            </div>
          </section>

          {/* Super-Charged 3 Interactive Cyber-Modules */}
          <section className="iot-services-pillars-section">
            <div className="section-container">
              <div className="section-header-centered">
                <div className="section-eyebrow eyebrow-amber">
                  <Wrench size={13} /> Full-Stack Hardware Services
                </div>
                <h2 className="section-title-large">End-to-End Embedded Solutions</h2>
                <p className="section-desc-centered">
                  Explore our core technical specializations with interactive code inspectors, telemetry stream simulators, and PCB stackup diagnostics.
                </p>
              </div>

              <div className="iot-services-grid">
                {/* Cyber-Module 1: Firmware Engineering */}
                <div className="service-pillar-card cyber-module-card">
                  <div className="pillar-top-nav">
                    <div className="pillar-icon"><Cpu size={24} /></div>
                    <div className="pillar-toggle-pills">
                      <button 
                        className={`pill-btn ${pillarTab.firmware === 'overview' ? 'active' : ''}`}
                        onClick={() => setPillarTab(prev => ({ ...prev, firmware: 'overview' }))}
                        type="button"
                      >
                        Overview
                      </button>
                      <button 
                        className={`pill-btn ${pillarTab.firmware === 'code' ? 'active' : ''}`}
                        onClick={() => setPillarTab(prev => ({ ...prev, firmware: 'code' }))}
                        type="button"
                      >
                        Code Inspector
                      </button>
                    </div>
                  </div>

                  <h4>Firmware Engineering</h4>

                  {pillarTab.firmware === 'overview' ? (
                    <>
                      <p>Production-grade firmware developed in ESP-IDF, FreeRTOS, Arduino C++, and MicroPython with secure OTA remote updates.</p>
                      <ul className="pillar-checklist">
                        <li><CheckCircle2 size={13} /> Dual-Core Thread Management & Core Affinity</li>
                        <li><CheckCircle2 size={13} /> Ultra-Low Deep Sleep & Battery Optimization</li>
                        <li><CheckCircle2 size={13} /> Flash Encryption & Hardware Secure Boot</li>
                      </ul>
                    </>
                  ) : (
                    <div className="cyber-code-block">
                      <div className="code-header"><span>esp32_rtos_telemetry.c</span></div>
                      <pre><code>{`// Core 1 Telemetry Task
void telemetryTask(void *pvParam) {
  for(;;) {
    float temp = read_bme280_temp();
    mqtt_publish("nodes/01", temp);
    vTaskDelay(pdMS_TO_TICKS(1000));
  }
}
// Pinned Dual-Core Scheduler
xTaskCreatePinnedToCore(
  telemetryTask, "TEL_TASK",
  4096, NULL, 1, NULL, 1);`}</code></pre>
                    </div>
                  )}
                  <div className="module-bottom-tag">ESP-IDF v5.1 // FreeRTOS</div>
                </div>

                {/* Cyber-Module 2: Telemetry & Cloud Protocols */}
                <div className="service-pillar-card cyber-module-card">
                  <div className="pillar-top-nav">
                    <div className="pillar-icon"><Radio size={24} /></div>
                    <div className="pillar-toggle-pills">
                      <button 
                        className={`pill-btn ${pillarTab.telemetry === 'overview' ? 'active' : ''}`}
                        onClick={() => setPillarTab(prev => ({ ...prev, telemetry: 'overview' }))}
                        type="button"
                      >
                        Overview
                      </button>
                      <button 
                        className={`pill-btn ${pillarTab.telemetry === 'packets' ? 'active' : ''}`}
                        onClick={() => setPillarTab(prev => ({ ...prev, telemetry: 'packets' }))}
                        type="button"
                      >
                        Live Stream
                      </button>
                    </div>
                  </div>

                  <h4>Telemetry & Cloud Protocols</h4>

                  {pillarTab.telemetry === 'overview' ? (
                    <>
                      <p>Connecting physical sensors to enterprise dashboards via MQTT, WebSockets, Modbus RTU, RS485, and LoRaWAN long-range networks.</p>
                      <ul className="pillar-checklist">
                        <li><CheckCircle2 size={13} /> AWS IoT Core & HiveMQ Cloud Pipelines</li>
                        <li><CheckCircle2 size={13} /> Real-Time Reactive Web Dashboard Streams</li>
                        <li><CheckCircle2 size={13} /> Automatic Reconnect & Backpressure Buffering</li>
                      </ul>
                    </>
                  ) : (
                    <div className="cyber-packet-stream">
                      <div className="packet-line"><span className="p-time">14:02:01.12</span> <span className="p-topic">PUB: factory/temp_01</span> <span className="p-data">28.4°C [OK]</span></div>
                      <div className="packet-line"><span className="p-time">14:02:02.34</span> <span className="p-topic">LORA: 915MHz SNR:8dB</span> <span className="p-data">Moisture: 42%</span></div>
                      <div className="packet-line"><span className="p-time">14:02:03.55</span> <span className="p-topic">SUB: relay/valve_02</span> <span className="p-data">CMD: OPEN (12V)</span></div>
                    </div>
                  )}
                  <div className="module-bottom-tag">MQTT 3.1.1 // LoRaWAN 915MHz</div>
                </div>

                {/* Cyber-Module 3: Custom PCB Prototyping */}
                <div className="service-pillar-card cyber-module-card">
                  <div className="pillar-top-nav">
                    <div className="pillar-icon"><Layers size={24} /></div>
                    <div className="pillar-toggle-pills">
                      <button 
                        className={`pill-btn ${pillarTab.pcb === 'overview' ? 'active' : ''}`}
                        onClick={() => setPillarTab(prev => ({ ...prev, pcb: 'overview' }))}
                        type="button"
                      >
                        Overview
                      </button>
                      <button 
                        className={`pill-btn ${pillarTab.pcb === 'specs' ? 'active' : ''}`}
                        onClick={() => setPillarTab(prev => ({ ...prev, pcb: 'specs' }))}
                        type="button"
                      >
                        Fab Specs
                      </button>
                    </div>
                  </div>

                  <h4>Custom PCB Prototyping</h4>

                  {pillarTab.pcb === 'overview' ? (
                    <>
                      <p>Schematic design, multi-layer Gerber generation, SMD component assembly, and custom 3D printed protective enclosures.</p>
                      <ul className="pillar-checklist">
                        <li><CheckCircle2 size={13} /> KiCad & Altium Schematic Capture</li>
                        <li><CheckCircle2 size={13} /> In-house SMT Stencil Reflow & Inspection</li>
                        <li><CheckCircle2 size={13} /> IP67 Waterproof Field Cases & CNC Brackets</li>
                      </ul>
                    </>
                  ) : (
                    <div className="cyber-fab-specs">
                      <div className="spec-row"><span>Layer Count:</span> <strong>2 – 4 Multilayer FR4</strong></div>
                      <div className="spec-row"><span>Trace / Space:</span> <strong>0.127mm (5 mil)</strong></div>
                      <div className="spec-row"><span>Surface Finish:</span> <strong>ENIG Gold / Lead-Free HASL</strong></div>
                      <div className="spec-row"><span>Enclosure Rating:</span> <strong>IP67 Waterproof Polycarbonate</strong></div>
                    </div>
                  )}
                  <div className="module-bottom-tag">KiCad // Altium // SMT Assembly</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* =========================================================
          TAB 3: BULK STOCK & CUSTOM HUGE PROJECTS (ENTERPRISE RFP)
          ========================================================= */}
      {activeTab === 'contracts' && (
        <main className="iot-contracts-view">
          <section className="contracts-hero-section">
            <div className="section-container">
              <div className="contracts-header-centered">
                <div className="section-eyebrow eyebrow-amber">
                  <Award size={13} /> Massive Contracts & Turnkey Deployments
                </div>
                <h1 className="contracts-title">
                  Enterprise Bulk Stock & Custom Engineering
                </h1>
                <p className="contracts-subtitle">
                  We supply institutions, tea factories, agricultural enterprises, and robotics research labs with bulk component batches and turn-key custom builds.
                </p>
              </div>

              {/* Interactive Contract Scope & BOM Estimator */}
              <div className="contract-estimator-box">
                <div className="estimator-grid-2col">
                  {/* Left: Configuration */}
                  <div className="contract-config-side">
                    <label className="config-heading">1. Select Contract Scope & Architecture:</label>
                    <div className="contract-tier-pills">
                      {Object.entries(contractTiers).map(([key, val]) => (
                        <button
                          key={key}
                          className={`contract-tier-btn ${contractType === key ? 'active' : ''}`}
                          onClick={() => setContractType(key)}
                        >
                          <div className="tier-btn-title">{val.title}</div>
                          <div className="tier-btn-sub">Base from {formatPrice(val.unitBaseLKR)} / unit</div>
                        </button>
                      ))}
                    </div>

                    <div className="quantity-slider-block">
                      <div className="slider-label-row">
                        <span>Project Scale (Units / Nodes):</span>
                        <strong className="slider-qty-val">{volumeQty} Units</strong>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={volumeQty}
                        onChange={(e) => setVolumeQty(Number(e.target.value))}
                        className="volume-slider"
                      />
                      <div className="slider-scale-points">
                        <span>10</span>
                        <span>50 (5% Off)</span>
                        <span>100 (12% Off)</span>
                        <span>250+ (20% Off)</span>
                        <span>500</span>
                      </div>
                    </div>

                    <label className="config-heading" style={{ marginTop: '1.5rem' }}>2. Full Engineering Add-ons:</label>
                    <div className="contract-checkboxes-stack">
                      <label className="contract-check-card">
                        <input
                          type="checkbox"
                          checked={includeFirmware}
                          onChange={(e) => setIncludeFirmware(e.target.checked)}
                        />
                        <div>
                          <strong>Custom Production Firmware & Flashing</strong>
                          <span>Tailored FreeRTOS / ESP-IDF with automated serial provisioning (+{formatPrice(2500)}/unit)</span>
                        </div>
                      </label>

                      <label className="contract-check-card">
                        <input
                          type="checkbox"
                          checked={includeCloudServer}
                          onChange={(e) => setIncludeCloudServer(e.target.checked)}
                        />
                        <div>
                          <strong>Central Cloud Telemetry Server & Dashboard</strong>
                          <span>Dedicated broker instance, live web analytics & database archive (+{formatPrice(3000)}/unit)</span>
                        </div>
                      </label>

                      <label className="contract-check-card">
                        <input
                          type="checkbox"
                          checked={include3DEnclosure}
                          onChange={(e) => setInclude3DEnclosure(e.target.checked)}
                        />
                        <div>
                          <strong>Custom 3D Printed / CNC Industrial Enclosure</strong>
                          <span>UV-resistant PETG / ASA field enclosures with gland cable seals (+{formatPrice(1800)}/unit)</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Right: Contract Summary & Instant WhatsApp RFP */}
                  <div className="contract-summary-side">
                    <div className="summary-glass-box">
                      <div className="contract-badge-top">Enterprise Project Summary</div>

                      <div className="contract-summary-line">
                        <span>Selected Contract:</span>
                        <strong>{selectedTier.title}</strong>
                      </div>

                      <div className="contract-summary-line">
                        <span>Unit Quantity:</span>
                        <strong>{volumeQty} Custom Units</strong>
                      </div>

                      <div className="contract-summary-line">
                        <span>Volume Discount:</span>
                        <strong className="text-amber">
                          {volumeDiscountPct > 0 ? `${volumeDiscountPct}% Bulk Savings Applied` : 'Standard Volume'}
                        </strong>
                      </div>

                      <div className="contract-investment-box">
                        <span className="inv-label">Estimated Contract Budget ({currency}):</span>
                        <div className="inv-total-val">{formatPrice(netContractLKR)}</div>
                        <span className="inv-sub-note">
                          Includes Hardware Sourcing, Assembly, Testing, Calibration & 1 Year Technical Warranty
                        </span>
                      </div>

                      <button
                        className="contract-dispatch-whatsapp-btn"
                        onClick={handleContractWhatsApp}
                      >
                        <i className="bi bi-whatsapp"></i>
                        <span>Submit Contract Scope via WhatsApp</span>
                      </button>

                      <div className="contract-engineer-review-note">
                        <ShieldCheck size={14} className="text-amber" />
                        <span>Directly reviewed by Lead Hardware Architect at <strong>Buildify Solutions</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Contract RFP Form */}
              <div className="contracts-rfp-form-wrap">
                <div className="rfp-header">
                  <FileText size={18} className="text-amber" />
                  <h3>Submit Enterprise Request for Proposal (RFP)</h3>
                  <p>Provide your project details, bill of materials (BOM), or custom schematics for an official quotation.</p>
                </div>

                {contractSubmitted ? (
                  <div className="rfp-success-state">
                    <CheckCircle2 size={38} className="text-green" />
                    <h4>Contract RFP Successfully Received!</h4>
                    <p>Thank you, <strong>{contractForm.contactPerson}</strong>. Our enterprise hardware desk will review your specifications and contact you within 24 hours.</p>
                    <button className="reset-rfp-btn" onClick={() => setContractSubmitted(false)}>
                      Submit Another Scope
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContractSubmit} className="rfp-form-body">
                    <div className="form-row-2">
                      <div className="rfp-field">
                        <label>Company / Organization Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Ceylon Tea Estates PLC / Tech Corp"
                          value={contractForm.companyName}
                          onChange={(e) => setContractForm({ ...contractForm, companyName: e.target.value })}
                        />
                      </div>

                      <div className="rfp-field">
                        <label>Contact Person & Designation *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Engineer Kasun Silva"
                          value={contractForm.contactPerson}
                          onChange={(e) => setContractForm({ ...contractForm, contactPerson: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="rfp-field">
                        <label>Official Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          placeholder="071 XXXXXXX"
                          value={contractForm.phone}
                          onChange={(e) => setContractForm({ ...contractForm, phone: e.target.value })}
                        />
                      </div>

                      <div className="rfp-field">
                        <label>Official Email</label>
                        <input
                          type="email"
                          placeholder="kasun@company.lk"
                          value={contractForm.email}
                          onChange={(e) => setContractForm({ ...contractForm, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="rfp-field">
                      <label>Project Scope, Required Sensors & Target Scale</label>
                      <textarea
                        rows={3}
                        placeholder="Describe your custom hardware requirement, expected sensor interfaces, environmental conditions, or bulk stock lists..."
                        value={contractForm.projectBrief}
                        onChange={(e) => setContractForm({ ...contractForm, projectBrief: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="rfp-actions-row">
                      <button type="submit" className="rfp-submit-btn">
                        <span>Send Official RFP</span>
                        <Send size={14} />
                      </button>

                      <button type="button" className="rfp-whatsapp-btn" onClick={handleContractWhatsApp}>
                        <i className="bi bi-whatsapp"></i>
                        <span>Instant Enterprise WhatsApp</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* =========================================================
          TAB 4: DELIVERY VIA COURIER & QUICK DELIVERY (PICKME/UBER)
          ========================================================= */}
      {activeTab === 'delivery' && (
        <main className="iot-delivery-view">
          <section className="iot-info-hero-section">
            <div className="section-container">
              {/* Top Hero Eyebrow & Title */}
              <div className="info-hero-centered">
                <div className="section-eyebrow eyebrow-amber">
                  <Truck size={13} /> Official Shipping & Logistics
                </div>
                <h1 className="info-hero-title">
                  Delivery & Logistics Information
                </h1>
                <p className="info-hero-subtitle">
                  We offer reliable island-wide delivery via courier service as well as lightning-fast Quick Delivery via PickMe Flash / Uber Package in Colombo.
                </p>
              </div>

              {/* =========================================================
                  1. DELIVERY VIA COURIER SERVICE
                  ========================================================= */}
              <div className="delivery-method-card">
                <div className="delivery-card-banner">
                  <div className="banner-icon-title">
                    <div className="method-num-badge">1</div>
                    <div>
                      <h2 className="method-title">DELIVERY VIA COURIER SERVICE</h2>
                      <span className="method-sub">Island-wide standard courier delivery (1 to 4 working days)</span>
                    </div>
                  </div>
                  <div className="cutoff-live-pill">
                    <span className="live-amber-dot"></span>
                    <span>Staff Prep: Mon – Sat (9:00 AM – 3:00 PM)</span>
                  </div>
                </div>

                <div className="delivery-card-content">
                  <p className="delivery-intro-para">
                    We offer island-wide delivery via courier service. Most packages arrive the next day, though the standard delivery window is 1 to 4 working days. You can place your order online at any time. However, our staff processes and prepares orders from Monday to Saturday, between 9:00 AM and 3:00 PM.
                  </p>

                  {/* Interactive Courier Rate & Weight Calculator */}
                  <div className="interactive-calculator-box">
                    <div className="calc-header-row">
                      <div className="calc-title">
                        <Calculator size={19} className="text-amber" />
                        <strong>Delivery Rate Calculator</strong>
                      </div>
                      <span className="calc-note-badge">Over 97% of orders are under 1kg</span>
                    </div>

                    <div className="calc-rates-rule-strip">
                      <div className="rule-badge"><strong>First 1kg:</strong> Rs. 580</div>
                      <div className="rule-badge"><strong>Each additional kg:</strong> Rs. 160 <small>(rounded up to the next full kg)</small></div>
                    </div>

                    <p className="calc-disclaimer">
                      <em>Note: Over 97% of our orders are under 1kg. Your initial checkout will show the 1kg rate; we will manually adjust the total if your package exceeds this weight.</em>
                    </p>

                    <div className="calc-interactive-controls">
                      <div className="slider-control-group">
                        <div className="slider-labels">
                          <span>Adjust Parcel Weight:</span>
                          <strong className="weight-display-badge">
                            {deliveryWeight >= 1 ? `${deliveryWeight.toFixed(1)} kg` : `${Math.round(deliveryWeight * 1000)} g`}
                          </strong>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="15.0"
                          step="0.05"
                          value={deliveryWeight}
                          onChange={(e) => setDeliveryWeight(parseFloat(e.target.value))}
                          className="weight-slider-amber"
                        />
                        <div className="slider-ticks">
                          <span>60g (Minimum)</span>
                          <span>1kg (Base)</span>
                          <span>5kg</span>
                          <span>10kg</span>
                          <span>15kg</span>
                        </div>
                      </div>

                      {/* Interactive Shipping Examples Buttons */}
                      <div className="calc-presets-row">
                        <span className="presets-label">Shipping Examples:</span>
                        <button
                          className={`preset-chip ${Math.abs(deliveryWeight - 0.06) < 0.01 ? 'active' : ''}`}
                          onClick={() => setDeliveryWeight(0.06)}
                          type="button"
                        >
                          60g Parcel: Rs. 580 (Minimum charge)
                        </button>
                        <button
                          className={`preset-chip ${Math.abs(deliveryWeight - 7.8) < 0.01 ? 'active' : ''}`}
                          onClick={() => setDeliveryWeight(7.8)}
                          type="button"
                        >
                          7.8kg Parcel: Rs. 580 (1st kg) + Rs. 1,120 (7kg additional) = Rs. 1,700 total
                        </button>
                      </div>

                      {/* Live Calculated Output */}
                      <div className="calc-live-result-panel">
                        <div className="result-left">
                          <span className="res-label">Calculated Delivery Charge:</span>
                          <div className="res-price-large">
                            {formatPrice(calculateCourierFee(deliveryWeight).total)}
                          </div>
                        </div>
                        <div className="result-right">
                          <span className="res-breakdown-title">Pricing Breakdown:</span>
                          <div className="res-formula-text">
                            {calculateCourierFee(deliveryWeight).breakdownText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Processing & How to Pay (Bank-in Option) Grid */}
                  <div className="delivery-two-col-grid">
                    {/* Order Processing Box */}
                    <div className="info-sub-card">
                      <div className="card-top-header">
                        <Clock size={18} className="text-amber" />
                        <h4>Order Processing</h4>
                      </div>
                      <div className="processing-timelines">
                        <div className="timeline-item">
                          <span className="t-dot green"></span>
                          <div>
                            <strong>Orders before 1:00 PM:</strong>
                            <p>Prepared the same working day.</p>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <span className="t-dot yellow"></span>
                          <div>
                            <strong>Orders after 1:00 PM:</strong>
                            <p>Prepared the next working day.</p>
                          </div>
                        </div>
                      </div>
                      <div className="warning-notice-strip">
                        <AlertCircle size={15} />
                        <span>Please note: Couriers do not operate on weekends or mercantile holidays.</span>
                      </div>
                    </div>

                    {/* How to Pay (Bank-in Option) */}
                    <div className="info-sub-card">
                      <div className="card-top-header">
                        <ShieldCheck size={18} className="text-amber" />
                        <h4>How to Pay (Bank-in Option)</h4>
                      </div>
                      <div className="step-process-list">
                        <div className="step-item">
                          <span className="step-pill">1</span>
                          <div>
                            <strong>Wait for Confirmation:</strong>
                            <p>Do not deposit funds until you receive a payment email and a follow-up call from us.</p>
                          </div>
                        </div>
                        <div className="step-item">
                          <span className="step-pill">2</span>
                          <div>
                            <strong>Payment Reference:</strong>
                            <p>Use the last 4 digits of your order number as the reference.</p>
                          </div>
                        </div>
                        <div className="step-item">
                          <span className="step-pill">3</span>
                          <div>
                            <strong>Confirm:</strong>
                            <p>Once paid, reply to our email with "Paid."</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Questions / Courier Contacts Strip */}
                  <div className="delivery-contact-strip">
                    <div className="strip-left">
                      <strong>Questions? Contact us:</strong>
                      <div className="contact-links-row">
                        <a href="mailto:buildifysoluition@gmail.com" className="c-link">
                          <Mail size={14} /> buildifysoluition@gmail.com
                        </a>
                        <span className="sep">•</span>
                        <a href="tel:0717790035" className="c-link">
                          <Phone size={14} /> 071 7790035
                        </a>
                      </div>
                    </div>
                    <a
                      href="https://wa.me/94717790035?text=Hi%20Buildify%20Team,%20I%20have%20a%20question%20about%20courier%20delivery"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-wa-action"
                    >
                      <i className="bi bi-whatsapp"></i> Chat on WhatsApp (071 7790035)
                    </a>
                  </div>
                </div>
              </div>

              {/* =========================================================
                  2. QUICK DELIVERY (PICKME FLASH / UBER PACKAGE)
                  ========================================================= */}
              <div className="delivery-method-card highlight-quick-delivery">
                <div className="delivery-card-banner quick-banner">
                  <div className="banner-icon-title">
                    <div className="method-num-badge badge-quick">2</div>
                    <div>
                      <h2 className="method-title">QUICK DELIVERY (PICKME FLASH / UBER PACKAGE)</h2>
                      <span className="method-sub">For urgent orders within the Colombo district</span>
                    </div>
                  </div>
                  <div className="speed-live-badge">
                    <Zap size={14} /> Delivered within an hour
                  </div>
                </div>

                <div className="delivery-card-content">
                  <p className="delivery-intro-para">
                    For urgent orders within the Colombo district, you can use Uber or Pickme Flash. This is often faster and more cost-effective than standard courier services.
                  </p>

                  {/* Service Highlights */}
                  <div className="quick-service-highlights-grid">
                    <div className="highlight-mini-card">
                      <div className="mini-icon"><Zap size={20} /></div>
                      <div>
                        <strong>Speed:</strong>
                        <p>Most orders are delivered within an hour.</p>
                      </div>
                    </div>

                    <div className="highlight-mini-card">
                      <div className="mini-icon"><Navigation size={20} /></div>
                      <div>
                        <strong>Tracking:</strong>
                        <p>Real-time tracking via your Uber/Pickme app.</p>
                      </div>
                    </div>

                    <div className="highlight-mini-card">
                      <div className="mini-icon"><Clock size={20} /></div>
                      <div>
                        <strong>Availability:</strong>
                        <p>Monday – Saturday, 9:00 AM to 5:00 PM (Closed on Poya & Mercantile holidays).</p>
                        <small className="shop-sunday-note">Note: Our physical shop is open on Sundays until 7:00 PM (unless it's a holiday).</small>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Vehicle Choice Selector */}
                  <div className="vehicle-choice-panel">
                    <h4 className="v-title">Vehicle Choice</h4>
                    <div className="vehicle-toggle-grid">
                      <div
                        className={`vehicle-card ${deliveryVehicle === 'motorcycle' ? 'active' : ''}`}
                        onClick={() => setDeliveryVehicle('motorcycle')}
                      >
                        <div className="v-header">
                          <span className="v-icon">🛵</span>
                          <div>
                            <strong>Motorbikes</strong>
                            <span className="v-tag">Recommended for orders under 5kg (cheaper)</span>
                          </div>
                        </div>
                        <p className="v-desc">Cheaper and faster through Colombo city traffic for breadboards, sensors, modules & microcontroller boards.</p>
                      </div>

                      <div
                        className={`vehicle-card ${deliveryVehicle === 'threewheeler' ? 'active' : ''}`}
                        onClick={() => setDeliveryVehicle('threewheeler')}
                      >
                        <div className="v-header">
                          <span className="v-icon">🛺</span>
                          <div>
                            <strong>Three-Wheelers</strong>
                            <span className="v-tag">Best for larger/heavier orders</span>
                          </div>
                        </div>
                        <p className="v-desc">Safe enclosed transport for bulky orders, 3D printer filaments, power supplies, test instruments & lab kits.</p>
                      </div>
                    </div>
                  </div>

                  {/* How to Order Steps */}
                  <div className="how-to-order-quick-box">
                    <h4 className="flow-title">How to Order</h4>

                    <div className="quick-steps-grid">
                      <div className="q-step-card">
                        <div className="q-step-num">Step 1</div>
                        <h5>Place Order</h5>
                        <p>Add <strong>"Uber / Pickme collection"</strong> in the comments box during online checkout.</p>
                      </div>

                      <div className="q-step-card">
                        <div className="q-step-num">Step 2</div>
                        <h5>Wait for SMS</h5>
                        <p>We will remove the standard courier charge and SMS you the bank details for the items only.</p>
                      </div>

                      <div className="q-step-card">
                        <div className="q-step-num">Step 3</div>
                        <h5>Pay & Confirm</h5>
                        <p>Pay via bank transfer using the last 4 digits of your order number as the reference. Send your payment proof via WhatsApp to <strong>071 7790035</strong>.</p>
                      </div>

                      <div className="q-step-card">
                        <div className="q-step-num">Step 4</div>
                        <h5>Book the Delivery</h5>
                        <p>Open Uber or Pickme and select the <strong>"Flash"</strong> or <strong>"Delivery"</strong> service.</p>
                      </div>
                    </div>

                    {/* Interactive Pickup Location Dispatch Station with Copy Buttons */}
                    <div className="interactive-pickup-card">
                      <div className="pickup-info-col">
                        <div className="field-group">
                          <span className="field-label">📍 Pickup Location:</span>
                          <div className="copy-action-row">
                            <strong className="field-value">Wewalduwa, Tyre Junction, Kelaniya</strong>
                            <button
                              className="copy-btn-amber"
                              onClick={() => handleCopyText("Wewalduwa, Tyre Junction, Kelaniya", "loc")}
                              type="button"
                              title="Copy Pickup Location"
                            >
                              {copiedKey === 'loc' ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedKey === 'loc' ? 'Copied!' : 'Copy Location'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="field-group">
                          <span className="field-label">📞 Pickup Contact:</span>
                          <div className="copy-action-row">
                            <strong className="field-value">071 7790035</strong>
                            <button
                              className="copy-btn-amber"
                              onClick={() => handleCopyText("0717790035", "phone")}
                              type="button"
                              title="Copy Pickup Contact"
                            >
                              {copiedKey === 'phone' ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedKey === 'phone' ? 'Copied!' : 'Copy Phone'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="field-group">
                          <span className="field-label">🎯 Destination:</span>
                          <span className="field-value">Your address.</span>
                        </div>

                        <div className="field-group handover-group">
                          <span className="field-label">🤝 Handover:</span>
                          <span className="field-value">We will receive an SMS with your driver’s details and hand over the parcel once they arrive.</span>
                        </div>
                      </div>

                      <div className="pickup-actions-col">
                        <a
                          href="https://wa.me/94717790035?text=Hi%20Buildify%20Solutions,%20I%20am%20coordinating%20a%20Quick%20Delivery%20(Uber/PickMe)%20order"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whatsapp-quick-btn"
                        >
                          <i className="bi bi-whatsapp"></i> WhatsApp Slip (071 7790035)
                        </a>
                        <span className="instant-notice">Send payment proof and vehicle details for instant handover</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* =========================================================
          TAB 5: OFFICIAL HARDWARE POLICIES & WARRANTY TERMS
          ========================================================= */}
      {activeTab === 'policies' && (
        <main className="iot-policies-view">
          <section className="iot-info-hero-section">
            <div className="section-container">
              {/* Header */}
              <div className="info-hero-centered">
                <div className="section-eyebrow eyebrow-amber">
                  <ShieldCheck size={13} /> Buildify Solutions Official Terms
                </div>
                <h1 className="info-hero-title">
                  Hardware Warranty & Store Policies
                </h1>
                <p className="info-hero-subtitle">
                  We provide genuine warranty coverage against manufacturing defects on eligible modules and tools. Please review our industry-standard technical warranty guidelines, 3.3V logic safeguards, and claims process below.
                </p>
              </div>

              {/* Warranty Coverage Matrix Grid */}
              <div className="policy-coverage-matrix">
                <div className="coverage-card covered-card">
                  <div className="cov-badge covered">Covered by Warranty</div>
                  <div className="cov-header">
                    <CheckCircle2 size={24} className="text-green" />
                    <h3>Manufacturing Defects Only</h3>
                  </div>
                  <ul className="cov-list">
                    <li>
                      <span className="cov-duration">6 Months</span>
                      <div>
                        <strong>Electronic Modules</strong>
                        <p>Microcontroller development boards, sensor breakout boards, communication shields.</p>
                      </div>
                    </li>
                    <li>
                      <span className="cov-duration">6 Months</span>
                      <div>
                        <strong>Electronic Tools</strong>
                        <p>Soldering stations, multimeters, wire strippers, lab bench equipment.</p>
                      </div>
                    </li>
                    <li>
                      <span className="cov-duration">1 Year</span>
                      <div>
                        <strong>3D Printers</strong>
                        <p>Creality, Anycubic & industrial FDM printers (except physical damages due to misuse, overvoltage, etc.).</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="coverage-card not-covered-card">
                  <div className="cov-badge not-covered">Not Covered by Warranty</div>
                  <div className="cov-header">
                    <AlertTriangle size={24} className="text-amber" />
                    <h3>Exclusions & Consumables</h3>
                  </div>
                  <ul className="cov-list">
                    <li>
                      <span className="cov-tag">No Warranty</span>
                      <div>
                        <strong>Passive Semiconductor Components</strong>
                        <p>ICs, Transistors, FETs, Triacs, Diacs, IGBTs, SCRs, Diodes, Inductors, Capacitors, Resistors, Bridge rectifiers, Fuses, etc.</p>
                      </div>
                    </li>
                    <li>
                      <span className="cov-tag">7-Day Window</span>
                      <div>
                        <strong>Batteries (All Chemistries)</strong>
                        <p>AA, AAA, 18650, LiPo, Li-Ion, LiFePO4. (Should battery fail to function within 1 week of purchase, refund or replacement considered under reasonable business practice).</p>
                      </div>
                    </li>
                    <li>
                      <span className="cov-tag">No Warranty</span>
                      <div>
                        <strong>Wiring & Connection Hardware</strong>
                        <p>Wires, Cables, Jumper wires, Terminals, Sockets, Jacks, Connectors, Breadboards.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Notice Strip: Physical Damage, Logistics & Strict No-Return Notice */}
              <div className="policy-alert-banner">
                <div className="alert-banner-item">
                  <div className="alert-icon-box"><Clock size={22} className="text-amber" /></div>
                  <div>
                    <strong>1-Week Physical Damage Reporting Window</strong>
                    <p>Any physical damages observed upon receipt must be reported within <strong>1 week of purchase</strong>.</p>
                  </div>
                </div>

                <div className="alert-banner-divider"></div>

                <div className="alert-banner-item">
                  <div className="alert-icon-box"><Truck size={22} className="text-amber" /></div>
                  <div>
                    <strong>Important Notice on Shipping & Transport Costs</strong>
                    <p>Buildify Solutions is solely liable for the physical items sold under the stated warranty conditions. <strong>All transport, courier, postal, and handling costs</strong> incurred to deliver items to our shop for inspection, or to receive replaced/repaired items back, must be <strong>fully borne by the customer</strong>.</p>
                  </div>
                </div>

                <div className="alert-banner-divider"></div>

                <div className="alert-banner-item">
                  <div className="alert-icon-box"><ShieldAlert size={22} className="text-red" /></div>
                  <div>
                    <strong>Strict No-Return Policy (Seal Broken / Unpacked)</strong>
                    <p>No returns, refunds, or exchanges once the security seal is broken, anti-static bag is unsealed, or the item is taken out of its factory packaging.</p>
                  </div>
                </div>
              </div>

              {/* Dedicated Official Return & Anti-Static Packaging Policy Card */}
              <div className="policy-seal-return-card">
                <div className="seal-return-header">
                  <div className="seal-header-left">
                    <div className="seal-icon-badge">
                      <ShieldAlert size={26} className="text-red" />
                    </div>
                    <div>
                      <span className="seal-policy-eyebrow">OFFICIAL STORE RETURN POLICY</span>
                      <h3>Strict No-Return Policy: Unpacked & Broken-Seal Hardware</h3>
                    </div>
                  </div>
                  <span className="seal-status-tag">
                    <Lock size={12} /> Non-Returnable Once Opened
                  </span>
                </div>

                <div className="seal-return-content">
                  <p className="seal-lead-text">
                    Under Buildify Solutions official store terms, <strong>goods cannot be returned, exchanged, or refunded once the anti-static packaging or security seal has been removed, broken, or the item has been taken out of its factory packing</strong>.
                  </p>

                  <div className="seal-reasons-grid">
                    <div className="seal-reason-item">
                      <div className="seal-reason-icon">⚡</div>
                      <div>
                        <strong>Electrostatic Discharge (ESD) Sensitivity:</strong>
                        <p>Microcontrollers (ESP32, Arduino, STM32, RP2040) and semiconductor ICs are highly sensitive to microscopic electrostatic discharge from fingertips or non-grounded tools, which can cause internal gate oxide breakdown.</p>
                      </div>
                    </div>

                    <div className="seal-reason-item">
                      <div className="seal-reason-icon">🔒</div>
                      <div>
                        <strong>100% Untouched Factory-Fresh Guarantee:</strong>
                        <p>To guarantee that every maker and engineering client receives 100% brand-new, factory-tested, uncompromised components, we never restock or resell any module or sensor that has been opened or handled.</p>
                      </div>
                    </div>

                    <div className="seal-reason-item">
                      <div className="seal-reason-icon">⚠️</div>
                      <div>
                        <strong>Wiring & Reverse Voltage Risks:</strong>
                        <p>Any module showing evidence of breadboard pin insertion, terminal connection, soldering traces, or reverse polarity exposure is strictly ineligible for return, credit, or exchange.</p>
                      </div>
                    </div>

                    <div className="seal-reason-item">
                      <div className="seal-reason-icon">📦</div>
                      <div>
                        <strong>Return Eligibility Exception (Unopened Only):</strong>
                        <p>A return or exchange request will only be considered within <strong>7 days of purchase</strong> if the item remains in <strong>100% pristine, unopened, and sealed original factory packaging</strong> with original receipt/invoice.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Technical Advisory: 3.3V vs 5V TTL Logic Levels */}
              <div className="voltage-safety-advisory-card">
                <div className="advisory-top">
                  <div className="advisory-title-group">
                    <Zap size={22} className="text-amber" />
                    <h3>CRITICAL TECHNICAL SAFEGUARD: 3.3V TTL vs 5V LOGIC</h3>
                  </div>
                  <span className="advisory-tag">Industry Norm Notice</span>
                </div>
                <div className="advisory-body">
                  <p>
                    As per standard norms in the technology industry, warranty is strictly void if components are burned due to overvoltage or inappropriate signal interfacing.
                  </p>
                  <div className="advisory-example-box">
                    <strong>⚠️ Example for Raspberry Pi & ESP32 / ESP8266 (NodeMCU):</strong>
                    <p>
                      Devices such as Raspberry Pi and NodeMCU (ESP8266, ESP32) have all their GPIO pins operating at <strong>3.3V TTL logic level</strong>. If you connect an Arduino 5V TTL module without properly using bidirectional logic level shifters / converters or resistive dividers, that will <strong>easily burn the SoC silicon instantly</strong>, which completely voids the manufacturer warranty.
                    </p>
                  </div>
                </div>
              </div>

              {/* How to Claim Warranty Checklist */}
              <div className="policy-claim-procedure-card">
                <div className="claim-procedure-header">
                  <FileText size={22} className="text-amber" />
                  <div>
                    <h2>How to Claim Warranty</h2>
                    <p>First, send an email mentioning and attaching <strong>ALL</strong> of the following details to <a href="mailto:buildifysoluition@gmail.com" className="text-amber underline">buildifysoluition@gmail.com</a>:</p>
                  </div>
                </div>

                <div className="claim-checklist-grid">
                  <div className="checklist-col">
                    <div className="check-item-card">
                      <span className="c-num">1</span>
                      <div>
                        <strong>Receipt / Order Reference:</strong>
                        <p>Receipt number OR Online Order Reference of the Buildify Solutions purchase.</p>
                      </div>
                    </div>

                    <div className="check-item-card">
                      <span className="c-num">2</span>
                      <div>
                        <strong>Wiring Diagram:</strong>
                        <p>Schematic or fritzing diagram of your circuit setup (only if applicable).</p>
                      </div>
                    </div>

                    <div className="check-item-card">
                      <span className="c-num">3</span>
                      <div>
                        <strong>Top-Down Connection Photo:</strong>
                        <p>Clear photo taken from top showing exact wire connections (only if applicable).</p>
                      </div>
                    </div>

                    <div className="check-item-card">
                      <span className="c-num">4</span>
                      <div>
                        <strong>Two Physical Item Photos (Both Sides):</strong>
                        <p>Showing physical appearance; must be in original condition as purchased.</p>
                      </div>
                    </div>

                    <div className="check-item-card">
                      <span className="c-num">5</span>
                      <div>
                        <strong>Power Supply Photo & Ratings:</strong>
                        <p>Clear photo of power supply showing input/output voltages and current (if applicable).</p>
                      </div>
                    </div>
                  </div>

                  <div className="checklist-col">
                    <div className="check-item-card">
                      <span className="c-num">6</span>
                      <div>
                        <strong>Test Source Code:</strong>
                        <p>The minimal test sketch or firmware used (only if applicable).</p>
                      </div>
                    </div>

                    <div className="check-item-card">
                      <span className="c-num">7</span>
                      <div>
                        <strong>Reference Links:</strong>
                        <p>Links to the documentation or tutorial websites referred to.</p>
                      </div>
                    </div>

                    <div className="check-item-card">
                      <span className="c-num">8</span>
                      <div>
                        <strong>Brief Issue Explanation:</strong>
                        <p>Detailed description of the unexpected behavior or failure.</p>
                      </div>
                    </div>

                    <div className="check-item-card highlight-card">
                      <span className="c-num">9</span>
                      <div>
                        <strong>Personal Details & Technical Background *:</strong>
                        <ul className="profile-micro-list">
                          <li>• Highest level of education: Doctorate, MSc, BSc, Diploma, A/L, O/L, etc.</li>
                          <li>• Electronics knowledge: Sound / Average / Low</li>
                          <li>• Embedded systems knowledge: Sound / Average / Low</li>
                          <li>• Contact phone number</li>
                        </ul>
                        <small className="field-reason">
                          * We collect this information to tailor our technical support to your background—so we can explain issues clearly and provide assistance matching your expertise.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Handover & Office Details */}
                <div className="handover-process-box">
                  <div className="handover-title">
                    <Building2 size={18} className="text-amber" />
                    <h4>Physical Inspection Handover & Diagnostic Timeline</h4>
                  </div>
                  <p>
                    Once all information is submitted and no preliminary setup issues are found, we will request you to hand over the item to our office in Kelaniya or send via Registered Post/Courier.
                  </p>
                  <div className="handover-warning-strip">
                    <strong>⚠️ Important Logistics Notice:</strong>
                    <span>We do not pay for parcels coming to our office for warranty claims. All return logistics and associated delivery charges remain the entire responsibility of the customer, regardless of the inspection outcome. Our qualified engineering team will perform an investigation taking up to <strong>10 working days</strong> (excluding weekends, mercantile holidays, and travel restriction times).</span>
                  </div>

                  <div className="sigma-address-card">
                    <div className="sigma-info">
                      <strong>Buildify Solutions (Pickup & Inspection Lab)</strong>
                      <p>Wewalduwa, Tyre Junction, Kelaniya, Sri Lanka</p>
                      <p>Tel: <strong>071 7790035</strong> | Email: <strong>buildifysoluition@gmail.com</strong></p>
                    </div>
                    <div className="sigma-actions">
                      <button
                        className="copy-btn-amber"
                        onClick={() => handleCopyText("Buildify Solutions, Wewalduwa, Tyre Junction, Kelaniya", "buildify_addr")}
                        type="button"
                      >
                        {copiedKey === 'buildify_addr' ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedKey === 'buildify_addr' ? 'Copied Address!' : 'Copy Office Address'}</span>
                      </button>
                      <a
                        href="https://wa.me/94717790035?text=Hi%20Buildify%20Solutions,%20I%20have%20submitted%20a%20warranty%20claim%20email"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="claim-wa-btn"
                      >
                        <i className="bi bi-whatsapp"></i> WhatsApp Claims Desk (071 7790035)
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8 Official Warranty Frequently Asked Questions */}
              <div className="official-policy-faqs-section">
                <div className="section-subtitle-bar">
                  <HelpCircle size={18} className="text-amber" />
                  <h3>Official Warranty Questions & Answers (Buildify Solutions Policy)</h3>
                </div>

                <div className="policy-faq-list">
                  {[
                    {
                      q: "1. Where should I handover the defective item(s) for inspection?",
                      a: "To Buildify Solutions in Wewalduwa, Tyre Junction, Kelaniya."
                    },
                    {
                      q: "2. If I can't come, shall I send the defective item(s) via Registered Post or courier, and should I pay the delivery fee?",
                      a: "Yes, you can safely pack the items and send to us by paying all the fees involved. We will not be paying to any courier service to collect parcels."
                    },
                    {
                      q: "3. If I can't come, can you send the replacement item(s) or working item(s) via courier service, and should I pay for the courier company?",
                      a: "Yes, Buildify Solutions can send the item(s) via courier service and you need to pay the courier fee."
                    },
                    {
                      q: "4. What happens if Buildify Solutions finds the item working?",
                      a: "Buildify Solutions will send you a video as proof and you have to pay for the time involved in testing. Current fee as of 01/01/2024 is Rs. 1,000 per hour."
                    },
                    {
                      q: "5. What happens if we find you have burned it due to misuse?",
                      a: "If the module is burned due to misconnection, firmware update or any other user activity, we will give you a report on that and you have to pay for the time involved in testing. Current fee as of 01/01/2024 is Rs. 1,000 per hour."
                    },
                    {
                      q: "6. What happens if we find a manufacturing defect?",
                      a: "There are two options for you. One is to request a refund and the other is to request a replacement. (If you cannot come in person, you can pay courier fees for return dispatch)."
                    },
                    {
                      q: "7. What happens if I neglect to pay the expenses?",
                      a: "To avoid further losses, Buildify Solutions will remove you from the system and stop further interactions."
                    },
                    {
                      q: "8. Why does Buildify Solutions charge for technical support?",
                      a: "You need to pay for the time spent on your work by our qualified technical staff."
                    },
                    {
                      q: "9. Can I return, exchange, or refund an item if the security seal or anti-static packing has been opened?",
                      a: "No. Buildify Solutions strictly enforces a NO-RETURN and NO-REFUND policy once the security seal is broken, anti-static bag is cut, or the product is removed from its packaging. Microcontrollers and silicon sensors are highly sensitive to Electrostatic Discharge (ESD) and wiring errors. To protect all clients with guaranteed 100% genuine, untampered factory stock, returns are strictly rejected once opened."
                    }
                  ].map((pfaq, pIdx) => {
                    const isOpen = openPolicyFaq === pIdx;
                    return (
                      <div key={pIdx} className={`policy-faq-row ${isOpen ? 'open' : ''}`}>
                        <button
                          className="policy-faq-question"
                          onClick={() => setOpenPolicyFaq(isOpen ? null : pIdx)}
                          type="button"
                        >
                          <span className="pfaq-q">{pfaq.q}</span>
                          <ChevronDown size={18} className={`pfaq-chevron ${isOpen ? 'rotated' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="policy-faq-answer">
                            <p>{pfaq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Warranty Voiding Conditions (12 Factors) */}
              <div className="voiding-conditions-panel">
                <div className="void-header">
                  <AlertCircle size={20} className="text-amber" />
                  <div>
                    <h3>WARRANTY TERMS & CONDITIONS</h3>
                    <p>Warranty or return requests will be strictly void / rejected if one or many of the following conditions have met:</p>
                  </div>
                </div>

                <div className="void-grid-11">
                  <div className="void-card">
                    <span className="v-num">01</span>
                    <p>Burn marks caused by short circuitry</p>
                  </div>
                  <div className="void-card">
                    <span className="v-num">02</span>
                    <p>Mechanical damage during transportation of defective unit</p>
                  </div>
                  <div className="void-card">
                    <span className="v-num">03</span>
                    <p>Any modification applied to the unit which was not performed by authorized personnel</p>
                  </div>
                  <div className="void-card">
                    <span className="v-num">04</span>
                    <p>Inappropriate installation or commissioning</p>
                  </div>
                  <div className="void-card">
                    <span className="v-num">05</span>
                    <p>Negligence or inappropriate use of the product</p>
                  </div>
                  <div className="void-card">
                    <span className="v-num">06</span>
                    <p>External event (overvoltage, failure of other components in the installation causing our unit to fail, etc.)</p>
                  </div>
                  <div className="void-card">
                    <span className="v-num">07</span>
                    <p>Non-observance of documentation, including preventative maintenance</p>
                  </div>
                  <div className="void-card">
                    <span className="v-num">08</span>
                    <p>Force majeure, including but not restricted to lightning, power surges, natural disasters, and fires</p>
                  </div>
                  <div className="void-card">
                    <span className="v-num">09</span>
                    <p>Returned unit shows no fault after analysis</p>
                  </div>
                  <div className="void-card">
                    <span className="v-num">10</span>
                    <p>Improper or no application of safety regulations</p>
                  </div>
                  <div className="void-card">
                    <span className="v-num">11</span>
                    <p>Utilization in combination with equipment, items or materials not permitted by documentation</p>
                  </div>
                  <div className="void-card void-card-alert">
                    <span className="v-num text-red">12</span>
                    <p><strong>Broken security seal or opened anti-static factory packaging</strong> (strictly voids return, exchange, or refund eligibility)</p>
                  </div>
                </div>
              </div>

              {/* Special Warranty Terms & Conditions (Product Wise) */}
              <div className="special-warranty-panel">
                <div className="special-header">
                  <Zap size={20} className="text-amber" />
                  <div>
                    <h3>SPECIAL WARRANTY TERMS & CONDITIONS (PRODUCT WISE)</h3>
                    <p>Strict technical guidelines for high-power power electronics</p>
                  </div>
                </div>

                <div className="special-products-grid">
                  {/* Inverters */}
                  <div className="special-prod-card">
                    <div className="prod-badge">Product Category A</div>
                    <h4>A. Power Inverters</h4>
                    <ul className="prod-req-list">
                      <li>
                        <strong>Grid Power Protection:</strong>
                        <p>As per conditions (4), (5), (6), (9) above, make sure <strong>never to connect grid power to the output</strong> of the Inverter which will damage it permanently.</p>
                      </li>
                      <li>
                        <strong>Battery Chemistry & Quality:</strong>
                        <p>As per condition (10) above, make sure to use proper batteries with correct voltage. Do not use damaged or substandard batteries.</p>
                      </li>
                      <li>
                        <strong>50% Peak Load Limit:</strong>
                        <p>As per condition (10) above, <strong>do not exceed half (1/2) of the marked output peak wattage</strong>. For example, if you use a 5kW inverter, the maximum you can use continuously is 2.5kW. Exceeding this will make the inverter heat up and damage internal components.</p>
                      </li>
                      <li>
                        <strong>Qualified Technician:</strong>
                        <p>As per condition (2) above, if you do not know the subject properly, always get the installation done by a qualified technician.</p>
                      </li>
                    </ul>
                  </div>

                  {/* Battery Chargers */}
                  <div className="special-prod-card">
                    <div className="prod-badge">Product Category B</div>
                    <h4>B. Battery Chargers</h4>
                    <ul className="prod-req-list">
                      <li>
                        <strong>Disconnect Output Sources:</strong>
                        <p>Make sure to disconnect batteries from any output source when you connect the battery charger.</p>
                      </li>
                      <li>
                        <strong>End-of-Life Battery Warning:</strong>
                        <p>If the battery is too weak (end of life), do not use the battery charger to continuously charge the battery. Lifespan for a standard lead-acid battery is <strong>3 years maximum</strong>.</p>
                      </li>
                      <li>
                        <strong>Remove Probes Before Operation:</strong>
                        <p>After charging, make sure to remove the probes of the charger from batteries before connecting batteries to the output source (such as an inverter).</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* =========================================================
          TAB 6: FREQUENTLY ASKED QUESTIONS (FAQ) WITH MASCOT BUILDY
          ========================================================= */}
      {activeTab === 'faq' && (
        <main className="iot-faq-view">
          <section className="iot-info-hero-section">
            <div className="section-container">
              {/* Mascot 24-Hour WhatsApp Assistance Hero */}
              <div className="mascot-faq-hero-container">
                <div className="mascot-visual-wrap">
                  <div className="mascot-img-glow"></div>
                  <img
                    src="/mascot-faq.png"
                    alt="Buildy - Buildify Mascot"
                    className="mascot-img"
                  />
                  <div className="mascot-status-tag">
                    <span className="online-dot"></span> 24/7 Online Support
                  </div>
                </div>

                <div className="mascot-dialogue-wrap">
                  <div className="mascot-speech-bubble">
                    <div className="speech-badge">
                      <Zap size={14} /> 24-Hour WhatsApp Customer Assistance
                    </div>
                    <h2 className="bubble-heading">
                      "Hey Maker! Have any questions about our IoT sensors, pinouts, or orders?"
                    </h2>
                    <p className="bubble-text">
                      I'm <strong>Buildy</strong>, your Buildify Solutions hardware companion! Whether you are debugging a 3.3V ESP32 circuit, checking stock for a university robotics competition, or need quick PickMe Flash delivery in Colombo—our engineering team is ready on WhatsApp 24/7!
                    </p>

                    <div className="bubble-actions">
                      <a
                        href="https://wa.me/94717790035?text=Hi%20Buildy!%20I%20have%20a%20question%20about%20an%20IoT%20component"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bubble-wa-btn primary"
                      >
                        <i className="bi bi-whatsapp"></i> Chat with Hardware Desk (071 7790035)
                      </a>
                      <a
                        href="tel:0717790035"
                        className="bubble-wa-btn secondary"
                      >
                        <Phone size={14} /> Call Direct (071 7790035)
                      </a>
                    </div>
                  </div>

                  {/* Micro reassurance badges */}
                  <div className="mascot-metrics-row">
                    <div className="m-metric">
                      <Clock size={16} className="text-amber" />
                      <div>
                        <strong>&lt; 15 Mins</strong>
                        <span>Avg WhatsApp Response</span>
                      </div>
                    </div>
                    <div className="m-metric">
                      <Truck size={16} className="text-amber" />
                      <div>
                        <strong>24-Hour</strong>
                        <span>Islandwide Dispatch</span>
                      </div>
                    </div>
                    <div className="m-metric">
                      <Cpu size={16} className="text-amber" />
                      <div>
                        <strong>100% Genuine</strong>
                        <span>Authorized Silicon</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="faq-filter-container">
                <div className="faq-filter-title">Filter by Topic:</div>
                <div className="faq-category-pills">
                  {[
                    { id: 'all', label: 'All Questions' },
                    { id: 'delivery', label: '🚚 24H Delivery & Orders' },
                    { id: 'technical', label: '⚡ Voltage Safety & 3.3V GPIOs' },
                    { id: 'warranty', label: '🛡️ Warranty Claims & Rs. 1,000 Testing' },
                    { id: 'custom', label: '🛠️ Custom Firmware & Bulk RFP' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      className={`faq-cat-pill ${faqCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setFaqCategory(cat.id)}
                      type="button"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ Accordion List */}
              <div className="faq-accordion-container">
                {faqItems
                  .filter((item) => faqCategory === 'all' || item.category === faqCategory)
                  .map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className={`faq-item-row ${isOpen ? 'open' : ''}`}>
                        <button
                          className="faq-question-btn"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          type="button"
                        >
                          <span className="faq-q-text">{item.q}</span>
                          <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'rotated' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="faq-answer-body">
                            <p>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Bottom Reassurance / Direct Hotline */}
              <div className="faq-support-box">
                <div className="faq-support-content">
                  <Phone size={24} className="text-amber" />
                  <div>
                    <h4>Have a unique custom requirement or question not listed here?</h4>
                    <p>Our senior hardware architects and customer support staff are available via phone and WhatsApp during business hours.</p>
                  </div>
                </div>
                <div className="faq-bottom-actions">
                  <a href="tel:0717790035" className="faq-phone-link">
                    <Phone size={15} /> 071 7790035
                  </a>
                  <a
                    href="https://wa.me/94717790035?text=Hi%20Buildify%20Solutions,%20I%20have%20a%20technical%20question"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="faq-chat-btn"
                  >
                    <i className="bi bi-whatsapp"></i> WhatsApp 24/7 Assistance (071 7790035)
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* =========================================================
          SLIDE-OUT SHOPPING CART DRAWER
          ========================================================= */}
      {isCartOpen && (
        <div className="cart-backdrop" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <div className="cart-title">
                <ShoppingCart size={18} />
                <span>Your Hardware Cart ({cartTotalItems})</span>
              </div>
              <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="cart-delivery-guarantee-pill">
              <Truck size={13} />
              <span>24-Hour Express Islandwide Delivery Active</span>
            </div>

            <div className="cart-items-scroll">
              {cart.length === 0 ? (
                <div className="cart-empty-message">
                  <Box size={38} className="cart-empty-icon" />
                  <p>Your hardware cart is currently empty.</p>
                  <button className="browse-store-btn" onClick={() => setIsCartOpen(false)}>
                    Browse Hardware Store
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <img src={item.image} alt={item.name} className="cart-item-thumb" />
                    <div className="cart-item-details">
                      <span className="cart-sku">{item.sku}</span>
                      <h5 className="cart-item-title">{item.name}</h5>
                      <div className="cart-item-price">{formatPrice(item.priceLKR)} each</div>
                      <div className="cart-qty-controls">
                        <button onClick={() => updateCartQty(item.id, -1)}><Minus size={11} /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateCartQty(item.id, 1)}><Plus size={11} /></button>
                        <button className="cart-trash-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <div className="cart-item-total">
                      {formatPrice(item.priceLKR * item.qty)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-summary-line">
                  <span>Subtotal ({currency}):</span>
                  <strong>{formatPrice(cartSubtotalLKR)}</strong>
                </div>
                {currency === 'USD' && (
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', padding: '2px 0 6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                    <span>Real-time Forex: 1 USD ≈ Rs. {forexData.rate}</span>
                  </div>
                )}
                <div className="cart-summary-line">
                  <span>Islandwide Courier:</span>
                  <span className="text-amber">Calculated at Checkout</span>
                </div>

                <button className="cart-checkout-whatsapp-btn" onClick={handleWhatsAppCheckout}>
                  <i className="bi bi-whatsapp"></i>
                  <span>Checkout Order via WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          PRODUCT PINOUT & SPECS MODAL
          ========================================================= */}
      {activeModalProduct && (
        <div className="product-modal-backdrop" onClick={() => setActiveModalProduct(null)}>
          <div className="product-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModalProduct(null)}>
              <X size={16} />
            </button>

            <div className="modal-grid-2col">
              <div className="modal-img-col">
                <img src={activeModalProduct.image} alt={activeModalProduct.name} className="modal-large-img" />
                <div className="modal-delivery-tag">
                  <Truck size={13} /> Guaranteed 24-Hour Delivery in Sri Lanka
                </div>
              </div>

              <div className="modal-info-col">
                <span className="modal-sku-tag">{activeModalProduct.sku}</span>
                <h3 className="modal-title">{activeModalProduct.name}</h3>
                <div className="modal-brand-row">
                  <span>Brand: <strong>{activeModalProduct.brand}</strong></span>
                  <span>Category: <strong>{activeModalProduct.category}</strong></span>
                </div>

                <div className="modal-price-box">
                  <span className="modal-price-now">{formatPrice(activeModalProduct.priceLKR)}</span>
                  {activeModalProduct.originalPriceLKR && (
                    <span className="modal-price-was">{formatPrice(activeModalProduct.originalPriceLKR)}</span>
                  )}
                </div>

                <p className="modal-desc">{activeModalProduct.description}</p>

                {activeModalProduct.specs && (
                  <div className="modal-specs-table">
                    <h5>Technical Specifications:</h5>
                    <div className="specs-list">
                      {Object.entries(activeModalProduct.specs).map(([key, val]) => (
                        <div key={key} className="spec-item-row">
                          <span className="spec-key">{key}:</span>
                          <span className="spec-val">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeModalProduct.pinoutSummary && (
                  <div className="modal-pinout-note">
                    <strong>Pinout & Package:</strong>
                    <p>{activeModalProduct.pinoutSummary}</p>
                  </div>
                )}

                <div className="modal-actions-row">
                  <button
                    className="modal-add-cart-btn"
                    onClick={() => {
                      addToCart(activeModalProduct);
                      setActiveModalProduct(null);
                    }}
                  >
                    <ShoppingCart size={15} /> Add to Cart
                  </button>

                  <button
                    className="modal-buy-whatsapp-btn"
                    onClick={() => handleInstantBuy(activeModalProduct)}
                  >
                    <i className="bi bi-whatsapp"></i> Instant Buy
                  </button>

                  {activeModalProduct.datasheetUrl && (
                    <a
                      href={activeModalProduct.datasheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-datasheet-btn"
                    >
                      <ExternalLink size={13} /> Datasheet
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          CRYSTALLINE FLOATING GLASS FOOTER (MATCHING GATEWAY THEME)
          ========================================================= */}
      <footer className="iot-floating-footer">
        <div className="iot-footer-glass-bar">
          <div className="gateway-footer-brand" onClick={onBackToGateway} role="button" tabIndex={0} title="Buildify Solutions - Back to Gateway">
            <Logo size="small" showTagline={true} />
          </div>

          <a
            href="tel:0717790035"
            className="gateway-footer-detail iot-footer-amber-detail"
            title="Call Buildify Solutions (071 7790035)"
          >
            <div className="footer-icon-circle iot-amber-circle"><Phone size={14} /></div>
            <div>
              <span className="footer-detail-label">OFFICIAL PHONE</span>
              <span className="footer-detail-value">071 7790035</span>
            </div>
          </a>

          <a
            href="mailto:buildifysoluition@gmail.com"
            className="gateway-footer-detail iot-footer-amber-detail"
            title="Send Email to buildifysoluition@gmail.com"
          >
            <div className="footer-icon-circle iot-amber-circle"><Mail size={14} /></div>
            <div>
              <span className="footer-detail-label">OFFICIAL EMAIL</span>
              <span className="footer-detail-value">buildifysoluition@gmail.com</span>
            </div>
          </a>

          <a
            href="https://maps.google.com/?q=Wewalduwa,+Tyre+Junction,+Kelaniya"
            target="_blank"
            rel="noopener noreferrer"
            className="gateway-footer-detail iot-footer-amber-detail"
            title="View Location on Google Maps (Wewalduwa, Tyre Junction, Kelaniya)"
          >
            <div className="footer-icon-circle iot-amber-circle"><MapPin size={14} /></div>
            <div>
              <span className="footer-detail-label">LOCATION</span>
              <span className="footer-detail-value">Wewalduwa, Tyre Junction, Kelaniya</span>
            </div>
          </a>

          <div className="gateway-footer-social">
            <span className="footer-detail-label">CONNECT</span>
            <div className="footer-social-icons">
              <a href="https://wa.me/94717790035" target="_blank" rel="noopener noreferrer" className="social-glass-btn iot-social-btn" title="WhatsApp">
                <i className="bi bi-whatsapp"></i>
              </a>
              <a href="https://www.tiktok.com/@buildifysolutionz?_r=1&_t=ZS-9A0KI77yMMu" target="_blank" rel="noopener noreferrer" className="social-glass-btn iot-social-btn" title="TikTok">
                <i className="bi bi-tiktok"></i>
              </a>
              <a href="https://www.instagram.com/buildifysolutionz?stkn=MTRramsxb2F5OTVxbA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="social-glass-btn iot-social-btn" title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://x.com/Buildifyz" target="_blank" rel="noopener noreferrer" className="social-glass-btn iot-social-btn" title="Twitter X">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn iot-social-btn" title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn iot-social-btn" title="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn iot-social-btn" title="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn iot-social-btn" title="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Sub-strip for copyright */}
        <div className="iot-footer-sub-strip">
          <span>&copy; {new Date().getFullYear()} Buildify Solutions. Smart IoT Microcontrollers, Precision Sensors & STEM Maker Kits.</span>
        </div>
      </footer>
    </div>
  );
}
