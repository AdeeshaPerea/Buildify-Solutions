// =========================================================================
// BUILDIFY SOLUTIONS - REAL-TIME USD <-> LKR FOREX EXCHANGE RATE SERVICE
// Fetches live real-time market rates from financial exchange rate APIs,
// caches locally for instant sub-millisecond loads, and updates dynamically.
// =========================================================================

const STORAGE_KEY = 'buildify_usd_lkr_forex';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache validity
const DEFAULT_FALLBACK_RATE = 330.0; // Current market benchmark fallback

const API_ENDPOINTS = [
  {
    url: 'https://open.er-api.com/v6/latest/USD',
    extract: (data) => data?.rates?.LKR
  },
  {
    url: 'https://api.exchangerate-api.com/v4/latest/USD',
    extract: (data) => data?.rates?.LKR
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    extract: (data) => data?.usd?.lkr
  }
];

class CurrencyService {
  constructor() {
    this.listeners = new Set();
    this.currentData = this.loadCachedRate();
    this.isFetching = false;

    // Immediately trigger background live rate check on startup
    if (typeof window !== 'undefined') {
      this.fetchLiveRate();
      // Periodically refresh live rate every 30 minutes
      setInterval(() => {
        this.fetchLiveRate();
      }, CACHE_TTL_MS);
    }
  }

  loadCachedRate() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed.rate === 'number' && parsed.rate > 100 && parsed.rate < 1000) {
            return {
              rate: parsed.rate,
              isLive: Boolean(parsed.isLive),
              timestamp: parsed.timestamp || Date.now(),
              lastUpdated: parsed.lastUpdated || 'Cached Rate'
            };
          }
        }
      }
    } catch (e) {
      console.warn('Could not read cached forex rate:', e);
    }

    return {
      rate: DEFAULT_FALLBACK_RATE,
      isLive: false,
      timestamp: 0,
      lastUpdated: 'Default Rate'
    };
  }

  saveCachedRate(rateData) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rateData));
      }
    } catch (e) {
      console.warn('Could not save forex rate to cache:', e);
    }
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentData);
      } catch (err) {
        console.error('Error in currencyService listener:', err);
      }
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    try {
      listener(this.currentData);
    } catch (e) {}
    return () => {
      this.listeners.delete(listener);
    };
  }

  getRate() {
    return { ...this.currentData };
  }

  getUsdRateNumber() {
    return this.currentData.rate || DEFAULT_FALLBACK_RATE;
  }

  /**
   * Fetches real-time USD/LKR rate with multi-endpoint fallback
   */
  async fetchLiveRate(force = false) {
    if (this.isFetching) return this.currentData;

    // Check if current cache is still fresh unless forced
    const now = Date.now();
    if (!force && this.currentData.isLive && (now - this.currentData.timestamp < CACHE_TTL_MS)) {
      return this.currentData;
    }

    this.isFetching = true;

    for (const endpoint of API_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(endpoint.url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) continue;
        const json = await res.json();
        const rawRate = endpoint.extract(json);

        if (typeof rawRate === 'number' && rawRate > 150 && rawRate < 900) {
          const formattedDate = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newRateData = {
            rate: parseFloat(rawRate.toFixed(2)),
            isLive: true,
            timestamp: now,
            lastUpdated: `Live Forex (${formattedDate})`
          };

          this.currentData = newRateData;
          this.saveCachedRate(newRateData);
          this.notify();
          console.log(`⚡ Real-time Forex: 1 USD = ${newRateData.rate} LKR (Source: ${endpoint.url})`);
          this.isFetching = false;
          return newRateData;
        }
      } catch (err) {
        // Try next endpoint fallback
        continue;
      }
    }

    this.isFetching = false;
    return this.currentData;
  }

  /**
   * Universal Price Formatter
   * @param {number} lkrAmount Price in Sri Lankan Rupees
   * @param {'LKR'|'USD'} currency Target currency
   * @param {boolean} roundWhole Whether to round USD to nearest whole dollar
   */
  formatPrice(lkrAmount, currency = 'LKR', roundWhole = false) {
    if (lkrAmount === undefined || lkrAmount === null || isNaN(lkrAmount)) return '';
    const num = parseFloat(lkrAmount);
    if (currency === 'USD') {
      const rate = this.getUsdRateNumber();
      const rawUsd = num / rate;
      if (roundWhole) {
        return `$${Math.round(rawUsd).toLocaleString()}`;
      }
      return `$${rawUsd.toFixed(2)}`;
    }
    return `Rs. ${Math.round(num).toLocaleString()}`;
  }
}

export const currencyService = new CurrencyService();
