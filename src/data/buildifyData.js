// Buildify Solutions - Master Data Registry & E-Commerce Catalog

export const BUILDIFY_DATA = {
  company: {
    name: "Buildify Solutions",
    tagline: "WE BUILD. YOU GROW.",
    subtitle: "Web Development • Embedded Systems • IoT & Robotics • Digital Solutions",
    description: "Your premier destination for IoT hardware, microcontrollers (ESP32, Arduino, Raspberry Pi), sensors, robotics, STEM maker kits, 3D printing gear, and turn-key custom engineering.",
    founder: "Buildify Solutions",
    email: "buildifysoluition@gmail.com",
    phone: "071 7790035",
    internationalPhone: "+94 71 7790035",
    website: "buildifysolutions.lk",
    location: "Wewalduwa, Tyre Junction, Kelaniya, Sri Lanka",
    workingHours: "Mon - Sat: 8:30 AM - 7:00 PM (IST)",
    exchangeRateLKR: 310.0, // 1 USD = 310 LKR
    stats: [
      { label: "Hardware SKU Items", value: "2,500+" },
      { label: "Active Student Projects", value: "450+" },
      { label: "Makers & Engineers", value: "35,000+" },
      { label: "Custom Builds Delivered", value: "1,200+" }
    ],
    pillars: [
      { id: "web", title: "Web Development", icon: "bi-code-slash", desc: "Modern full-stack web platforms, telemetry dashboards, and cloud databases." },
      { id: "systems", title: "Business Systems", icon: "bi-display", desc: "Custom embedded IoT hardware, sensor telemetry, and automation." },
      { id: "digital", title: "Digital Solutions", icon: "bi-graph-up-arrow", desc: "Custom PCB design, 3D printing on demand, and hardware fabrication." }
    ],
    story: "Founded in Sri Lanka, Buildify Solutions was established with a singular mission: 'WE BUILD. YOU GROW.' We empower students, makers, and enterprises with genuine development boards, industrial sensors, robotics kits, and turn-key custom engineering solutions — bridging the gap between hardware concepts and commercial execution.",
    team: [
      {
        name: "Buildify Solutions Engineering",
        role: "Lead Systems & Hardware Architects",
        bio: "Dedicated engineering team steering Buildify Solutions across hardware innovation, IoT systems, and custom engineering builds in Sri Lanka.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        badge: "Core Engineering Team"
      },
      {
        name: "Dr. Elena Rostova",
        role: "Head of Robotics & Kinematics",
        bio: "Specialist in autonomous rover navigation, inverse kinematics, and STEM robotics lab kits.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        badge: "Robotics Lead"
      },
      {
        name: "Marcus Chen",
        role: "Lead IoT & Firmware Engineer",
        bio: "Specialist in ESP32 mesh telemetry, LoRaWAN protocols, and real-time cloud data pipelines.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        badge: "Firmware Specialist"
      },
      {
        name: "Sophia Martinez",
        role: "Head of STEM Maker Education",
        bio: "Championing accessible electronics lab workbooks, collegiate student hackathons, and guides.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        badge: "STEM Educator"
      }
    ]
  },

  // Technical Filter Metadata for Faceted Sidebar
  filterAttributes: {
    voltages: ["All", "3.3V", "5V", "3.3V - 5V", "12V", "24V"],
    brands: ["All", "Espressif", "Arduino", "Raspberry Pi", "Waveshare", "Buildify", "TowerPro", "Creality"],
    packageTypes: ["All", "DIP", "Module", "Breakout", "SMD", "Chassis Kit", "Tool"],
    stockStatuses: [
      { id: "all", label: "All Items" },
      { id: "in_stock", label: "In Stock Only" },
      { id: "low_stock", label: "Low Stock Alert" }
    ]
  },

  storeCategories: [
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
  ],

  products: [
    {
      id: "prod-esp32-devkit",
      sku: "BF-ESP32-DEV1",
      name: "ESP32 DevKit V1 (30-Pin CH340)",
      category: "esp32",
      brand: "Espressif",
      operatingVoltage: "3.3V",
      packageType: "Breakout",
      pinCount: 30,
      price: 6.99,
      priceLKR: 2165.0,
      originalPrice: 8.99,
      originalPriceLKR: 2785.0,
      stockQuantity: 48,
      lowStockThreshold: 10,
      rating: 4.9,
      reviewsCount: 328,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      description: "Dual-core Xtensa 32-bit LX6 MCU with integrated 2.4 GHz Wi-Fi and Bluetooth BLE 4.2. Ideal for smart home and IoT edge nodes.",
      badge: "Best Seller",
      inStock: true,
      datasheetUrl: "https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf",
      specs: {
        "Processor": "Tensilica Dual-Core 240MHz",
        "Wireless": "Wi-Fi 802.11 b/g/n + Bluetooth 4.2 BR/EDR & BLE",
        "Flash Memory": "4MB SPI Flash",
        "Operating Voltage": "3.3V (5V via Micro-USB)",
        "GPIO Pins": "25 Available GPIOs with PWM, ADC, DAC, I2C, SPI"
      },
      pinoutSummary: "30-pin standard breakout with built-in boot & reset tactile switches, red power LED, and onboard PCB antenna."
    },
    {
      id: "prod-esp32-cam",
      sku: "BF-ESP32-CAM",
      name: "ESP32-CAM AI-Thinker Module + OV2640",
      category: "esp32",
      brand: "Espressif",
      operatingVoltage: "3.3V - 5V",
      packageType: "Module",
      pinCount: 16,
      price: 11.49,
      priceLKR: 3560.0,
      originalPrice: 14.99,
      originalPriceLKR: 4645.0,
      stockQuantity: 24,
      lowStockThreshold: 5,
      rating: 4.8,
      reviewsCount: 215,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
      description: "Compact low-power camera module with OV2640 2MP sensor and onboard MicroSD card slot. Perfect for face recognition and video streaming.",
      badge: "AI Ready",
      inStock: true,
      datasheetUrl: "https://docs.ai-thinker.com/esp32-cam",
      specs: {
        "Camera": "OV2640 2-Megapixel (UXGA 1600x1200)",
        "PSRAM": "520 KB SRAM + Internal 4MB PSRAM",
        "Storage": "TF / MicroSD Card Slot up to 4GB",
        "Flash Lamp": "Ultra-bright onboard White LED",
        "Wi-Fi Video Stream": "Up to 15-20 FPS (SVGA)"
      },
      pinoutSummary: "16-pin ultra-compact breadboard-compatible format with high-gain IPEX antenna port option."
    },
    {
      id: "prod-esp32-s3",
      sku: "BF-ESP32-S3-WROOM",
      name: "ESP32-S3-WROOM Dual Type-C DevBoard",
      category: "esp32",
      brand: "Espressif",
      operatingVoltage: "3.3V",
      packageType: "Breakout",
      pinCount: 44,
      price: 14.99,
      priceLKR: 4645.0,
      originalPrice: 18.00,
      originalPriceLKR: 5580.0,
      stockQuantity: 12,
      lowStockThreshold: 5,
      rating: 5.0,
      reviewsCount: 84,
      image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80",
      description: "Next-generation ESP32-S3 with hardware vector instructions for TinyML/AI acceleration and dual USB-C ports (USB OTG + UART).",
      badge: "New Release",
      inStock: true,
      datasheetUrl: "https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf",
      specs: {
        "CPU": "Dual-Core LX7 240MHz with AI Vector Acceleration",
        "Memory": "16MB Flash + 8MB Octal PSRAM",
        "Connectivity": "Wi-Fi 4 + Bluetooth 5 (LE & Mesh)",
        "USB Interface": "Native High-Speed USB OTG + CH343 UART Type-C"
      },
      pinoutSummary: "44-pin high-density breakout with RGB WS2812 status LED."
    },
    {
      id: "prod-rpi-pico-w",
      sku: "BF-RPI-PICO-W",
      name: "Raspberry Pi Pico W (Dual-Core RP2040 WiFi)",
      category: "raspberry",
      brand: "Raspberry Pi",
      operatingVoltage: "3.3V",
      packageType: "DIP",
      pinCount: 40,
      price: 7.99,
      priceLKR: 2475.0,
      originalPrice: 9.99,
      originalPriceLKR: 3095.0,
      stockQuantity: 35,
      lowStockThreshold: 8,
      rating: 4.9,
      reviewsCount: 160,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
      description: "Official Raspberry Pi microcontroller board powered by RP2040 silicon with Infineon CYW43439 2.4GHz wireless.",
      badge: "Official Pi",
      inStock: true,
      datasheetUrl: "https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf",
      specs: {
        "Processor": "Dual-Core Arm Cortex-M0+ @ 133MHz",
        "RAM": "264KB SRAM on-chip",
        "Flash": "2MB QSPI Flash",
        "Wireless": "2.4GHz 802.11n Wi-Fi + Bluetooth 5.2"
      },
      pinoutSummary: "Castellated edge holes allowing direct SMD soldering or standard 2.54mm pin headers."
    },
    {
      id: "prod-rpi-5-4gb",
      sku: "BF-RPI5-4GB",
      name: "Raspberry Pi 5 (4GB RAM Quad-Core 2.4GHz)",
      category: "raspberry",
      brand: "Raspberry Pi",
      operatingVoltage: "5V",
      packageType: "Breakout",
      pinCount: 40,
      price: 69.99,
      priceLKR: 21695.0,
      originalPrice: 79.99,
      originalPriceLKR: 24795.0,
      stockQuantity: 4, // LOW STOCK
      lowStockThreshold: 5,
      rating: 5.0,
      reviewsCount: 95,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
      description: "The flagship single-board computer with 64-bit quad-core Arm Cortex-A76 processor, PCIe 2.0 interface, and dual 4K HDMI.",
      badge: "Low Stock",
      inStock: true,
      datasheetUrl: "https://datasheets.raspberrypi.com/rpi5/raspberry-pi-5-product-brief.pdf",
      specs: {
        "CPU": "Broadcom BCM2712 2.4GHz Quad-Core 64-Bit Arm Cortex-A76",
        "GPU": "VideoCore VII supporting OpenGL-ES 3.1 & Vulkan 1.2",
        "RAM": "4GB LPDDR4X-4267 SDRAM",
        "Display": "Dual 4Kp60 micro-HDMI display outputs"
      },
      pinoutSummary: "Standard 40-pin GPIO header, PCIe 2.0 x1 interface, USB 3.0 ports."
    },
    {
      id: "prod-arduino-uno-r4",
      sku: "BF-ARD-UNO-R4",
      name: "Arduino Uno R4 WiFi (RA4M1 32-Bit)",
      category: "arduino",
      brand: "Arduino",
      operatingVoltage: "5V",
      packageType: "Breakout",
      pinCount: 28,
      price: 27.50,
      priceLKR: 8525.0,
      originalPrice: 32.00,
      originalPriceLKR: 9920.0,
      stockQuantity: 18,
      lowStockThreshold: 5,
      rating: 4.9,
      reviewsCount: 190,
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
      description: "The revolution of the legendary Uno with Renesas RA4M1 32-bit Arm Cortex-M4, ESP32-S3 WiFi/BLE co-processor, and a 12x8 LED Matrix.",
      badge: "Official Tech",
      inStock: true,
      datasheetUrl: "https://docs.arduino.cc/resources/datasheets/ABX00087-datasheet.pdf",
      specs: {
        "Microcontroller": "Renesas RA4M1 (Arm Cortex-M4) @ 48 MHz",
        "Wireless Co-processor": "ESP32-S3-MINI",
        "Display": "Built-in 12x8 Red LED Matrix (96 LEDs)",
        "Operating Voltage": "5V with support up to 24V VIN",
        "DAC": "12-bit Analog DAC Output"
      },
      pinoutSummary: "Classic 100% Uno form factor with USB-C connector and Qwiic I2C connector."
    },
    {
      id: "prod-arduino-nano-v3",
      sku: "BF-ARD-NANO-C",
      name: "Arduino Nano V3.0 ATmega328P (Type-C)",
      category: "arduino",
      brand: "Buildify",
      operatingVoltage: "5V",
      packageType: "DIP",
      pinCount: 30,
      price: 5.49,
      priceLKR: 1700.0,
      originalPrice: 7.00,
      originalPriceLKR: 2170.0,
      stockQuantity: 75,
      lowStockThreshold: 10,
      rating: 4.7,
      reviewsCount: 412,
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      description: "Miniature breadboard-friendly workhorse board with upgraded modern Type-C port and 8 analog inputs.",
      badge: "Popular",
      inStock: true,
      datasheetUrl: "https://docs.arduino.cc/hardware/nano",
      specs: {
        "Microcontroller": "Microchip ATmega328P @ 16MHz",
        "Flash": "32 KB (2 KB used by bootloader)",
        "SRAM": "2 KB",
        "Analog Inputs": "8 Pins (A0-A7)",
        "Dimensions": "18mm x 45mm"
      },
      pinoutSummary: "30-pin DIP layout designed specifically for solderless breadboards."
    },
    {
      id: "prod-sensor-dht22",
      sku: "BF-SENS-DHT22",
      name: "DHT22 / AM2302 High-Precision Temp & Humidity Sensor",
      category: "sensors",
      brand: "Buildify",
      operatingVoltage: "3.3V - 5V",
      packageType: "Module",
      pinCount: 4,
      price: 4.80,
      priceLKR: 1488.0,
      originalPrice: 6.50,
      originalPriceLKR: 2015.0,
      stockQuantity: 52,
      lowStockThreshold: 10,
      rating: 4.8,
      reviewsCount: 147,
      image: "https://images.unsplash.com/photo-1580983218765-f663bec07b37?auto=format&fit=crop&w=600&q=80",
      description: "Digital calibrated capacitive sensor for measuring relative humidity (0-100% ±2%) and temperature (-40 to 80°C ±0.5°C).",
      badge: "High Accuracy",
      inStock: true,
      datasheetUrl: "https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf",
      specs: {
        "Humidity Range": "0-100% RH (±2-5% Accuracy)",
        "Temp Range": "-40 to 80°C (±0.5°C Accuracy)",
        "Sampling Rate": "0.5 Hz (every 2 seconds)",
        "Supply Voltage": "3.3V to 5.5V DC"
      },
      pinoutSummary: "4 pins (VCC, DATA, NC, GND). Built-in pull-up resistor module version."
    },
    {
      id: "prod-sensor-ultrasonic",
      sku: "BF-SENS-HCSR04P",
      name: "HC-SR04P Ultrasonic Distance Sensor (3.3V/5V)",
      category: "sensors",
      brand: "Buildify",
      operatingVoltage: "3.3V - 5V",
      packageType: "Module",
      pinCount: 4,
      price: 2.99,
      priceLKR: 925.0,
      originalPrice: 4.00,
      originalPriceLKR: 1240.0,
      stockQuantity: 90,
      lowStockThreshold: 15,
      rating: 4.9,
      reviewsCount: 520,
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
      description: "Dual-voltage compatible sonar sensor measuring 2cm to 400cm non-contact distance with 3mm accuracy.",
      badge: "Robotics Essential",
      inStock: true,
      datasheetUrl: "https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf",
      specs: {
        "Range": "2cm - 400cm",
        "Resolution": "0.3 cm",
        "Operating Voltage": "3V - 5.5V (Native ESP32 & Arduino support)",
        "Trigger Signal": "10uS TTL Pulse"
      },
      pinoutSummary: "4-pin standard interface: VCC, Trig, Echo, GND."
    },
    {
      id: "prod-mod-motor-l298n",
      sku: "BF-MOD-L298N",
      name: "L298N Dual H-Bridge High Power Motor Driver",
      category: "modules",
      brand: "Buildify",
      operatingVoltage: "5V - 35V",
      packageType: "Module",
      pinCount: 10,
      price: 4.50,
      priceLKR: 1395.0,
      originalPrice: 6.00,
      originalPriceLKR: 1860.0,
      stockQuantity: 40,
      lowStockThreshold: 8,
      rating: 4.7,
      reviewsCount: 310,
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
      description: "Heavy-duty dual H-bridge module capable of driving two DC motors (up to 2A per channel) or one 4-phase bipolar stepper motor.",
      badge: "High Power",
      inStock: true,
      datasheetUrl: "https://www.sparkfun.com/datasheets/Robotics/L298_H_Bridge.pdf",
      specs: {
        "Drive Voltage": "5V - 35V DC",
        "Peak Current": "2A per bridge",
        "Logic Voltage": "5V (Onboard 78M05 regulator)",
        "Heatsink": "Heavy extruded aluminum block included"
      },
      pinoutSummary: "Screw terminals for motor power and logic pins for ENA, IN1, IN2, IN3, IN4, ENB."
    },
    {
      id: "prod-robot-arm-4dof",
      sku: "BF-ROBOT-ARM4",
      name: "Buildify 4-DOF Acrylic Robotic Arm Kit + SG90",
      category: "robotics",
      brand: "TowerPro",
      operatingVoltage: "5V",
      packageType: "Chassis Kit",
      pinCount: 4,
      price: 29.99,
      priceLKR: 9295.0,
      originalPrice: 38.00,
      originalPriceLKR: 11780.0,
      stockQuantity: 15,
      lowStockThreshold: 4,
      rating: 4.9,
      reviewsCount: 142,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
      description: "Precision laser-cut mechanical arm with 4 micro servos and joystick control shield compatible with Arduino and ESP32.",
      badge: "Best Seller",
      inStock: true,
      datasheetUrl: "https://www.towerpro.com.tw/product/sg90-7/",
      specs: {
        "Degrees of Freedom": "4 (Base rotation, Shoulder, Elbow, Gripper)",
        "Servos": "4x TowerPro SG90 / MG90S included",
        "Material": "Reinforced 3mm glossy acrylic",
        "Max Reach": "180mm horizontal extension"
      },
      pinoutSummary: "Includes full screw hardware kit, gripper assembly, and servo extension leads."
    },
    {
      id: "prod-3d-pla-filament",
      sku: "BF-3D-PLA-1KG",
      name: "Premium 1.75mm PLA+ 3D Printing Filament (1KG Spool)",
      category: "3dprint",
      brand: "Creality",
      operatingVoltage: "N/A",
      packageType: "Tool",
      pinCount: 0,
      price: 18.50,
      priceLKR: 5735.0,
      originalPrice: 22.00,
      originalPriceLKR: 6820.0,
      stockQuantity: 30,
      lowStockThreshold: 5,
      rating: 4.9,
      reviewsCount: 88,
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      description: "High-toughness, non-clogging 1.75mm PLA+ filament for precision custom electronics enclosures and robotics brackets.",
      badge: "Maker Grade",
      inStock: true,
      datasheetUrl: "https://www.creality.com/products/creality-pla-plus-filament",
      specs: {
        "Diameter": "1.75mm (±0.02mm Tolerance)",
        "Print Temp": "190°C - 220°C",
        "Bed Temp": "50°C - 60°C",
        "Spool Weight": "1.0 KG Net"
      },
      pinoutSummary: "Vacuum-sealed with desiccant in protective UV box."
    },
    {
      id: "prod-tool-soldering-station",
      sku: "BF-TOOL-IRON-60W",
      name: "Buildify 60W Digital Temperature-Controlled Soldering Station",
      category: "tools",
      brand: "Buildify",
      operatingVoltage: "220V AC",
      packageType: "Tool",
      pinCount: 0,
      price: 24.99,
      priceLKR: 7745.0,
      originalPrice: 32.00,
      originalPriceLKR: 9920.0,
      stockQuantity: 20,
      lowStockThreshold: 4,
      rating: 4.8,
      reviewsCount: 112,
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
      description: "ESD-safe precision soldering iron with OLED temperature display (180°C - 480°C) and fast ceramic heating element.",
      badge: "Lab Essential",
      inStock: true,
      datasheetUrl: null,
      specs: {
        "Power": "60W Rapid Ceramic Core",
        "Temp Range": "180°C - 480°C (±2°C Stability)",
        "Display": "High-contrast digital readout",
        "Includes": "5x Interchangeable Soldering Tips + Stand + Solder Wire"
      },
      pinoutSummary: "Heavy-duty grounded Sri Lanka / UK 3-pin fused plug."
    },
    {
      id: "prod-passives-resistor-kit",
      sku: "BF-PASS-RES-600",
      name: "600-Piece 1/4W Metal Film Resistor Assortment Kit (30 Values)",
      category: "tools",
      brand: "Buildify",
      operatingVoltage: "N/A",
      packageType: "DIP",
      pinCount: 2,
      price: 6.50,
      priceLKR: 2015.0,
      originalPrice: 8.50,
      originalPriceLKR: 2635.0,
      stockQuantity: 65,
      lowStockThreshold: 10,
      rating: 4.9,
      reviewsCount: 230,
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80",
      description: "Comprehensive 1% tolerance resistor pack containing 20 pieces each of 30 standard E12 values from 10Ω to 1MΩ.",
      badge: "Stock Essential",
      inStock: true,
      datasheetUrl: null,
      specs: {
        "Tolerance": "±1% High Precision",
        "Power Rating": "1/4 Watt (0.25W)",
        "Values": "10Ω, 22Ω, 47Ω, 100Ω, 220Ω, 330Ω, 470Ω, 1k, 2.2k, 4.7k, 10k, 47k, 100k, 1MΩ",
        "Packaging": "Organized labeled color-code strips"
      },
      pinoutSummary: "Standard axial leaded 0.1-inch breadboard compatible."
    }
  ],

  // Live Order Tracking Mock Data
  mockTrackedOrders: {
    "BF-892011": {
      orderNumber: "BF-892011",
      customerName: "Kasun Perera",
      phone: "077 1234567",
      courier: "Pronto Courier Sri Lanka",
      waybillNumber: "PRN-LK-89021",
      status: "DISPATCHED",
      statusText: "On the way with courier (Domex / Pronto)",
      estimatedDelivery: "Tomorrow by 3:00 PM",
      items: [
        { name: "ESP32 DevKit V1 (30-Pin CH340)", qty: 2, priceLKR: 2165.0 },
        { name: "DHT22 High-Precision Sensor", qty: 1, priceLKR: 1488.0 }
      ],
      totalLKR: 5818.0,
      steps: [
        { stage: "Order Placed", date: "10 Sep 2026, 09:30 AM", done: true },
        { stage: "Payment Confirmed", date: "10 Sep 2026, 10:15 AM", done: true },
        { stage: "Component Picking & QA Testing", date: "10 Sep 2026, 02:40 PM", done: true },
        { stage: "Handed to Courier", date: "11 Sep 2026, 08:30 AM", done: true },
        { stage: "Delivered", date: "Pending Delivery", done: false }
      ]
    },
    "BF-741209": {
      orderNumber: "BF-741209",
      customerName: "Dr. Nimal Silva",
      phone: "071 9988776",
      courier: "Domex Express",
      waybillNumber: "DMX-776210",
      status: "QA_TESTING",
      statusText: "Undergoing Voltage & Sensor Bench Testing",
      estimatedDelivery: "In 2 Days",
      items: [
        { name: "Raspberry Pi 5 (4GB RAM)", qty: 1, priceLKR: 21695.0 },
        { name: "Premium 1.75mm PLA+ Filament", qty: 2, priceLKR: 5735.0 }
      ],
      totalLKR: 33165.0,
      steps: [
        { stage: "Order Placed", date: "10 Sep 2026, 04:20 PM", done: true },
        { stage: "Payment Confirmed", date: "10 Sep 2026, 04:25 PM", done: true },
        { stage: "Component Picking & QA Testing", date: "11 Sep 2026, 09:00 AM", done: true },
        { stage: "Handed to Courier", date: "Pending", done: false },
        { stage: "Delivered", date: "Pending Delivery", done: false }
      ]
    }
  },

  // Custom Service Estimators (PCB, 3D Print)
  customServices: {
    pcb: {
      layerOptions: [
        { layers: 1, basePriceLKR: 2500, leadDays: "3-4 Days" },
        { layers: 2, basePriceLKR: 3800, leadDays: "4-5 Days" },
        { layers: 4, basePriceLKR: 7500, leadDays: "6-8 Days" }
      ],
      colorOptions: ["Buildify Matte Black", "Standard Green", "Cyber Red", "Royal Blue", "Glossy White"],
      surfaceFinishOptions: ["HASL with Lead", "Lead-Free HASL (RoHS)", "ENIG (Immersion Gold)"]
    },
    threeDPrint: {
      materials: [
        { id: "pla_plus", name: "PLA+ High Toughness", pricePerGramLKR: 12.0 },
        { id: "petg", name: "PETG Water & Heat Resistant", pricePerGramLKR: 16.0 },
        { id: "abs", name: "ABS Industrial High Impact", pricePerGramLKR: 18.0 },
        { id: "resin", name: "SLA High-Detail 4K Resin", pricePerGramLKR: 28.0 }
      ],
      infillOptions: ["15% (Lightweight Prototype)", "30% (Standard Strength)", "50% (Heavy Duty Robot Part)", "100% (Solid Mechanical Link)"]
    }
  },

  projectsCategories: [
    { id: "all", name: "All Projects" },
    { id: "student", name: "Student Projects" },
    { id: "iot", name: "IoT" },
    { id: "robotics", name: "Robotics" },
    { id: "custom", name: "Custom Builds" }
  ],

  projects: [
    {
      id: "proj-smart-agri",
      title: "Smart Cloud Agriculture & Automated Irrigation Node",
      category: "iot",
      difficulty: "Intermediate",
      time: "4 - 6 Hours",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80",
      summary: "ESP32-driven precision farming station that measures soil capacitance, air temperature/humidity, and sunlight to dynamically trigger 12V solenoid valves via MQTT cloud dashboard.",
      tags: ["ESP32", "MQTT", "Solar Power", "Blynk/HomeAssistant"],
      bom: [
        { name: "ESP32 DevKit V1", qty: 1, cost: 6.99, costLKR: 2165.0 },
        { name: "Capacitive Soil Moisture Sensor V2", qty: 2, cost: 3.50, costLKR: 1085.0 },
        { name: "DHT22 Temp & Humidity Sensor", qty: 1, cost: 4.80, costLKR: 1488.0 },
        { name: "1-Channel 5V Relay Module", qty: 1, cost: 2.20, costLKR: 680.0 },
        { name: "12V Micro Submersible Solenoid/Pump", qty: 1, cost: 8.50, costLKR: 2635.0 }
      ],
      features: [
        "Real-time MQTT telemetry publishing to Cloud / Home Assistant",
        "Automated soil-threshold watering algorithm to prevent over-saturation",
        "Ultra-low-power Deep Sleep mode waking up every 15 minutes",
        "Local OLED status readout of soil hydration level and battery voltage"
      ],
      codeSnippet: `#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22
#define SOIL_PIN 34
#define RELAY_PIN 26

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Relay active LOW
  dht.begin();
}`
    },
    {
      id: "proj-face-access",
      title: "ESP32-CAM AI Face Recognition Smart Door Lock",
      category: "student",
      difficulty: "Advanced",
      time: "6 - 8 Hours",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
      summary: "Edge AI biometric security system with local convolutional neural network face enrollment, live WebRTC video feed, and high-torque electromagnetic solenoid lock release.",
      tags: ["ESP32-CAM", "Edge AI", "Computer Vision", "Security"],
      bom: [
        { name: "ESP32-CAM Module with OV2640", qty: 1, cost: 11.49, costLKR: 3560.0 },
        { name: "FTDI USB-to-UART Programmer", qty: 1, cost: 4.50, costLKR: 1395.0 },
        { name: "12V Electronic Door Solenoid Lock", qty: 1, cost: 9.90, costLKR: 3069.0 }
      ],
      features: [
        "On-chip neural face detection and enrollment in PSRAM",
        "Instant Telegram bot notification with captured intruder photo",
        "Local HTTP web server with live streaming & 1-click door unlock"
      ],
      codeSnippet: `#include "esp_camera.h"
#include <WiFi.h>

#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0`
    }
  ],

  learnCategories: [
    { id: "all", name: "All Resources" },
    { id: "tutorials", name: "Tutorials" },
    { id: "guides", name: "Guides" },
    { id: "ideas", name: "Project Ideas" }
  ],

  learnContent: [
    {
      id: "learn-esp32-quickstart",
      title: "ESP32 Wi-Fi & WebServer Masterclass: From Zero to Cloud Dashboard",
      category: "tutorials",
      level: "Beginner to Intermediate",
      readTime: "12 min read",
      author: "Marcus Chen",
      date: "Updated Recently",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      summary: "Learn how to configure the ESP32 in Station (STA) and Access Point (AP) mode, serve responsive HTML5/CSS dashboards directly from SPIFFS flash memory, and control GPIOs remotely without cloud delays.",
      hardware: ["ESP32 DevKit V1", "LED with 220Ω Resistor", "Micro USB Cable", "Solderless Breadboard"],
      pinoutGuide: [
        { pin: "GPIO 2", function: "Onboard Blue Status LED", note: "Can be toggled via web interface" },
        { pin: "GPIO 21 / 22", function: "I2C SDA / SCL", note: "Reserved for OLED display or sensors" },
        { pin: "3V3 / GND", function: "Power Rail", note: "Do not exceed 3.3V logic level on input pins" }
      ]
    },
    {
      id: "learn-sensor-interfacing",
      title: "Complete Guide: Interfacing I2C & SPI Sensors (OLED, MPU6050, BMP280)",
      category: "guides",
      level: "Beginner to Advanced",
      readTime: "15 min read",
      author: "Alex Vance",
      date: "Updated Recently",
      thumbnail: "https://images.unsplash.com/photo-1580983218765-f663bec07b37?auto=format&fit=crop&w=600&q=80",
      summary: "Understand bus arbitration, I2C address conflict resolution using multiplexers (TCA9548A), pull-up calculations, and fast hardware SPI interfacing with Arduino and ESP32.",
      hardware: ["MPU-6050 Accelerometer", "SSD1306 128x64 OLED", "BMP280 Barometric Pressure"],
      pinoutGuide: [
        { pin: "SDA (Data)", function: "Serial Data Line", note: "Requires 4.7kΩ pull-up resistor" },
        { pin: "SCL (Clock)", function: "Serial Clock Line", note: "Generated by master microcontroller" }
      ]
    }
  ],

  projectIdeas: [
    {
      title: "Smart Water Tank & Automatic Sump Controller",
      difficulty: "Beginner",
      domain: "IoT & Home Automation",
      components: ["ESP32 DevKit", "Non-Contact Liquid Level Sensor", "Relay Module"],
      description: "Monitors upper overhead tank level and sump status; automatically activates the pump and stops dry-running with cloud alerts."
    },
    {
      title: "AI Voice-Controlled Home Automation Assistant (Offline)",
      difficulty: "Intermediate",
      domain: "AI & Embedded",
      components: ["ESP32-S3", "INMP441 I2S Microphone", "MAX98357A DAC"],
      description: "Uses local WakeNet and Command Recognition neural models without internet connection or privacy concerns."
    }
  ]
};
