/**
 * BiasGuard Privacy & Cookie Management
 * Handles cookie consent, privacy sessions, and data management
 */

class PrivacyManager {
  constructor() {
    this.consentGiven = false
    this.cookiePreferences = {
      necessary: true,  // Always enabled
      analytics: false,
      functional: false,
      marketing: false
    }
    this.sessionId = null
    this.init()
  }

  async init() {
    await this.loadConsentStatus()
    await this.loadCookiePreferences()
    await this.initializeSession()
    
    // Wait for DOM to be ready before showing banner
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (!this.consentGiven) {
          setTimeout(() => this.showConsentBanner(), 1000) // Show after 1 second
        }
      })
    } else {
      if (!this.consentGiven) {
        setTimeout(() => this.showConsentBanner(), 1000) // Show after 1 second
      }
    }
  }

  async loadConsentStatus() {
    try {
      const result = await chrome.storage.local.get(['biasguard_consent'])
      this.consentGiven = result.biasguard_consent === true
    } catch (error) {
      console.error('Failed to load consent status:', error)
    }
  }

  async loadCookiePreferences() {
    try {
      const result = await chrome.storage.local.get(['biasguard_cookie_prefs'])
      if (result.biasguard_cookie_prefs) {
        this.cookiePreferences = { ...this.cookiePreferences, ...result.biasguard_cookie_prefs }
      }
    } catch (error) {
      console.error('Failed to load cookie preferences:', error)
    }
  }

  async initializeSession() {
    try {
      const result = await chrome.storage.local.get(['biasguard_session_id'])
      if (result.biasguard_session_id) {
        this.sessionId = result.biasguard_session_id
      } else {
        // Generate new session ID
        this.sessionId = `biasguard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        await chrome.storage.local.set({ biasguard_session_id: this.sessionId })
      }
      
      // Update session timestamp
      await chrome.storage.local.set({ 
        biasguard_session_last_active: Date.now() 
      })
    } catch (error) {
      console.error('Failed to initialize session:', error)
    }
  }

  showConsentBanner() {
    // Check if banner already exists
    if (document.getElementById('biasguard-consent-banner')) {
      return
    }

    const banner = document.createElement('div')
    banner.id = 'biasguard-consent-banner'
    banner.innerHTML = `
      <div class="biasguard-consent-content">
        <div class="biasguard-consent-header">
          <img src="${chrome.runtime.getURL('assets/icon48.png')}" alt="BiasGuard" class="biasguard-consent-icon">
          <div class="biasguard-consent-title-group">
            <h3 class="biasguard-consent-title">We use cookies to enhance your experience</h3>
          </div>
        </div>
        <div class="biasguard-consent-privacy">
          <a href="#" id="biasguard-privacy-link">Privacy</a> | 
          <a href="#" id="biasguard-cookie-settings">Settings</a>
        </div>
        <div class="biasguard-consent-actions">
          <button id="biasguard-consent-accept" class="biasguard-consent-btn biasguard-consent-btn-primary">
            Accept
          </button>
          <button id="biasguard-consent-necessary" class="biasguard-consent-btn biasguard-consent-btn-secondary">
            Necessary
          </button>
          <button id="biasguard-consent-customize" class="biasguard-consent-btn biasguard-consent-btn-link">
            Customize
          </button>
        </div>
      </div>
    `

    // Add styles
    this.injectConsentStyles()
    
    // Append to body
    document.body.appendChild(banner)

    // Attach event listeners
    this.attachConsentListeners(banner)
  }

  injectConsentStyles() {
    if (document.getElementById('biasguard-consent-styles')) {
      return
    }

    const style = document.createElement('style')
    style.id = 'biasguard-consent-styles'
    style.textContent = `
      #biasguard-consent-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        color: #ffffff;
        padding: 12px 16px;
        box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.3);
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        border-top: 2px solid #3b82f6;
        max-height: 200px;
        overflow-y: auto;
      }

      .biasguard-consent-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
      }

      .biasguard-consent-header {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }

      .biasguard-consent-icon {
        width: 32px;
        height: 32px;
        border-radius: 6px;
      }

      .biasguard-consent-title-group {
        flex: 1;
        min-width: 0;
      }

      .biasguard-consent-title {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        line-height: 1.3;
      }

      .biasguard-consent-subtitle {
        margin: 2px 0 0 0;
        font-size: 11px;
        color: #94a3b8;
        display: none;
      }

      .biasguard-consent-body {
        font-size: 12px;
        line-height: 1.4;
        color: #cbd5e1;
        display: none;
      }

      .biasguard-consent-body ul {
        margin: 4px 0;
        padding-left: 16px;
      }

      .biasguard-consent-body li {
        margin: 2px 0;
      }

      .biasguard-consent-privacy {
        margin-top: 0;
        font-size: 11px;
        flex-shrink: 0;
      }

      .biasguard-consent-privacy a {
        color: #60a5fa;
        text-decoration: none;
      }

      .biasguard-consent-privacy a:hover {
        text-decoration: underline;
      }

      .biasguard-consent-actions {
        display: flex;
        gap: 8px;
        flex-wrap: nowrap;
        flex-shrink: 0;
      }

      .biasguard-consent-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;
        white-space: nowrap;
      }

      .biasguard-consent-btn-primary {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: #ffffff;
      }

      .biasguard-consent-btn-primary:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }

      .biasguard-consent-btn-secondary {
        background: #334155;
        color: #ffffff;
      }

      .biasguard-consent-btn-secondary:hover {
        background: #475569;
      }

      .biasguard-consent-btn-link {
        background: transparent;
        color: #60a5fa;
        text-decoration: underline;
      }

      .biasguard-consent-btn-link:hover {
        color: #93c5fd;
      }

      @media (max-width: 768px) {
        #biasguard-consent-banner {
          padding: 10px 12px;
        }

        .biasguard-consent-content {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .biasguard-consent-header {
          width: 100%;
        }

        .biasguard-consent-actions {
          width: 100%;
          flex-direction: row;
          justify-content: flex-start;
        }

        .biasguard-consent-btn {
          flex: 1;
          min-width: 0;
          padding: 6px 10px;
          font-size: 11px;
        }
      }
    `
    document.head.appendChild(style)
  }

  attachConsentListeners(banner) {
    // Accept All
    banner.querySelector('#biasguard-consent-accept').addEventListener('click', () => {
      this.acceptAllCookies()
    })

    // Necessary Only
    banner.querySelector('#biasguard-consent-necessary').addEventListener('click', () => {
      this.acceptNecessaryOnly()
    })

    // Customize
    banner.querySelector('#biasguard-consent-customize').addEventListener('click', () => {
      this.showCookieSettings()
    })

    // Privacy Policy
    banner.querySelector('#biasguard-privacy-link').addEventListener('click', (e) => {
      e.preventDefault()
      this.showPrivacyPolicy()
    })

    // Cookie Settings
    banner.querySelector('#biasguard-cookie-settings').addEventListener('click', (e) => {
      e.preventDefault()
      this.showCookieSettings()
    })
  }

  async acceptAllCookies() {
    this.consentGiven = true
    this.cookiePreferences = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true
    }
    
    await chrome.storage.local.set({ 
      biasguard_consent: true,
      biasguard_cookie_prefs: this.cookiePreferences,
      biasguard_consent_date: Date.now()
    })
    
    this.hideBanner()
    this.initializeCookies()
    console.log('✅ BiasGuard: All cookies accepted')
  }

  async acceptNecessaryOnly() {
    this.consentGiven = true
    this.cookiePreferences = {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false
    }
    
    await chrome.storage.local.set({ 
      biasguard_consent: true,
      biasguard_cookie_prefs: this.cookiePreferences,
      biasguard_consent_date: Date.now()
    })
    
    this.hideBanner()
    this.initializeCookies()
    console.log('✅ BiasGuard: Necessary cookies only accepted')
  }

  showCookieSettings() {
    // Create cookie settings modal
    const modal = document.createElement('div')
    modal.id = 'biasguard-cookie-modal'
    modal.innerHTML = `
      <div class="biasguard-cookie-modal-content">
        <div class="biasguard-cookie-modal-header">
          <img src="${chrome.runtime.getURL('assets/icon48.png')}" alt="BiasGuard" width="32" height="32">
          <h3>Cookie Settings</h3>
          <button class="biasguard-cookie-modal-close">&times;</button>
        </div>
        <div class="biasguard-cookie-modal-body">
          <div class="biasguard-cookie-category">
            <div class="biasguard-cookie-category-header">
              <label>
                <input type="checkbox" id="cookie-necessary" checked disabled>
                <span>Necessary Cookies</span>
              </label>
            </div>
            <p>Required for BiasGuard to function. Cannot be disabled.</p>
          </div>
          <div class="biasguard-cookie-category">
            <div class="biasguard-cookie-category-header">
              <label>
                <input type="checkbox" id="cookie-analytics" ${this.cookiePreferences.analytics ? 'checked' : ''}>
                <span>Analytics Cookies</span>
              </label>
            </div>
            <p>Help us understand how you use BiasGuard to improve the service.</p>
          </div>
          <div class="biasguard-cookie-category">
            <div class="biasguard-cookie-category-header">
              <label>
                <input type="checkbox" id="cookie-functional" ${this.cookiePreferences.functional ? 'checked' : ''}>
                <span>Functional Cookies</span>
              </label>
            </div>
            <p>Remember your preferences and settings.</p>
          </div>
          <div class="biasguard-cookie-category">
            <div class="biasguard-cookie-category-header">
              <label>
                <input type="checkbox" id="cookie-marketing" ${this.cookiePreferences.marketing ? 'checked' : ''}>
                <span>Marketing Cookies</span>
              </label>
            </div>
            <p>Used to deliver relevant content and track campaign effectiveness.</p>
          </div>
        </div>
        <div class="biasguard-cookie-modal-footer">
          <button id="biasguard-save-cookie-settings" class="biasguard-consent-btn biasguard-consent-btn-primary">
            Save Preferences
          </button>
        </div>
      </div>
    `
    
    this.injectCookieModalStyles()
    document.body.appendChild(modal)

    // Attach listeners
    modal.querySelector('.biasguard-cookie-modal-close').addEventListener('click', () => {
      modal.remove()
    })

    modal.querySelector('#biasguard-save-cookie-settings').addEventListener('click', async () => {
      this.cookiePreferences.analytics = document.getElementById('cookie-analytics').checked
      this.cookiePreferences.functional = document.getElementById('cookie-functional').checked
      this.cookiePreferences.marketing = document.getElementById('cookie-marketing').checked
      
      await chrome.storage.local.set({ 
        biasguard_cookie_prefs: this.cookiePreferences,
        biasguard_consent: true
      })
      
      modal.remove()
      this.hideBanner()
      this.initializeCookies()
      console.log('✅ BiasGuard: Cookie preferences saved')
    })
  }

  injectCookieModalStyles() {
    if (document.getElementById('biasguard-cookie-modal-styles')) {
      return
    }

    const style = document.createElement('style')
    style.id = 'biasguard-cookie-modal-styles'
    style.textContent = `
      #biasguard-cookie-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2147483648;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .biasguard-cookie-modal-content {
        background: #1e293b;
        color: #ffffff;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      }

      .biasguard-cookie-modal-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px;
        border-bottom: 1px solid #334155;
      }

      .biasguard-cookie-modal-header h3 {
        margin: 0;
        flex: 1;
        font-size: 20px;
      }

      .biasguard-cookie-modal-close {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 28px;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .biasguard-cookie-modal-close:hover {
        color: #ffffff;
      }

      .biasguard-cookie-modal-body {
        padding: 20px;
      }

      .biasguard-cookie-category {
        margin-bottom: 20px;
        padding: 16px;
        background: #0f172a;
        border-radius: 8px;
      }

      .biasguard-cookie-category-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }

      .biasguard-cookie-category-header label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-weight: 500;
      }

      .biasguard-cookie-category-header input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .biasguard-cookie-category p {
        margin: 8px 0 0 0;
        font-size: 13px;
        color: #94a3b8;
      }

      .biasguard-cookie-modal-footer {
        padding: 20px;
        border-top: 1px solid #334155;
        display: flex;
        justify-content: flex-end;
      }
    `
    document.head.appendChild(style)
  }

  showPrivacyPolicy() {
    try {
      chrome.tabs.create({ 
        url: chrome.runtime.getURL('privacy.html')
      })
    } catch (error) {
      // Fallback to external URL if privacy.html not found
      chrome.tabs.create({ 
        url: 'https://biasguard.com/privacy' 
      })
    }
  }

  hideBanner() {
    const banner = document.getElementById('biasguard-consent-banner')
    if (banner) {
      banner.style.animation = 'slideDown 0.3s ease-out'
      setTimeout(() => {
        banner.remove()
      }, 300)
    }
  }

  async initializeCookies() {
    // Set cookies based on preferences
    if (this.cookiePreferences.necessary) {
      await this.setCookie('biasguard_session', this.sessionId, 30) // 30 days
    }
    
    if (this.cookiePreferences.functional) {
      await this.setCookie('biasguard_preferences', 'active', 365) // 1 year
    }
    
    if (this.cookiePreferences.analytics) {
      await this.setCookie('biasguard_analytics', 'enabled', 365)
    }
    
    if (this.cookiePreferences.marketing) {
      await this.setCookie('biasguard_marketing', 'enabled', 90) // 90 days
    }
  }

  async setCookie(name, value, days) {
    try {
      const domain = window.location.hostname
      const expires = new Date()
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
      
      // Use Chrome cookies API
      await chrome.cookies.set({
        url: window.location.origin,
        name: `biasguard_${name}`,
        value: value,
        expirationDate: expires.getTime() / 1000,
        domain: domain.startsWith('.') ? domain : `.${domain}`,
        path: '/',
        sameSite: 'lax'
      })
    } catch (error) {
      console.error('Failed to set cookie:', error)
      // Fallback to document.cookie
      document.cookie = `biasguard_${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
    }
  }

  async getCookie(name) {
    try {
      const cookie = await chrome.cookies.get({
        url: window.location.origin,
        name: `biasguard_${name}`
      })
      return cookie ? cookie.value : null
    } catch (error) {
      console.error('Failed to get cookie:', error)
      // Fallback to document.cookie
      const match = document.cookie.match(new RegExp(`(?:^|; )biasguard_${name}=([^;]*)`))
      return match ? match[1] : null
    }
  }

  async clearAllCookies() {
    try {
      const cookies = await chrome.cookies.getAll({ domain: window.location.hostname })
      for (const cookie of cookies) {
        if (cookie.name.startsWith('biasguard_')) {
          await chrome.cookies.remove({
            url: `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`,
            name: cookie.name
          })
        }
      }
    } catch (error) {
      console.error('Failed to clear cookies:', error)
    }
  }

  async updateSessionActivity() {
    await chrome.storage.local.set({ 
      biasguard_session_last_active: Date.now() 
    })
  }

  async clearSession() {
    this.sessionId = null
    await chrome.storage.local.remove(['biasguard_session_id', 'biasguard_session_last_active'])
    await this.clearAllCookies()
  }
}

// Export for use in content script
if (typeof window !== 'undefined') {
  window.BiasGuardPrivacyManager = PrivacyManager
}

