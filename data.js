// Buildify Solutions - Master Data Registry

const BUILDIFY_DATA = {
  company: {
    name: "Buildify Solutions",
    tagline: "Empowering Creators, Students & Engineers to Build the Future",
    description: "Your premier destination for IoT hardware, microcontrollers, smart robotics, DIY kits, and hands-on engineering tutorials.",
    email: "contact@buildifysolutions.com",
    phone: "+1 (800) 555-BUILD",
    location: "Tech Innovation Hub, Silicon Valley, CA",
    workingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
    stats: [
      { label: "Hardware Components", value: "2,500+" },
      { label: "Active Student Projects", value: "450+" },
      { label: "Makers Empowered", value: "35,000+" },
      { label: "Custom Hardware Builds", value: "1,200+" }
    ],
    story: "Buildify Solutions was founded by a passionate collective of embedded systems engineers and maker educators. We noticed students and inventors struggling to find reliable development boards, quality sensors, and clear step-by-step schematics under one roof. Today, Buildify bridges the gap between raw silicon and real-world innovation — providing hardware, pre-built educational kits, and industry-grade custom engineering solutions.",
    team: [
      {
        name: "Alex Vance",
        role: "Founder & Chief Hardware Architect",
        bio: "Former IoT Lead Engineer with 12+ years designing custom PCB & wireless telemetry systems.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        badge: "Embedded Specialist"
      },
      {
        name: "Dr. Elena Rostova",
        role: "Head of Robotics & AI Systems",
        bio: "PhD in Autonomous Robotics. Leading Buildify's robotics kits and kinematics project modules.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        badge: "Robotics & Kinematics"
      },
      {
        name: "Marcus Chen",
        role: "Lead IoT Solutions & Firmware",
        bio: "Specialist in ESP32 mesh networks, LoRaWAN protocols, and real-time cloud data pipelines.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        badge: "Firmware Engineer"
      },
      {
        name: "Sophia Martinez",
        role: "Head of Maker Education & Community",
        bio: "Passionate STEM mentor championing accessible electronics guides and collegiate hackathons.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        badge: "STEM Educator"
      }
    ]
  },

  storeCategories: [
    { id: "all", name: "All Products", icon: "bi-grid-fill" },
    { id: "esp32", name: "ESP32", icon: "bi-cpu" },
    { id: "arduino", name: "Arduino", icon: "bi-lightning-charge-fill" },
    { id: "sensors", name: "Sensors", icon: "bi-broadcast-pin" },
    { id: "modules", name: "Modules", icon: "bi-motherboard" },
    { id: "robotics", name: "Robotics", icon: "bi-robot" },
    { id: "kits", name: "Kits", icon: "bi-box-seam-fill" }
  ],

  products: [
    {
      id: "prod-esp32-devkit",
      name: "ESP32 DevKit V1 (30-Pin CH340)",
      category: "esp32",
      price: 6.99,
      originalPrice: 8.99,
      rating: 4.9,
      reviewsCount: 328,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      description: "Dual-core Xtensa 32-bit LX6 MCU with integrated 2.4 GHz Wi-Fi and Bluetooth BLE 4.2. Ideal for smart home and IoT edge nodes.",
      badge: "Best Seller",
      inStock: true,
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
      name: "ESP32-CAM AI-Thinker Module + OV2640",
      category: "esp32",
      price: 11.49,
      originalPrice: 14.99,
      rating: 4.8,
      reviewsCount: 215,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
      description: "Compact low-power camera module with OV2640 2MP sensor and onboard MicroSD card slot. Perfect for face recognition and video streaming.",
      badge: "AI Ready",
      inStock: true,
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
      name: "ESP32-S3-WROOM Dual Type-C DevBoard",
      category: "esp32",
      price: 14.99,
      originalPrice: 18.00,
      rating: 5.0,
      reviewsCount: 84,
      image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80",
      description: "Next-generation ESP32-S3 with hardware vector instructions for TinyML/AI acceleration and dual USB-C ports (USB OTG + UART).",
      badge: "New Release",
      inStock: true,
      specs: {
        "CPU": "Dual-Core LX7 240MHz with AI Vector Acceleration",
        "Memory": "16MB Flash + 8MB Octal PSRAM",
        "Connectivity": "Wi-Fi 4 + Bluetooth 5 (LE & Mesh)",
        "USB Interface": "Native High-Speed USB OTG + CH343 UART Type-C"
      },
      pinoutSummary: "44-pin high-density breakout with RGB WS2812 status LED."
    },
    {
      id: "prod-arduino-uno-r4",
      name: "Arduino Uno R4 WiFi (RA4M1 32-Bit)",
      category: "arduino",
      price: 27.50,
      originalPrice: 32.00,
      rating: 4.9,
      reviewsCount: 190,
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
      description: "The revolution of the legendary Uno with Renesas RA4M1 32-bit Arm Cortex-M4, ESP32-S3 WiFi/BLE co-processor, and a 12x8 LED Matrix.",
      badge: "Official Tech",
      inStock: true,
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
      name: "Arduino Nano V3.0 ATmega328P (Type-C)",
      category: "arduino",
      price: 5.49,
      originalPrice: 7.00,
      rating: 4.7,
      reviewsCount: 412,
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      description: "Miniature breadboard-friendly workhorse board with upgraded modern Type-C port and 8 analog inputs.",
      badge: "Popular",
      inStock: true,
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
      name: "DHT22 / AM2302 High-Precision Temp & Humidity Sensor",
      category: "sensors",
      price: 4.80,
      originalPrice: 6.50,
      rating: 4.8,
      reviewsCount: 147,
      image: "https://images.unsplash.com/photo-1580983218765-f663bec07b37?auto=format&fit=crop&w=600&q=80",
      description: "Digital calibrated capacitive sensor for measuring relative humidity (0-100% ±2%) and temperature (-40 to 80°C ±0.5°C).",
      badge: "High Accuracy",
      inStock: true,
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
      name: "HC-SR04P Ultrasonic Distance Sensor (3.3V/5V)",
      category: "sensors",
      price: 2.99,
      originalPrice: 4.00,
      rating: 4.9,
      reviewsCount: 520,
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
      description: "Dual-voltage compatible sonar sensor measuring 2cm to 400cm non-contact distance with 3mm accuracy.",
      badge: "Robotics Essential",
      inStock: true,
      specs: {
        "Range": "2cm - 400cm",
        "Resolution": "0.3 cm",
        "Operating Voltage": "3V - 5.5V (Native ESP32 & Arduino support)",
        "Trigger Signal": "10uS TTL Pulse"
      },
      pinoutSummary: "4-pin standard interface: VCC, Trig, Echo, GND."
    },
    {
      id: "prod-sensor-mpu6050",
      name: "MPU-6050 6-DOF Accelerometer & Gyroscope",
      category: "sensors",
      price: 3.89,
      originalPrice: 5.20,
      rating: 4.8,
      reviewsCount: 298,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
      description: "Integrated 3-axis accelerometer and 3-axis gyroscope with Digital Motion Processor (DMP) communicating over I2C.",
      badge: "DMP Built-in",
      inStock: true,
      specs: {
        "Gyro Range": "±250, 500, 1000, 2000 °/sec",
        "Accel Range": "±2g, ±4g, ±8g, ±16g",
        "Interface": "I2C (Address 0x68 / 0x69)",
        "Onboard Feature": "DMP computation for quaternions"
      },
      pinoutSummary: "VCC (3.3V-5V with onboard LDO), GND, SCL, SDA, XDA, XCL, AD0, INT."
    },
    {
      id: "prod-mod-motor-l298n",
      name: "L298N Dual H-Bridge High Power Motor Driver",
      category: "modules",
      price: 4.50,
      originalPrice: 6.00,
      rating: 4.7,
      reviewsCount: 310,
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
      description: "Heavy-duty dual H-bridge module capable of driving two DC motors (up to 2A per channel) or one 4-phase bipolar stepper motor.",
      badge: "High Power",
      inStock: true,
      specs: {
        "Drive Voltage": "5V - 35V DC",
        "Peak Current": "2A per bridge",
        "Logic Voltage": "5V (Onboard 78M05 regulator)",
        "Heatsink": "Heavy extruded aluminum block included"
      },
      pinoutSummary: "Screw terminals for motor power and logic pins for ENA, IN1, IN2, IN3, IN4, ENB."
    },
    {
      id: "prod-mod-relay-4ch",
      name: "4-Channel 5V Relay Module with Optocoupler",
      category: "modules",
      price: 5.90,
      originalPrice: 7.90,
      rating: 4.9,
      reviewsCount: 180,
      image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80",
      description: "Optically isolated 4-channel relay board capable of switching AC 250V/10A or DC 30V/10A home appliances safely.",
      badge: "Home Automation",
      inStock: true,
      specs: {
        "Trigger Current": "5mA per channel",
        "Isolation": "Optocoupler protection for MCU",
        "Max Load": "AC 250V/10A, DC 30V/10A",
        "Indication": "Individual LED status for each relay"
      },
      pinoutSummary: "Standard 0.1-inch input header with JD-VCC isolation jumper."
    },
    {
      id: "prod-robot-arm-4dof",
      name: "Buildify 4-DOF Acrylic Robotic Arm Kit + SG90",
      category: "robotics",
      price: 29.99,
      originalPrice: 38.00,
      rating: 4.9,
      reviewsCount: 142,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
      description: "Precision laser-cut mechanical arm with 4 micro servos and joystick control shield compatible with Arduino and ESP32.",
      badge: "Best Seller",
      inStock: true,
      specs: {
        "Degrees of Freedom": "4 (Base rotation, Shoulder, Elbow, Gripper)",
        "Servos": "4x TowerPro SG90 / MG90S included",
        "Material": "Reinforced 3mm glossy acrylic",
        "Max Reach": "180mm horizontal extension"
      },
      pinoutSummary: "Includes full screw hardware kit, gripper assembly, and servo extension leads."
    },
    {
      id: "prod-robot-smart-car",
      name: "Autonomous 4WD Smart Robot Chassis & Wheel Kit",
      category: "robotics",
      price: 24.50,
      originalPrice: 30.00,
      rating: 4.8,
      reviewsCount: 198,
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=600&q=80",
      description: "Complete 4WD dual-layer chassis with 4 DC TT gearmotors, speed encoder discs, rubber tires, and battery compartment.",
      badge: "Maker Favorite",
      inStock: true,
      specs: {
        "Motors": "4x TT Gearmotors (1:48 Reduction Ratio)",
        "Wheels": "65mm high-grip rubber tires",
        "Chassis": "Dual tier acrylic plates with mounting holes for sensors",
        "Speed Encoders": "4x slotted tachometer discs"
      },
      pinoutSummary: "Pre-drilled mounting for Arduino Uno, Mega, ESP32, Raspberry Pi, and L298N drivers."
    },
    {
      id: "prod-kit-iot-master",
      name: "Buildify Complete IoT & Smart Home Starter Kit",
      category: "kits",
      price: 49.99,
      originalPrice: 65.00,
      rating: 5.0,
      reviewsCount: 312,
      image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80",
      description: "Comprehensive all-in-one kit featuring ESP32 DevKit, 16 sensors & actuators, 0.96 OLED display, relays, jumper wires, breadboard, and 25 guided project tutorials.",
      badge: "Top Rated",
      inStock: true,
      specs: {
        "Core Controller": "ESP32 DevKit V1 30-Pin",
        "Display": "0.96 inch I2C OLED (SSD1306 128x64)",
        "Included Sensors": "DHT11, Ultrasonic, PIR Motion, Light LDR, Flame, Sound, Soil Moisture",
        "Actuators": "Servo SG90, 5V Relay, Buzzer, RGB LED, DC Motor Fan",
        "Documentation": "120-page full-color digital lab workbook + source code"
      },
      pinoutSummary: "Includes organized plastic parts box, MB-102 breadboard, 65 jumper wires, and USB cable."
    },
    {
      id: "prod-kit-student-stem",
      name: "Ultimate Electronics & Arduino Student Lab Kit",
      category: "kits",
      price: 39.99,
      originalPrice: 52.00,
      rating: 4.9,
      reviewsCount: 260,
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80",
      description: "Hands-on fundamental kit for schools and university engineering students. Covers Ohm's law, digital logic, analog ADC, and embedded C programming.",
      badge: "Curriculum Ready",
      inStock: true,
      specs: {
        "Core Board": "Arduino-Compatible ATmega328P Uno R3",
        "Passive Components": "150+ Resistors, Capacitors, Diodes, Transistors",
        "Displays": "16x2 I2C LCD Display + 7-Segment 4-Digit Display",
        "Input Devices": "Keypad 4x4, Potentiometers, Pushbuttons, Joystick"
      },
      pinoutSummary: "Includes ESD-safe storage case, multimeter test leads, and downloadable syllabus."
    }
  ],

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
        { name: "ESP32 DevKit V1", qty: 1, cost: 6.99 },
        { name: "Capacitive Soil Moisture Sensor V2", qty: 2, cost: 3.50 },
        { name: "DHT22 Temp & Humidity Sensor", qty: 1, cost: 4.80 },
        { name: "1-Channel 5V Relay Module", qty: 1, cost: 2.20 },
        { name: "12V Micro Submersible Solenoid/Pump", qty: 1, cost: 8.50 },
        { name: "0.96 inch I2C OLED Display", qty: 1, cost: 4.00 }
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
  // Connect WiFi & MQTT broker...
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
        { name: "ESP32-CAM Module with OV2640", qty: 1, cost: 11.49 },
        { name: "FTDI USB-to-UART Programmer", qty: 1, cost: 4.50 },
        { name: "12V Electronic Door Solenoid Lock", qty: 1, cost: 9.90 },
        { name: "TIP120 Darlington Transistor / Relay", qty: 1, cost: 2.00 },
        { name: "High-Brightness White LED / Buzzer", qty: 1, cost: 1.50 }
      ],
      features: [
        "On-chip neural face detection and enrollment in PSRAM",
        "Instant Telegram bot notification with captured intruder photo",
        "Local HTTP web server with live streaming & 1-click door unlock",
        "Anti-tamper vibration alert"
      ],
      codeSnippet: `#include "esp_camera.h"
#include <WiFi.h>

// Camera pin definition for AI-THINKER
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
// Initialize camera & HTTP streaming server...`
    },
    {
      id: "proj-lidar-rover",
      title: "Autonomous 4WD SLAM & Obstacle Navigation Rover",
      category: "robotics",
      difficulty: "Advanced",
      time: "8 - 12 Hours",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
      summary: "Self-navigating differential drive robot combining 360-degree LiDAR distance mapping, optical encoders, and PID motor speed regulation for 2D room cartography.",
      tags: ["Robotics", "LiDAR", "PID Control", "ROS Compatible"],
      bom: [
        { name: "Autonomous 4WD Smart Robot Chassis", qty: 1, cost: 24.50 },
        { name: "ESP32-S3 Dual-Core Controller", qty: 1, cost: 14.99 },
        { name: "L298N Dual Motor Driver", qty: 1, cost: 4.50 },
        { name: "RPLiDAR A1M8 360° Laser Scanner", qty: 1, cost: 89.00 },
        { name: "MPU-6050 6-DOF IMU Sensor", qty: 1, cost: 3.89 },
        { name: "3S 11.1V 2200mAh LiPo Battery Pack", qty: 1, cost: 18.00 }
      ],
      features: [
        "Real-time 2D occupancy grid generation using Hector SLAM",
        "Dual PID control loops for precise straight-line trajectory",
        "Emergency collision avoidance with ultrasonic & laser thresholding",
        "WebSockets telemetry with browser joystick remote override"
      ],
      codeSnippet: `#include <Wire.h>
#include <MPU6050_light.h>

MPU6050 mpu(Wire);
float currentAngle = 0.0;
float targetAngle = 90.0;

void loop() {
  mpu.update();
  currentAngle = mpu.getAngleZ();
  float error = targetAngle - currentAngle;
  // Apply PID motor adjustment...
}`
    },
    {
      id: "proj-gesture-arm",
      title: "Wearable Glove-Controlled 4-DOF Bionic Robotic Arm",
      category: "student",
      difficulty: "Intermediate",
      time: "5 - 7 Hours",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=600&q=80",
      summary: "Intuitive teleoperation setup where flex sensors and an IMU mounted on a wearable cyber glove map human hand articulation to a servo-powered mechanical robotic gripper.",
      tags: ["ESP-NOW", "Flex Sensors", "Servos", "Teleoperation"],
      bom: [
        { name: "Buildify 4-DOF Acrylic Robotic Arm Kit", qty: 1, cost: 29.99 },
        { name: "ESP32 DevKit V1 (Transmitter)", qty: 1, cost: 6.99 },
        { name: "ESP32 DevKit V1 (Receiver)", qty: 1, cost: 6.99 },
        { name: "2.2 inch Flex Bend Sensors", qty: 3, cost: 12.00 },
        { name: "PCA9685 16-Channel PWM Servo Driver", qty: 1, cost: 5.50 }
      ],
      features: [
        "Sub-5ms ultra-low-latency ESP-NOW peer-to-peer wireless telemetry",
        "Smooth multi-point Bezier interpolation to eliminate servo jitter",
        "Kinematic workspace boundary limiting to protect mechanical links",
        "Haptic vibration feedback upon object grasp detection"
      ],
      codeSnippet: `#include <esp_now.h>
#include <WiFi.h>

typedef struct struct_message {
  int shoulder;
  int elbow;
  int wrist;
  int gripper;
} struct_message;

struct_message myData;
// Broadcast telemetry over ESP-NOW without WiFi router...`
    },
    {
      id: "proj-factory-monitor",
      title: "Industrial Modbus/RS485 Energy & Vibration Predictive Node",
      category: "custom",
      difficulty: "Advanced",
      time: "Custom Build (2 Weeks)",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
      summary: "Bespoke industrial grade telemetry node built for manufacturing assembly lines. Features galvanic isolation, DIN rail mounting, and edge FFT frequency analysis for bearing fault detection.",
      tags: ["Custom PCB", "RS485 / Modbus", "Industrial IoT", "Edge FFT"],
      bom: [
        { name: "Custom Buildify Industrial PCB w/ ESP32-WROVER", qty: 1, cost: 45.00 },
        { name: "MAX13487 Auto-Direction RS485 Transceiver", qty: 1, cost: 4.20 },
        { name: "Piezoelectric Industrial Accelerometer", qty: 1, cost: 35.00 },
        { name: "DIN-Rail Enclosure with IP65 Gland Seals", qty: 1, cost: 14.50 },
        { name: "Wide Range 9V-36V Isolated Buck Converter", qty: 1, cost: 8.00 }
      ],
      features: [
        "High-voltage ESD and surge protection up to 15kV",
        "Real-time FFT vibration peak tracking in 10Hz - 5kHz band",
        "Native SCADA / PLC integration via Modbus RTU & MQTT JSON",
        "Over-The-Air (OTA) firmware deployment with encrypted dual partition"
      ],
      codeSnippet: `// Buildify Industrial Core Firmware v3.4
// Modbus RTU Register Mapping & FFT Vibration Pipeline
#include "buildify_industrial_hal.h"

void processVibrationSpectrum() {
  runComplexFFT(samples, NUM_SAMPLES);
  if (detectHarmonicAnomaly(BEARING_BPFO_FREQ)) {
    triggerModbusAlarm(ALARM_BEARING_DEGRADATION);
  }
}`
    },
    {
      id: "proj-drone-telemetry",
      title: "Long-Range LoRa Mesh Search & Rescue Beacon",
      category: "custom",
      difficulty: "Advanced",
      time: "Custom Build",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
      summary: "Off-grid telemetry mesh system capable of hopping emergency GPS coordinates, altitude, and battery metrics across 15+ kilometers without cellular or satellite coverage.",
      tags: ["LoRa 915MHz", "Meshtastic", "GPS Telemetry", "Off-Grid"],
      bom: [
        { name: "SX1262 Long Range LoRa Transceiver (868/915MHz)", qty: 2, cost: 16.00 },
        { name: "NEO-6M / NEO-M8N High Precision GPS", qty: 1, cost: 12.50 },
        { name: "ESP32 Dual-Core Controller", qty: 1, cost: 6.99 },
        { name: "High-Gain 5dBi Fiberglass Antenna", qty: 1, cost: 9.00 }
      ],
      features: [
        "Self-healing decentralized mesh protocol",
        "Instant pinpoint mapping on offline OpenStreetMap mobile app",
        "Emergency SOS beacon button with audible buzzer and strobe",
        "Solar rechargeable with MPPT charge management"
      ],
      codeSnippet: `#include <RadioLib.h>
SX1262 radio = new Module(NSS_PIN, DIO1_PIN, NRST_PIN, BUSY_PIN);

void setup() {
  int state = radio.begin(915.0, 500.0, 7, 5, 0x12, 22);
  if (state == RADIOLIB_ERR_NONE) {
    Serial.println("LoRa Mesh Beacon Online!");
  }
}`
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
      ],
      fullContent: `### Step 1: Setting up Arduino IDE with ESP32 Board Manager
To get started with ESP32 programming:
1. Open **Arduino IDE** -> Preferences.
2. In 'Additional Boards Manager URLs', paste:
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
3. Go to Tools -> Board -> Boards Manager, search for **esp32** by Espressif and click Install.
4. Select **DOIT ESP32 DEVKIT V1** and your COM port.

### Step 2: Full Source Code (Asynchronous Web Server)
\`\`\`cpp
#include <WiFi.h>
#include <ESPAsyncWebServer.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

AsyncWebServer server(80);
const int ledPin = 2;
String ledState = "OFF";

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML><html>
<head>
  <title>Buildify ESP32 Control Center</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: sans-serif; background: #0b1120; color: #fff; text-align: center; padding: 40px; }
    .btn { padding: 16px 32px; font-size: 18px; border-radius: 8px; border: none; cursor: pointer; }
    .btn-on { background: #00F0FF; color: #000; font-weight: bold; }
    .btn-off { background: #334155; color: #fff; }
  </style>
</head>
<body>
  <h2>Buildify ESP32 Relay Switch</h2>
  <p>Current Relay State: <strong>%STATE%</strong></p>
  <a href="/toggle"><button class="btn %BTNCLASS%">Toggle Output</button></a>
</body>
</html>)rawliteral";

String processor(const String& var){
  if(var == "STATE") return ledState;
  if(var == "BTNCLASS") return (ledState == "ON") ? "btn-on" : "btn-off";
  return String();
}

void setup(){
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/html", index_html, processor);
  });

  server.on("/toggle", HTTP_GET, [](AsyncWebServerRequest *request){
    if (ledState == "OFF") {
      ledState = "ON";
      digitalWrite(ledPin, HIGH);
    } else {
      ledState = "OFF";
      digitalWrite(ledPin, LOW);
    }
    request->redirect("/");
  });

  server.begin();
}

void loop(){
  // Non-blocking server handled in background!
}
\`\`\`
`
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
      hardware: ["MPU-6050 Accelerometer", "SSD1306 128x64 OLED", "BMP280 Barometric Pressure", "I2C Bus Scanner Code"],
      pinoutGuide: [
        { pin: "SDA (Data)", function: "Serial Data Line", note: "Requires 4.7kΩ pull-up resistor to VCC if board lacks one" },
        { pin: "SCL (Clock)", function: "Serial Clock Line", note: "Generated by the master microcontroller" },
        { pin: "AD0 / SDO", function: "Address Select Pin", note: "Tied to GND = 0x68, tied to VCC = 0x69 for MPU6050" }
      ],
      fullContent: `### Understanding the I2C Protocol
I2C (Inter-Integrated Circuit) uses only two bidirectional lines: **SDA (Serial Data)** and **SCL (Serial Clock)**. Multiple sensors can share the exact same two wires as long as each has a unique hexadecimal hardware address.

#### Finding Sensor I2C Address with I2C Scanner:
\`\`\`cpp
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(115200);
  Serial.println("Scanning I2C bus...");
  
  byte count = 0;
  for (byte i = 8; i < 127; i++) {
    Wire.beginTransmission(i);
    if (Wire.endTransmission() == 0) {
      Serial.print("Found I2C device at address 0x");
      if (i < 16) Serial.print("0");
      Serial.println(i, HEX);
      count++;
    }
  }
  Serial.printf("Done. Found %d active devices.\\n", count);
}

void loop() {}
\`\`\`
`
    },
    {
      id: "learn-robotics-kinematics",
      title: "Robotics 101: Inverse Kinematics & Servo PID Speed Profiling",
      category: "guides",
      level: "Intermediate",
      readTime: "10 min read",
      author: "Dr. Elena Rostova",
      date: "Popular Guide",
      thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
      summary: "Step-by-step mathematical guide to translating (X, Y, Z) Cartesian coordinates into rotational servo angles (theta 1, theta 2, theta 3) for robotic arms.",
      hardware: ["Buildify 4-DOF Robotic Arm", "PCA9685 16-Ch PWM Board", "5V 4A Dedicated Power Supply"],
      pinoutGuide: [
        { pin: "PWM Channels 0-3", function: "Servo Signal Pins", note: "Connected directly to PCA9685" },
        { pin: "V+ Terminal", function: "External 5V-6V Power", note: "DO NOT power servos directly from MCU 5V pin!" }
      ],
      fullContent: `### Why Direct Delay Moves Damage Servos
When you issue a direct servo command from 0° to 180°, the motor accelerates at maximum current, causing mechanical bounce, high gear wear, and electrical voltage brownouts.

### Smooth S-Curve Trajectory Implementation:
\`\`\`cpp
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

void smoothMoveServo(int channel, int startAngle, int targetAngle, int durationMs) {
  int steps = 50;
  int stepDelay = durationMs / steps;
  
  for (int i = 0; i <= steps; i++) {
    // Cosine smoothing profile
    float t = (float)i / steps;
    float factor = 0.5 * (1.0 - cos(t * PI));
    int currentAngle = startAngle + (targetAngle - startAngle) * factor;
    
    int pulse = map(currentAngle, 0, 180, 150, 600);
    pwm.setPWM(channel, 0, pulse);
    delay(stepDelay);
  }
}
\`\`\`
`
    }
  ],

  projectIdeas: [
    {
      title: "Smart Water Tank & Automatic Sump Controller",
      difficulty: "Beginner",
      domain: "IoT & Home Automation",
      components: ["ESP32 DevKit", "Non-Contact Liquid Level Sensor", "Relay Module", "Buzzer"],
      description: "Monitors upper overhead tank level and sump status; automatically activates the pump and stops dry-running with cloud alerts."
    },
    {
      title: "AI Voice-Controlled Home Automation Assistant (Offline)",
      difficulty: "Intermediate",
      domain: "AI & Embedded",
      components: ["ESP32-S3", "INMP441 I2S Microphone", "MAX98357A I2S DAC Audio Amp", "Relays"],
      description: "Uses local WakeNet and Command Recognition neural models without internet connection or privacy concerns."
    },
    {
      title: "Solar MPPT Maximum Power Point Battery Charger Tracker",
      difficulty: "Advanced",
      domain: "Clean Energy & Hardware",
      components: ["Arduino Nano", "Synchronous Buck Converter Mosfets", "INA219 Current Sensor", "OLED Display"],
      description: "Perturb & Observe algorithm to harvest maximum wattage from solar PV panels for 12V LiFePO4 battery banks."
    },
    {
      title: "Gesture Controlled Virtual Computer Mouse & Presentation Clicker",
      difficulty: "Beginner",
      domain: "Wearables & HCI",
      components: ["Arduino Pro Micro (ATmega32U4)", "MPU-6050 Gyro", "Tactile Pushbuttons"],
      description: "Emulates native USB HID mouse and keyboard. Move cursor through intuitive wrist tilt in 3D space."
    },
    {
      title: "LoRa Disaster Emergency Mesh Messenger",
      difficulty: "Intermediate",
      domain: "Off-Grid Telecommunications",
      components: ["ESP32", "SX1262 915MHz LoRa", "0.96 OLED", "QWERTY BLE Keyboard"],
      description: "End-to-end encrypted messaging over long-distance radio frequency when cellular mobile towers go offline."
    },
    {
      title: "Self-Balancing Two-Wheeled Inverted Pendulum Robot",
      difficulty: "Advanced",
      domain: "Robotics & Control Systems",
      components: ["ESP32 / Arduino Uno", "MPU6050", "NEMA17 Stepper Motors", "A4988 Drivers"],
      description: "High-frequency PID control loop maintaining vertical stability on two wheels while resisting push disturbances."
    }
  ]
};
