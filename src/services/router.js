// ==========================================================================
// BUILDIFY SOLUTIONS - URL ROUTING & BROWSER HISTORY ENGINE
// Enables clean, SEO-friendly multi-page URLs without full page reloads:
// - Home: /
// - Store: /store
// - Store Sub-tabs: /about, /contracts, /delivery, /policies, /faq
// - Web Development: /web
// - Admin: /admin
// ==========================================================================

export const BASE_URL = 'https://www.buildifysolution.com';

export const ROUTE_METADATA = {
  gateway: {
    title: 'Buildify Solutions | Web Development, Software & Smart IoT',
    description: 'Buildify Solutions delivers full-stack web development, custom software, ERP systems, and smart IoT & robotics solutions. WE BUILD. YOU GROW.',
    canonical: `${BASE_URL}/`
  },
  web: {
    title: 'Web Development & Custom Software Studio | Buildify Solutions',
    description: 'High-performance full-stack web platforms, business ERPs, e-commerce stores, custom software, and real-time IoT cloud telemetry dashboards by Buildify Solutions.',
    canonical: `${BASE_URL}/web`
  },
  iot_store: {
    title: 'Smart IoT, Robotics & Hardware Store | Buildify Solutions',
    description: 'Shop genuine ESP32, Arduino, Raspberry Pi, robotics kits, sensors, electronic components, and maker gear from Buildify Solutions.',
    canonical: `${BASE_URL}/store`
  },
  iot_about: {
    title: 'About Buildify Solutions | Engineering & IoT Hardware Sri Lanka',
    description: 'Learn about Buildify Solutions, our engineering mission, quality electronics hardware, and full-stack software development team.',
    canonical: `${BASE_URL}/about`
  },
  iot_contracts: {
    title: 'Bulk Stock & Custom Hardware Contracts | Buildify Solutions',
    description: 'Custom IoT engineering contracts, bulk component procurement, turnkey hardware prototyping, and custom PCB fabrication from Buildify Solutions.',
    canonical: `${BASE_URL}/contracts`
  },
  iot_delivery: {
    title: 'Islandwide Delivery Rates & Tracking | Buildify Solutions',
    description: 'Fast 24-hour islandwide delivery across all 25 districts in Sri Lanka. Calculate courier fees and track your hardware package.',
    canonical: `${BASE_URL}/delivery`
  },
  iot_policies: {
    title: 'Store Policies, Warranty & Returns | Buildify Solutions',
    description: 'Read Buildify Solutions store policies, warranty terms, return guidelines, and technical support standards.',
    canonical: `${BASE_URL}/policies`
  },
  iot_faq: {
    title: 'Frequently Asked Questions (FAQ) | Buildify Solutions',
    description: 'Find answers to common questions about hardware ordering, bank payments, islandwide courier delivery, and custom engineering projects.',
    canonical: `${BASE_URL}/faq`
  },
  admin: {
    title: 'Operations Admin Terminal | Buildify Solutions',
    description: 'Secure administration portal for Buildify Solutions store operations, inventory management, and client inquiries.',
    canonical: `${BASE_URL}/admin`
  }
};

/**
 * Parses current location into { portal, tab, canonicalPath }
 */
