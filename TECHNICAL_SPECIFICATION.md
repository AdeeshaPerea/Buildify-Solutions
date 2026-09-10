# Buildify Solutions - Technical Architecture & Engineering Specification

**Platform:** Buildify Solutions (Enterprise Hardware & Electronics E-Commerce Platform)  
**Architect:** Principal Full-Stack Software Architect & Senior E-Commerce Engineer  
**Target Reference Standard:** Tronic.lk / Mouser / JLCPCB hybrid model  

---

## 1. System Architecture Blueprint

```
+----------------------------------------------------------------------------------------+
|                                    CLIENT LAYER                                        |
|   +---------------------------------------+   +------------------------------------+   |
|   |         Next.js / React 18+           |   |       Tailwind CSS + Lucide Icons  |   |
|   |   (Faceted Filter Sidebar, Product    |   |  (Matte Carbon #0A0B0E / Orange    |   |
|   |    Cards, Live Order Tracking, PCB    |   |   #FF6B00 / Glassmorphic HUDs)     |   |
|   |    Estimator, Slicer Quote Tool)      |   |                                    |   |
|   +---------------------------------------+   +------------------------------------+   |
+-------------------------------------------+--------------------------------------------+
                                            |
                                  HTTPS / REST / WebSocket
                                            |
+-------------------------------------------v--------------------------------------------+
|                                  API GATEWAY & BACKEND                                 |
|   +--------------------------------------------------------------------------------+   |
|   |                       Node.js + Express (Modular Monolith)                     |   |
|   |  - Product Filtering Controller (Multi-param query parsing & aggregations)    |   |
|   |  - Real-Time Order Tracking & Courier Webhook Ingestion (Pronto / Domex)       |   |
|   |  - Custom Services Engine (Gerber/STL file parsing, PCB Layer pricing)         |   |
|   |  - Inventory Concurrency Guard (ACID transactions on stock decrements)         |   |
|   +--------------------------------------------------------------------------------+   |
+---------------------+-------------------------------+----------------------------------+
                      |                               |
        +-------------v------------+    +-------------v------------+
        |   Redis Cache & Sessions |    |   Algolia / ElasticSearch|
        | - Hot SKU Spec Caching   |    | - Fuzzy Part Number Match|
        | - Rate Limiting          |    | - Parametric Facet Index |
        +--------------------------+    +--------------------------+
                      |
        +-------------v--------------------------------------------+
        |                  PostgreSQL Database                     |
        | - Managed via Prisma ORM                                 |
        | - Relational integrity for SKUs, Categories, Orders,     |
        |   Custom PCB/3D Inquiries, and Inventory Audit Logs      |
        +----------------------------------------------------------+
```

---

## 2. Core Functional Modules & Implementation Status

| Feature Module | Implementation in Buildify Solutions | Status |
| :--- | :--- | :--- |
| **Multi-Parameter Faceted Search** | Filters by Operating Voltage (3.3V, 5V, 12V), Package (DIP, SMD, Module), Brand (Espressif, Arduino, etc.), Stock Status | **Completed & Live** |
| **Live Stock Indicators & Alerts** | Badges for "In Stock", "Low Stock (<5 units)", and "Backorder" | **Completed & Live** |
| **Dual Currency Engine** | Instant runtime toggle between Sri Lankan Rupee (`LKR / Rs.`) and US Dollar (`USD / $`) | **Completed & Live** |
| **Custom Services Portal** | Instant PCB layer/dimension/finish calculator, 3D printing weight/infill estimator, Gerber/STL drag-and-drop | **Completed & Live** |
| **5-Stage Order Tracking** | Tracking lookup with courier stepper (`Placed -> Confirmed -> QA Testing -> Dispatched -> Delivered`) | **Completed & Live** |
| **PDF Datasheet Viewer** | Embedded technical spec modal with pinout summary and downloadable documentation link | **Completed & Live** |
| **Wishlist & Cart Synchronization** | LocalStorage + state-driven drawer cart with real-time tax and invoice generator | **Completed & Live** |

---

## 3. Database Schema (Prisma ORM)
Located at [`prisma/schema.prisma`](file:///d:/Buildify%20Solutions/prisma/schema.prisma).

Key Models:
- `User`: Roles (`CUSTOMER`, `ADMIN`, `RD_STAFF`, `INVENTORY_MANAGER`)
- `Category`: Self-referential tree structure for multi-tier hardware categories
- `Product`: Stores SKUs, prices (USD & LKR), stock levels, technical parameters (`operatingVoltage`, `packageType`, `interfaces`)
- `ProductSpecification`: Key-value EAV specs for hardware components
- `Order` & `OrderItem`: Order lifecycle with courier tracking links
- `CustomServiceInquiry`: Dedicated table for PCB manufacturing and 3D printing requests with JSON configuration payloads

---

## 4. REST API Endpoint Specification

### `GET /api/products`
Retrieves products with support for parametric filtering, search query matching, and category scoping.

**Query Parameters:**
- `category`: Category slug (e.g. `microcontrollers`, `sensors`)
- `brand`: Brand name (e.g. `Espressif`, `Arduino`, `Waveshare`)
- `voltage`: Operating voltage (e.g. `3.3V`, `5V`, `12V`)
- `package`: Package type (e.g. `SMD`, `DIP`, `Module`)
- `search`: Keyword or SKU query (e.g. `ESP32-WROOM`, `Relay`)
- `inStock`: `true` / `false`
- `minPrice` & `maxPrice`: Numeric filter bounds
- `currency`: `LKR` or `USD`

**Response Example:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "prod-esp32-wroom",
      "sku": "BF-ESP32-W32D",
      "name": "ESP32 Wi-Fi + Bluetooth Dual-Core Dev Board",
      "brand": "Espressif",
      "priceLKR": 2150,
      "priceUSD": 6.95,
      "stockQuantity": 48,
      "operatingVoltage": "3.3V - 5V",
      "packageType": "Module",
      "datasheetUrl": "https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32d_esp32-wroom-32u_datasheet_en.pdf"
    }
  ]
}
```

---

## 5. Execution & Verification Guide

1. **Development Server:**
   ```bash
   npm run dev
   # Server active at http://localhost:3000/
   ```

2. **Production Build:**
   ```bash
   npm run build
   # Compiled cleanly with 0 errors via Vite
   ```

3. **Backend API Server:**
   ```bash
   npm run start:server
   # Express REST endpoints active at http://localhost:5000/api
   ```
