// Buildify Solutions - Admin Security & Authentication Service

const AUTH_STORAGE_KEY = 'buildify_admin_session';
const CREDS_STORAGE_KEY = 'buildify_admin_creds';

// Default initial admin credentials
const DEFAULT_CREDS = {
  username: 'admin',
  password: 'buildify2026!'
};

class AuthService {
  constructor() {
    this.session = this.loadSession();
  }

  getCredentials() {
    try {
      const stored = localStorage.getItem(CREDS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read admin creds:', e);
    }
    return DEFAULT_CREDS;
  }

  saveCredentials(creds) {
    localStorage.setItem(CREDS_STORAGE_KEY, JSON.stringify(creds));
  }

  loadSession() {
    try {
      const session = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        // Valid for 24 hours
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          return parsed;
        }
        this.logout();
      }
    } catch (e) {
      console.warn('Invalid session payload:', e);
    }
    return null;
  }

  login(username, password, remember = true) {
    const creds = this.getCredentials();
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    if (cleanUser === creds.username.toLowerCase() && cleanPass === creds.password) {
      const sessionData = {
        authenticated: true,
        user: creds.username,
        role: 'SYSTEM_ADMIN',
        timestamp: Date.now()
      };
      
      const jsonStr = JSON.stringify(sessionData);
      if (remember) {
        localStorage.setItem(AUTH_STORAGE_KEY, jsonStr);
      }
      sessionStorage.setItem(AUTH_STORAGE_KEY, jsonStr);
      this.session = sessionData;
      return { success: true, user: creds.username };
    }

    return { success: false, message: 'Invalid admin username or access security key.' };
  }

  logout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.session = null;
  }

  isAuthenticated() {
    return !!this.session?.authenticated;
  }

  getUser() {
    return this.session?.user || 'Admin';
  }

  changePassword(currentPassword, newPassword) {
    const creds = this.getCredentials();
    if (String(currentPassword).trim() !== creds.password) {
      return { success: false, message: 'Current password does not match.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const updated = {
      ...creds,
      password: String(newPassword).trim()
    };
    this.saveCredentials(updated);
    return { success: true, message: 'Security key updated successfully.' };
  }
}

export const authService = new AuthService();
export default authService;
