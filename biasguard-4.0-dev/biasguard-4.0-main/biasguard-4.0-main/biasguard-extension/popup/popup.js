/**
 * BiasGuard Popup Controller
 * Manages popup UI and settings
 */
class BiasGuardPopup {
  constructor() {
    this.settings = {
      enabled: true,
      realTimeChecking: true,
      showSuggestions: true,
      checkDelay: 1000,
      minTextLength: 10
    }
    this.stats = {
      textInputsMonitored: 0,
      biasChecksToday: 0,
      lastCheckDate: null
    }
    this.user = null
    this.init()
  }

  async init() {
    // Check authentication first
    await this.checkAuth()
    
    if (!this.user) {
      this.showAuthScreen()
      return
    }
    
    await this.loadSettings()
    await this.loadStats()
    this.setupUI()
    this.attachEventListeners()
    this.updateStatsDisplay()
    
    // Update stats periodically
    setInterval(() => this.updateStatsDisplay(), 2000)
  }

  async checkAuth() {
    try {
      const result = await chrome.storage.local.get(['biasguard_user', 'biasguard_guest_mode'])
      
      if (result.biasguard_user) {
        this.user = result.biasguard_user
        return true
      }
      
      if (result.biasguard_guest_mode) {
        // Guest mode enabled
        this.user = { name: 'Guest', email: 'guest@biasguard.com', guest: true }
        return true
      }
      
      return false
    } catch (error) {
      console.error('Auth check failed:', error)
      return false
    }
  }

  showAuthScreen() {
    document.getElementById('authScreen').style.display = 'block'
    document.getElementById('mainScreen').style.display = 'none'
    this.setupAuthListeners()
  }

  showMainScreen() {
    document.getElementById('authScreen').style.display = 'none'
    document.getElementById('mainScreen').style.display = 'block'
    
    if (this.user && !this.user.guest) {
      document.getElementById('userInfo').style.display = 'flex'
      document.getElementById('userName').textContent = this.user.name || this.user.email
    }
  }