export function parseRoute(pathname = '/', hash = '', search = '') {
  const rawPath = (pathname || '/').toLowerCase().trim();
  // Strip trailing slashes, ensure leading slash
  let cleanPath = rawPath.replace(/\/+$/, '') || '/';
  const cleanHash = (hash || '').toLowerCase();
  const cleanSearch = (search || '').toLowerCase();

  // 1. Admin Portal checks
  if (
    cleanPath === '/admin' || 
    cleanPath.startsWith('/admin/') || 
    cleanHash === '#admin' || 
    cleanHash === '#/admin' || 
    cleanSearch.includes('portal=admin') || 
    cleanSearch.includes('admin=true')
  ) {
    return {
      portal: 'admin',
      tab: null,
      cleanPath: '/admin',
      metaKey: 'admin'
    };
  }

  // 2. Web Development Studio
  if (
    cleanPath === '/web' || 
    cleanPath === '/web-development' || 
    cleanPath === '/software' || 
    cleanPath === '/services' ||
    cleanSearch.includes('portal=web')
  ) {
    return {
      portal: 'web',
      tab: null,
      cleanPath: '/web',
      metaKey: 'web'
    };
  }

  // 3. Store Sub-tabs & Direct Navigation
  if (cleanPath === '/about' || cleanPath === '/store/about') {
    return {
      portal: 'iot',
      tab: 'about',
      cleanPath: '/about',
      metaKey: 'iot_about'
    };
  }

  if (cleanPath === '/contracts' || cleanPath === '/store/contracts' || cleanPath === '/bulk') {
    return {
      portal: 'iot',
      tab: 'contracts',
      cleanPath: '/contracts',
      metaKey: 'iot_contracts'
    };
  }

  if (cleanPath === '/delivery' || cleanPath === '/store/delivery' || cleanPath === '/shipping') {
    return {
      portal: 'iot',
      tab: 'delivery',
      cleanPath: '/delivery',
      metaKey: 'iot_delivery'
    };
  }

  if (cleanPath === '/policies' || cleanPath === '/store/policies' || cleanPath === '/warranty' || cleanPath === '/terms') {
    return {
      portal: 'iot',
      tab: 'policies',
      cleanPath: '/policies',
      metaKey: 'iot_policies'
    };
  }

  if (cleanPath === '/faq' || cleanPath === '/store/faq' || cleanPath === '/help' || cleanPath === '/support') {
    return {
      portal: 'iot',
      tab: 'faq',
      cleanPath: '/faq',
      metaKey: 'iot_faq'
    };
  }

  // 4. Main Store / IoT Hardware Portal
  if (
    cleanPath === '/store' || 
    cleanPath.startsWith('/store/') ||
    cleanPath === '/iot' || 
    cleanPath === '/shop' || 
    cleanPath === '/hardware' ||
    cleanSearch.includes('portal=iot')
  ) {
    return {
      portal: 'iot',
      tab: 'store',
      cleanPath: '/store',
      metaKey: 'iot_store'
    };
  }

  // 5. Default Home Gateway
  return {
    portal: 'gateway',
    tab: null,
    cleanPath: '/',
    metaKey: 'gateway'
  };
}

/**
 * Returns canonical clean URL path for given portal and tab
 */
export function getPathForPortal(portal, tab = 'store') {
  if (portal === 'web') return '/web';
  if (portal === 'admin') return '/admin';
  if (portal === 'gateway') return '/';
  if (portal === 'iot') {
    switch (tab) {
      case 'about': return '/about';
      case 'contracts': return '/contracts';
      case 'delivery': return '/delivery';
      case 'policies': return '/policies';
      case 'faq': return '/faq';
      case 'store':
      default:
        return '/store';
    }
  }
  return '/';
}

/**
 * Updates head metadata (title, canonical link, open graph, twitter)
 */
export function applyRouteMetadata(metaKey) {
  if (typeof document === 'undefined') return;
  const meta = ROUTE_METADATA[metaKey] || ROUTE_METADATA.gateway;

  document.title = meta.title;

  const setAttr = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };

  setAttr('meta[name="description"]', 'content', meta.description);
  setAttr('meta[property="og:title"]', 'content', meta.title);
  setAttr('meta[property="og:description"]', 'content', meta.description);
  setAttr('meta[property="og:url"]', 'content', meta.canonical);
  setAttr('meta[name="twitter:title"]', 'content', meta.title);
  setAttr('meta[name="twitter:description"]', 'content', meta.description);
  setAttr('meta[name="twitter:url"]', 'content', meta.canonical);
  setAttr('link[rel="canonical"]', 'href', meta.canonical);
}