  setupAuthListeners() {
    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'))
        e.target.classList.add('active')
        
        const tabName = e.target.dataset.tab
        document.getElementById('loginForm').style.display = tabName === 'login' ? 'block' : 'none'
        document.getElementById('signupForm').style.display = tabName === 'signup' ? 'block' : 'none'
        
        // Clear errors
        document.getElementById('loginError').classList.remove('show')
        document.getElementById('signupError').classList.remove('show')
      })
    })
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault()
      await this.handleLogin()
    })
    
    // Signup form
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault()
      await this.handleSignup()
    })
    
    // Skip auth (guest mode)
    document.getElementById('skipAuth').addEventListener('click', () => {
      this.enableGuestMode()
    })
  }

  async handleLogin() {
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value
    const errorEl = document.getElementById('loginError')
    
    try {
      // Simulate API call (replace with actual API)
      const user = await this.authenticateUser(email, password, 'login')
      
      if (user) {
        this.user = user
        await chrome.storage.local.set({ biasguard_user: user })
        this.showMainScreen()
        await this.loadSettings()
        await this.loadStats()
        this.setupUI()
        this.attachEventListeners()
      } else {
        errorEl.textContent = 'Invalid email or password'
        errorEl.classList.add('show')
      }
    } catch (error) {
      errorEl.textContent = error.message || 'Login failed. Please try again.'
      errorEl.classList.add('show')
    }
  }

  async handleSignup() {
    const name = document.getElementById('signupName').value
    const email = document.getElementById('signupEmail').value
    const password = document.getElementById('signupPassword').value
    const errorEl = document.getElementById('signupError')
    
    try {
      // Simulate API call (replace with actual API)
      const user = await this.authenticateUser(email, password, 'signup', name)
      
      if (user) {
        this.user = user
        await chrome.storage.local.set({ biasguard_user: user })
        this.showMainScreen()
        await this.loadSettings()
        await this.loadStats()
        this.setupUI()
        this.attachEventListeners()
      } else {
        errorEl.textContent = 'Signup failed. Email may already be in use.'
        errorEl.classList.add('show')
      }
    } catch (error) {
      errorEl.textContent = error.message || 'Signup failed. Please try again.'
      errorEl.classList.add('show')
    }
  }

  async authenticateUser(email, password, type, name = null) {
    // Simulate authentication (replace with actual API call)
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo: accept any email/password
        // In production, call your authentication API
        if (type === 'login') {
          resolve({
            email,
            name: email.split('@')[0],
            token: 'demo_token_' + Date.now()
          })
        } else {
          resolve({
            email,
            name: name || email.split('@')[0],
            token: 'demo_token_' + Date.now()
          })
        }
      }, 500)
    })
  }

  async enableGuestMode() {
    this.user = { name: 'Guest', email: 'guest@biasguard.com', guest: true }
    await chrome.storage.local.set({ 
      biasguard_guest_mode: true,
      biasguard_user: this.user
    })
    this.showMainScreen()
    await this.loadSettings()
    await this.loadStats()
    this.setupUI()
    this.attachEventListeners()
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['biasguard_settings'])
      if (result.biasguard_settings) {
        this.settings = { ...this.settings, ...result.biasguard_settings }
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  async loadStats() {
    try {
      const result = await chrome.storage.local.get(['biasguard_stats'])
      if (result.biasguard_stats) {
        this.stats = { ...this.stats, ...result.biasguard_stats }
        
        // Reset daily counter if new day
        const today = new Date().toDateString()
        if (this.stats.lastCheckDate !== today) {
          this.stats.biasChecksToday = 0
          this.stats.lastCheckDate = today
        }
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  setupUI() {
    // Set toggle states
    document.getElementById('enableToggle').checked = this.settings.enabled
    document.getElementById('realTimeCheck').checked = this.settings.realTimeChecking
    document.getElementById('showSuggestions').checked = this.settings.showSuggestions
    document.getElementById('checkDelay').value = this.settings.checkDelay || 1000

    // Update page indicator
    const indicator = document.getElementById('pageIndicator')
    if (this.settings.enabled) {
      indicator.querySelector('.dot').className = 'dot green'
      indicator.querySelector('.text').textContent = 'Monitoring'
    } else {
      indicator.querySelector('.dot').className = 'dot yellow'
      indicator.querySelector('.text').textContent = 'Disabled'
    }
  }

  attachEventListeners() {
    // Enable/Disable toggle
    document.getElementById('enableToggle').addEventListener('change', (e) => {
      this.updateSetting('enabled', e.target.checked)
      this.setupUI() // Refresh UI
    })

    // Real-time checking
    document.getElementById('realTimeCheck').addEventListener('change', (e) => {
      this.updateSetting('realTimeChecking', e.target.checked)
    })

    // Show suggestions
    document.getElementById('showSuggestions').addEventListener('change', (e) => {
      this.updateSetting('showSuggestions', e.target.checked)
    })

    // Check delay
    document.getElementById('checkDelay').addEventListener('change', (e) => {
      const value = parseInt(e.target.value, 10)
      if (value >= 500 && value <= 5000) {
        this.updateSetting('checkDelay', value)
      }
    })

    // Quick check button
    document.getElementById('quickCheck').addEventListener('click', () => {
      this.performQuickCheck()
    })

    // Open editor button - connects to deployed Vercel editor
    document.getElementById('openEditor').addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://biasguard.vercel.app/editor' })
    })

    // Advanced settings
    document.getElementById('openSettings').addEventListener('click', (e) => {
      e.preventDefault()
      chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') })
    })
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn')
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await chrome.storage.local.remove(['biasguard_user', 'biasguard_guest_mode'])
        this.user = null
        this.showAuthScreen()
      })
    }
  }

  async updateSetting(key, value) {
    this.settings[key] = value
    try {
      await chrome.storage.sync.set({ biasguard_settings: this.settings })
      
      // Notify content scripts to update
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UPDATE_SETTINGS',
          settings: this.settings
        }).catch(() => {
          // Tab might not have content script loaded
        })
      }
    } catch (error) {
      console.error('Failed to save setting:', error)
    }
  }

  async updateStatsDisplay() {
    try {
      const result = await chrome.storage.local.get(['biasguard_stats'])
      if (result.biasguard_stats) {
        this.stats = result.biasguard_stats
        
        // Update UI
        document.getElementById('textInputs').textContent = 
          this.stats.textInputsMonitored || 0
        document.getElementById('biasChecks').textContent = 
          this.stats.biasChecksToday || 0
      }
    } catch (error) {
      console.error('Failed to update stats:', error)
    }
  }

  async performQuickCheck() {
    const btn = document.getElementById('quickCheck')
    const originalHTML = btn.innerHTML
    
    try {
      // Get current tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tabs[0]) {
        throw new Error('No active tab')
      }

      // Send message to content script
      await chrome.tabs.sendMessage(tabs[0].id, { type: 'PERFORM_QUICK_CHECK' })
      
      // Update button
      btn.innerHTML = '<span class="icon">✓</span><span>Checked!</span>'
      btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      
      setTimeout(() => {
        btn.innerHTML = originalHTML
        btn.style.background = ''
      }, 2000)
    } catch (error) {
      console.error('Quick check failed:', error)
      btn.innerHTML = '<span class="icon">⚠️</span><span>Error</span>'
      btn.style.background = '#ef4444'
      
      setTimeout(() => {
        btn.innerHTML = originalHTML
        btn.style.background = ''
      }, 2000)
    }
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new BiasGuardPopup())
} else {
  new BiasGuardPopup()
}

