class BiasGuardExtension {
  constructor() {
    this.activeElements = new Map()
    this.settings = { 
      enabled: true, 
      realTimeChecking: true, 
      checkDelay: 800,
      showSuggestions: true 
    }
    this.debugMode = true
    this.debugStats = {
      status: 'Initializing...',
      checks: 0,
      lastScore: 0
    }
    // Store instance globally for access in result panel
    window.biasGuardExtension = this
    this.init()
  }

  async init() {
    console.log('🛡️ BiasGuard Extension Loading...')
    
    // Initialize Privacy Manager (shows consent banner if needed)
    if (typeof BiasGuardPrivacyManager !== 'undefined') {
      this.privacyManager = new BiasGuardPrivacyManager()
      console.log('🔒 Privacy Manager initialized')
    }
    
    await this.loadSettings()
    
    if (!this.settings.enabled) {
      console.log('BiasGuard disabled by user')
      return
    }
    
    // Add debug info
    if (this.debugMode) {
      console.log('🔧 Debug mode enabled')
      this.addDebugPanel()
    }
    
    this.scanForTextInputs()
    this.startObserving()
    
    console.log('✅ BiasGuard Extension Active')
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['biasguard_settings'])
      if (result.biasguard_settings) {
        this.settings = { ...this.settings, ...result.biasguard_settings }
      }
      console.log('⚙️ Settings loaded:', this.settings)
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  scanForTextInputs() {
    const selectors = [
      'textarea',
      'input[type="text"]',
      'input[type="email"]',
      '[contenteditable="true"]',
      '[contenteditable]',
      
      // Gmail
      'div[aria-label*="Message Body"]',
      'div[aria-label*="Subject"]',
      '.Am.Al.editable',
      
      // Twitter/X
      'div[data-testid="tweetTextarea_0"]',
      'div[data-testid="tweetTextarea_1"]',
      '.DraftEditor-editorContainer',
      
      // Facebook
      'div[data-testid="status-attachment-mentions-input"]',
      'div[contenteditable][data-testid]',
      
      // LinkedIn
      'div[data-testid="ql-editor"]',
      '.ql-editor',
      
      // Slack
      'div[data-qa="message_input"]',
      '.ql-editor[data-qa="texty_composer"]',
      
      // Discord
      'div[data-slate-editor="true"]',
      
      // General
      '.wp-editor-area',
      '.mce-content-body'
    ]

    let foundCount = 0
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => {
        if (this.attachBiasChecker(element)) {
          foundCount++
        }
      })
    })

    console.log(`📝 Found ${foundCount} text inputs to monitor`)
    this.debugStats.status = `Monitoring ${foundCount} text inputs`
  }

  startObserving() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (this.isTextInput(node)) {
              this.attachBiasChecker(node)
            }
            
            const textInputs = node.querySelectorAll?.(
              'textarea, input[type="text"], [contenteditable], div[aria-label*="Message"]'
            )
            textInputs?.forEach(input => this.attachBiasChecker(input))
          }
        })
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })
  }

  isTextInput(element) {
    if (!element || !element.tagName) return false
    
    const tagName = element.tagName.toLowerCase()
    const type = element.type?.toLowerCase()
    const contentEditable = element.contentEditable === 'true'
    
    return (
      tagName === 'textarea' ||
      (tagName === 'input' && ['text', 'email'].includes(type)) ||
      contentEditable
    )
  }

  attachBiasChecker(element) {
    if (!element || this.activeElements.has(element)) {
      return false
    }

    console.log('🔍 Attaching bias checker to:', element.tagName, element.className)
    
    const checker = new BiasChecker(element, this.settings, this.debugMode)
    this.activeElements.set(element, checker)
    
    return true
  }

  addDebugPanel() {
    // Debug panel is now integrated into the analysis result panel
    // This function is kept for compatibility but debug info will be shown in result panel
    this.debugStats = {
      status: 'Initializing...',
      checks: 0,
      lastScore: 0
    }
  }

  updateDebugPanel(message) {
    // Update debug stats (will be shown in result panel)
    if (this.debugStats) {
      this.debugStats.status = message
    }
  }
}

class BiasChecker {
  constructor(element, settings, debugMode = false) {
    this.element = element
    this.settings = settings
    this.debugMode = debugMode
    this.debounceTimer = null
    this.indicator = null
    this.tooltip = null
    this.currentAnalysis = null
    this.checkCount = 0
    
    this.init()
  }

  init() {
    this.createIndicator()
    this.attachEventListeners()
    
    if (this.debugMode) {
      console.log('🔧 BiasChecker initialized for:', this.element.tagName)
    }
  }

  createIndicator() {
    this.indicator = document.createElement('div')
    this.indicator.className = 'biasguard-indicator'
    this.indicator.style.cssText = `
      position: absolute;
      width: 16px;
      height: 16px;
      background: #10b981;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 999999;
      cursor: pointer;
      transition: all 0.2s ease;
      display: none;
      pointer-events: auto;
    `

    this.tooltip = document.createElement('div')
    this.tooltip.className = 'biasguard-tooltip'
    this.tooltip.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      max-width: 320px;
      font-size: 14px;
      line-height: 1.4;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      z-index: 1000000;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s ease;
      pointer-events: none;
      display: none;
    `

    document.body.appendChild(this.indicator)
    document.body.appendChild(this.tooltip)

    // Event listeners
    this.indicator.addEventListener('mouseenter', () => this.showTooltip())
    this.indicator.addEventListener('mouseleave', () => this.hideTooltip())
    
    // Click handler to apply suggestion directly
    this.indicator.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      console.log('🔴 Red dot clicked!')
      console.log('📊 Current analysis:', this.currentAnalysis)
      console.log('💡 Has suggestion:', !!(this.currentAnalysis && this.currentAnalysis.suggested_rewrite))
      
      if (this.currentAnalysis && this.currentAnalysis.suggested_rewrite) {
        console.log('✅ Applying suggestion:', this.currentAnalysis.suggested_rewrite)
        this.applySuggestion(this.currentAnalysis.suggested_rewrite)
        
        // Show brief feedback
        const originalColor = this.indicator.style.background
        this.indicator.style.background = '#10b981' // Green for success
        this.indicator.style.transform = 'scale(1.2)'
        setTimeout(() => {
          this.indicator.style.background = originalColor
          this.indicator.style.transform = 'scale(1)'
        }, 300)
      } else {
        console.log('⚠️ No suggestion available to apply')
        console.log('   Analysis exists:', !!this.currentAnalysis)
        console.log('   Has suggested_rewrite:', !!(this.currentAnalysis && this.currentAnalysis.suggested_rewrite))
        // Show tooltip if no suggestion
        this.showTooltip()
      }
    })

    // Position on page load and resize
    this.updateIndicatorPosition()
    window.addEventListener('scroll', () => this.updateIndicatorPosition())
    window.addEventListener('resize', () => this.updateIndicatorPosition())
  }

  updateIndicatorPosition() {
    if (!this.element) return
    
    const rect = this.element.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) return // Element not visible
    
    this.indicator.style.position = 'fixed'
    this.indicator.style.top = `${rect.top - 8}px`
    this.indicator.style.left = `${rect.right - 8}px`
  }

  attachEventListeners() {
    this.element.addEventListener('input', () => this.handleTextChange())
    this.element.addEventListener('keyup', () => this.handleTextChange())
    this.element.addEventListener('paste', () => {
      setTimeout(() => this.handleTextChange(), 100)
    })
    this.element.addEventListener('focus', () => this.showIndicator())
    this.element.addEventListener('blur', () => {
      setTimeout(() => this.hideIndicator(), 200)
    })
  }

  handleTextChange() {
    if (!this.settings.realTimeChecking) return

    clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      this.checkForBias()
    }, this.settings.checkDelay || 800)
  }

  async checkForBias() {
    const text = this.getElementText()
    this.checkCount++
    
    if (this.debugMode) {
      console.log(`🔍 Check #${this.checkCount} - Text (${text?.length || 0} chars):`, text?.substring(0, 50) + '...')
    }
    
    if (!text || text.length < 5) {
      this.updateIndicator(0, 'none', null)
      return
    }

    try {
      this.setLoading(true)
      
      const analysis = await BiasAPI.analyze(text)
      this.currentAnalysis = analysis
      
      if (this.debugMode) {
        console.log(`✅ Analysis result for check #${this.checkCount}:`, analysis)
        this.updateDebugStats()
      }
      
      this.updateIndicator(analysis.bias_score, analysis.bias_level, analysis)
      this.setLoading(false)
      
    } catch (error) {
      console.error('❌ Bias checking error:', error)
      this.setError('Error checking for bias')
      this.setLoading(false)
    }
  }

  getElementText() {
    if (!this.element) return ''
    
    if (this.element.tagName === 'TEXTAREA' || this.element.tagName === 'INPUT') {
      return this.element.value || ''
    }
    
    return this.element.textContent || this.element.innerText || ''
  }

  updateIndicator(score, level, analysis) {
    const colors = {
      'none': '#10b981',    // Green
      'mild': '#f59e0b',    // Yellow
      'moderate': '#ef4444', // Orange
      'high': '#dc2626'     // Red
    }

    this.indicator.style.background = colors[level] || colors['none']
    
    // Store current analysis for click handler - CRITICAL for click to work
    this.currentAnalysis = analysis
    
    if (this.debugMode) {
      console.log('💾 Stored analysis in currentAnalysis:', {
        hasAnalysis: !!analysis,
        hasSuggestion: !!(analysis && analysis.suggested_rewrite),
        suggestion: analysis?.suggested_rewrite?.substring(0, 50)
      })
    }
    
    // Add visual hint if suggestion is available
    if (analysis && analysis.suggested_rewrite) {
      this.indicator.style.cursor = 'pointer'
      this.indicator.title = 'Click to apply suggestion'
      this.indicator.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2), 0 0 0 2px rgba(59, 130, 246, 0.3)'
    } else {
      this.indicator.style.cursor = 'pointer'
      this.indicator.title = 'BiasGuard Analysis'
      this.indicator.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
    }
    
    if (this.debugMode) {
      console.log(`🎨 Updating indicator - Score: ${score}, Level: ${level}, Color: ${colors[level]}, Has Suggestion: ${!!(analysis && analysis.suggested_rewrite)}`)
    }
    
    // Update tooltip content
    if (analysis && (analysis.bias_score > 0 || analysis.bias_patterns?.length > 0)) {
      this.tooltip.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 8px; color: #1f2937;">
          🛡️ BiasGuard Analysis
        </div>
        <div style="margin-bottom: 8px;">
          <strong>Bias Level:</strong> ${level.charAt(0).toUpperCase() + level.slice(1)}
        </div>
        <div style="margin-bottom: 8px; color: #6b7280;">
          <strong>Score:</strong> ${score}/10
        </div>
        ${analysis.bias_patterns?.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <strong>Issues Found:</strong><br>
            ${analysis.bias_patterns.map(pattern => 
              `• ${pattern.replace(/_/g, ' ')}`
            ).join('<br>')}
          </div>
        ` : ''}
        ${analysis.suggested_rewrite ? `
          <div style="background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px; margin-bottom: 10px;">
            <div style="font-weight: 600; margin-bottom: 6px; color: #1e40af;">💡 Suggestion:</div>
            <div style="color: #1e40af; font-size: 13px;">"${analysis.suggested_rewrite}"</div>
          </div>
          <button class="biasguard-apply-btn" style="
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 12px;
            cursor: pointer;
            width: 100%;
            font-weight: 500;
          ">Apply Suggestion</button>
        ` : ''}
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af;">
          Analysis source: ${analysis.analysis_metadata?.source || 'API'} | 
          Processing: ${analysis.analysis_metadata?.processing_time_ms || 0}ms
        </div>
      `
      
      // Add click handler for apply button
      const applyBtn = this.tooltip.querySelector('.biasguard-apply-btn')
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          this.applySuggestion(analysis.suggested_rewrite)
        })
      }
    } else {
      this.tooltip.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 8px; color: #10b981;">
          ✅ No bias detected
        </div>
        <div style="color: #6b7280; font-size: 13px;">
          Your text appears to be inclusive and neutral.
        </div>
      `
    }
  }

  applySuggestion(suggestion) {
    console.log('🔧 applySuggestion called with:', suggestion)
    console.log('📝 Element type:', this.element.tagName)
    console.log('📝 Element value before:', this.element.tagName === 'TEXTAREA' || this.element.tagName === 'INPUT' ? this.element.value : this.element.textContent)
    
    if (!suggestion) {
      console.error('❌ No suggestion provided to applySuggestion')
      return
    }
    
    try {
      if (this.element.tagName === 'TEXTAREA' || this.element.tagName === 'INPUT') {
        this.element.value = suggestion
        console.log('✅ Applied to input/textarea value')
      } else {
        this.element.textContent = suggestion
        this.element.innerHTML = suggestion
        console.log('✅ Applied to contentEditable')
      }
      
      // Trigger multiple events to ensure it's detected
      const inputEvent = new Event('input', { bubbles: true, cancelable: true })
      const changeEvent = new Event('change', { bubbles: true, cancelable: true })
      this.element.dispatchEvent(inputEvent)
      this.element.dispatchEvent(changeEvent)
      
      // Also trigger focus to ensure the change is visible
      this.element.focus()
      
      console.log('📝 Element value after:', this.element.tagName === 'TEXTAREA' || this.element.tagName === 'INPUT' ? this.element.value : this.element.textContent)
      
      this.hideTooltip()
      this.hideIndicator()
      
      if (this.debugMode) {
        console.log('✨ Successfully applied suggestion:', suggestion)
      }
    } catch (error) {
      console.error('❌ Error applying suggestion:', error)
    }
  }

  showIndicator() {
    this.updateIndicatorPosition()
    this.indicator.style.display = 'block'
  }

  hideIndicator() {
    if (!this.indicator.matches(':hover') && !this.tooltip.matches(':hover')) {
      this.indicator.style.display = 'none'
      this.hideTooltip()
    }
  }

  showTooltip() {
    const rect = this.indicator.getBoundingClientRect()
    this.tooltip.style.display = 'block'
    this.tooltip.style.position = 'fixed'
    this.tooltip.style.top = `${rect.bottom + 5}px`
    this.tooltip.style.left = `${Math.max(10, rect.left - 150)}px`
    this.tooltip.style.opacity = '1'
    this.tooltip.style.transform = 'translateY(0)'
    this.tooltip.style.pointerEvents = 'auto'
  }

  hideTooltip() {
    this.tooltip.style.opacity = '0'
    this.tooltip.style.transform = 'translateY(10px)'
    this.tooltip.style.pointerEvents = 'none'
    setTimeout(() => {
      this.tooltip.style.display = 'none'
    }, 200)
  }

  setLoading(isLoading) {
    if (isLoading) {
      this.indicator.style.background = '#f59e0b'
      this.indicator.style.animation = 'biasguard-spin 1s linear infinite'
    } else {
      this.indicator.style.animation = 'none'
    }
  }

  setError(message) {
    this.indicator.style.background = '#ef4444'
    this.tooltip.innerHTML = `
      <div style="color: #dc2626; font-weight: 600;">⚠️ Error</div>
      <div style="color: #6b7280; font-size: 12px; margin-top: 4px;">${message}</div>
    `
  }

  updateDebugStats() {
    // Update debug stats in extension instance
    if (window.biasGuardExtension) {
      window.biasGuardExtension.debugStats.checks = this.checkCount
      window.biasGuardExtension.debugStats.lastScore = this.currentAnalysis?.bias_score || 0
    }
  }
}

// Add required animations
if (!document.getElementById('biasguard-animations')) {
  const style = document.createElement('style')
  style.id = 'biasguard-animations'
  style.textContent = `
    @keyframes biasguard-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
}

// Initialize extension
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BiasGuardExtension()
  })
} else {
  new BiasGuardExtension()
}

// Listen for messages from popup and background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PERFORM_QUICK_CHECK') {
    console.log('🔍 Performing quick check on all active elements')
    // Trigger check on all active elements
    document.querySelectorAll('textarea, input[type="text"], [contenteditable]').forEach(element => {
      if (element.value || element.textContent) {
        element.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    sendResponse({ success: true })
  }
  
  if (message.type === 'ANALYZE_SELECTED_TEXT') {
    console.log('🔍 Analyzing selected text from context menu:', message.text)
    
    // Analyze the selected text
    BiasAPI.analyze(message.text).then(result => {
      console.log('✅ Context menu analysis result:', result)
      
      // Show result in a floating panel
      showContextMenuResult(message.text, result)
      
      sendResponse({ success: true, result })
    }).catch(error => {
      console.error('❌ Context menu analysis error:', error)
      sendResponse({ success: false, error: error.message })
    })
    
    return true // Async response
  }
})

// Show context menu analysis result
function showContextMenuResult(text, analysis) {
  // Remove existing result panel if any
  const existing = document.getElementById('biasguard-context-result')
  if (existing) {
    existing.remove()
  }
  
  const resultPanel = document.createElement('div')
  resultPanel.id = 'biasguard-context-result'
  
  const colors = {
    'none': '#10b981',
    'mild': '#f59e0b',
    'moderate': '#ef4444',
    'high': '#dc2626'
  }
  
  const color = colors[analysis.bias_level] || colors['none']
  const levelLabels = {
    'none': 'No Bias',
    'mild': 'Mild Bias',
    'moderate': 'Moderate Bias',
    'high': 'High Bias'
  }
  
  // Get debug stats from extension instance
  const extension = window.biasGuardExtension
  const debugInfo = extension ? {
    inputs: extension.activeElements?.size || 0,
    checks: extension.debugStats?.checks || 0,
    lastScore: analysis.bias_score || 0
  } : { inputs: 0, checks: 0, lastScore: 0 }
  
  resultPanel.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid ${color};
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    z-index: 1000001;
    max-width: 420px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    animation: biasguard-slideIn 0.3s ease;
  `
  
  // Build main content
  let mainContent = ''
  
  if (analysis.bias_score === 0 || analysis.bias_level === 'none') {
    // No bias detected - show success message
    mainContent = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: #f0fdf4; border: 3px solid #10b981; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 40px; color: #10b981;">✓</span>
        </div>
        <h3 style="margin: 0 0 8px; color: #1f2937; font-size: 20px;">No bias detected!</h3>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">Your text appears to be inclusive and neutral.</p>
      </div>
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <div style="text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: #10b981; line-height: 1;">${analysis.bias_score.toFixed(1)}</div>
          <div style="font-size: 14px; color: #9ca3af; margin-top: 4px;">/ 10</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">Bias Level</div>
          <div style="font-size: 14px; font-weight: 600; color: #10b981; margin-top: 4px;">None</div>
        </div>
      </div>
    `
  } else {
    // Bias detected - show detailed analysis with circular gauge
    const scorePercent = (analysis.bias_score / 10) * 100
    const circumference = 2 * Math.PI * 40 // radius = 40
    const offset = circumference - (scorePercent / 100) * circumference
    
    // Protected classes tags
    const protectedClassesHTML = analysis.protected_classes?.length > 0 ? `
      <div style="margin-top: 16px; margin-bottom: 16px;">
        <div style="font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px;">Protected Classes Detected:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${analysis.protected_classes.map(cls => `
            <span style="
              background: #3b82f6;
              color: white;
              padding: 4px 12px;
              border-radius: 16px;
              font-size: 12px;
              font-weight: 500;
            ">${cls}</span>
          `).join('')}
        </div>
      </div>
    ` : ''
    
    mainContent = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="position: relative; display: inline-block; margin-bottom: 12px;">
          <svg width="100" height="100" style="transform: rotate(-90deg);">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="8"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="${color}" stroke-width="8" 
                    stroke-dasharray="${circumference}" 
                    stroke-dashoffset="${offset}"
                    stroke-linecap="round"
                    style="transition: stroke-dashoffset 0.5s ease;"/>
          </svg>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #1f2937; line-height: 1;">${analysis.bias_score.toFixed(1)}</div>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">/ 10</div>
          </div>
        </div>
        <div style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 4px;">${levelLabels[analysis.bias_level] || 'Unknown'}</div>
        <div style="font-size: 12px; color: #6b7280;">Bias Level</div>
      </div>
      ${protectedClassesHTML}
      ${analysis.bias_patterns?.length > 0 ? `
        <div style="margin-bottom: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <strong style="font-size: 13px; color: #374151; display: block; margin-bottom: 8px;">Issues Found:</strong>
          <div style="font-size: 12px; color: #6b7280; line-height: 1.6;">
            ${analysis.bias_patterns.map(p => `• ${p.replace(/_/g, ' ')}`).join('<br>')}
          </div>
        </div>
      ` : ''}
      ${analysis.suggested_rewrite ? `
        <div style="margin-bottom: 16px; padding: 12px; background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px;">
          <strong style="font-size: 12px; color: #1e40af; display: block; margin-bottom: 6px;">💡 Suggestion:</strong>
          <div style="font-size: 13px; color: #1e3a8a; line-height: 1.5;">"${analysis.suggested_rewrite}"</div>
        </div>
      ` : ''}
    `
  }
  
  // Debug info section (integrated at bottom)
  const debugSection = `
    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #9ca3af;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>🛡️</span>
          <span>Monitoring ${debugInfo.inputs} input${debugInfo.inputs !== 1 ? 's' : ''}</span>
        </div>
        <div>
          <span>Stats: ${debugInfo.checks} check${debugInfo.checks !== 1 ? 's' : ''} | Last: ${debugInfo.lastScore.toFixed(1)}/10</span>
        </div>
      </div>
    </div>
  `
  
  // Action buttons section
  const actionButtons = analysis.bias_score > 0 && analysis.suggested_rewrite ? `
    <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
      <button id="biasguard-apply-all" style="
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        transition: background 0.2s;
      " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
        Apply All Suggestions
      </button>
      <button id="biasguard-learn-types" style="
        background: white;
        color: #374151;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        width: 100%;
        transition: all 0.2s;
      " onmouseover="this.style.borderColor='#9ca3af'; this.style.background='#f9fafb'" onmouseout="this.style.borderColor='#d1d5db'; this.style.background='white'">
        Learn About Bias Types
      </button>
    </div>
  ` : ''
  
  // Header with Export, Share, Sign In and Get Started buttons
  const headerButtons = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button id="biasguard-export" style="
          background: white;
          color: #3b82f6;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        " onmouseover="this.style.background='#eff6ff'; this.style.borderColor='#93c5fd'" onmouseout="this.style.background='white'; this.style.borderColor='#bfdbfe'">
          Export
        </button>
        <button id="biasguard-share" style="
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        " onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
          Share
        </button>
        <h3 style="margin: 0; color: #1f2937; font-size: 18px; margin-left: 8px;">🛡️ Bias Analysis</h3>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button id="biasguard-signin" style="
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          text-decoration: underline;
        ">Sign In</button>
        <button id="biasguard-get-started" style="
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
          Get Started
        </button>
        <button id="biasguard-close-result" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 24px;
          height: 24px;
          line-height: 1;
          margin-left: 8px;
        ">×</button>
      </div>
    </div>
  `
  
  resultPanel.innerHTML = `
    ${headerButtons}
    ${mainContent}
    ${actionButtons}
    ${debugSection}
    <div style="margin-top: 16px; text-align: center; font-size: 10px; color: #9ca3af;">
      Powered by BiasGuard 4.0
    </div>
  `
  
  document.body.appendChild(resultPanel)
  
  // Close button
  resultPanel.querySelector('#biasguard-close-result').addEventListener('click', () => {
    resultPanel.style.animation = 'biasguard-slideOut 0.3s ease'
    setTimeout(() => resultPanel.remove(), 300)
  })
  
  // Sign In button - use setTimeout to ensure DOM is ready
  setTimeout(() => {
    const signInBtn = resultPanel.querySelector('#biasguard-signin')
    if (signInBtn) {
      console.log('✅ Sign In button found, attaching listener')
      signInBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('🔐 Sign In button clicked')
        
        // Try to open popup first
        chrome.runtime.sendMessage({ type: 'OPEN_POPUP' }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Popup open failed, trying editor:', chrome.runtime.lastError)
            // Fallback: open editor
            chrome.runtime.sendMessage({ type: 'OPEN_EDITOR' }, (response) => {
              if (chrome.runtime.lastError) {
                console.log('Editor open failed, using window.open:', chrome.runtime.lastError)
                window.open('http://localhost:3001/editor', '_blank')
              }
            })
          }
        })
        
        // Close result panel after a short delay
        setTimeout(() => {
          resultPanel.style.animation = 'biasguard-slideOut 0.3s ease'
          setTimeout(() => resultPanel.remove(), 300)
        }, 100)
      })
    } else {
      console.error('❌ Sign In button not found')
    }
  }, 100)
  
  // Get Started button
  setTimeout(() => {
    const getStartedBtn = resultPanel.querySelector('#biasguard-get-started')
    if (getStartedBtn) {
      console.log('✅ Get Started button found, attaching listener')
      getStartedBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('🚀 Get Started button clicked')
        
        // Open editor in new tab
        chrome.runtime.sendMessage({ type: 'OPEN_EDITOR' }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Editor open failed, using window.open:', chrome.runtime.lastError)
            window.open('http://localhost:3001/editor', '_blank')
          }
        })
        
        // Close result panel
        setTimeout(() => {
          resultPanel.style.animation = 'biasguard-slideOut 0.3s ease'
          setTimeout(() => resultPanel.remove(), 300)
        }, 100)
      })
    } else {
      console.error('❌ Get Started button not found')
    }
  }, 100)
  
  // Apply All Suggestions button - Enhanced with better detection
  setTimeout(() => {
    const applyAllBtn = resultPanel.querySelector('#biasguard-apply-all')
    if (applyAllBtn && analysis.suggested_rewrite) {
      console.log('✅ Apply All Suggestions button found, attaching listener')
      console.log('📝 Suggestion available:', analysis.suggested_rewrite.substring(0, 50))
      
      applyAllBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('✨ Apply All Suggestions button clicked')
        console.log('🔍 Original text:', text.substring(0, 50))
        console.log('💡 Suggested rewrite:', analysis.suggested_rewrite.substring(0, 50))
        
        // Try to apply suggestion
        const success = await window.applySuggestionToInput(text, analysis.suggested_rewrite, applyAllBtn, resultPanel)
        
        if (!success) {
          console.warn('⚠️ Could not apply suggestion automatically')
        }
      })
    } else {
      if (!applyAllBtn) {
        console.log('⚠️ Apply All Suggestions button not found')
      } else {
        console.log('⚠️ No suggested rewrite available')
      }
    }
  }, 100)
  
  // Helper function to apply suggestion
  async function applySuggestionToInput(originalText, suggestion, button, panel) {
    console.log('🔧 Attempting to apply suggestion...')
    console.log('📝 Original:', originalText.substring(0, 50))
    console.log('💡 Suggestion:', suggestion.substring(0, 50))
    
    // Find the active text input and apply suggestion
    let applied = false
    const activeInput = document.activeElement
    
    if (activeInput && (activeInput.tagName === 'TEXTAREA' || activeInput.tagName === 'INPUT' || activeInput.contentEditable === 'true')) {
      console.log('📝 Found active input:', activeInput.tagName, activeInput.className)
      try {
        if (activeInput.tagName === 'TEXTAREA' || activeInput.tagName === 'INPUT') {
          activeInput.value = suggestion
          console.log('✅ Applied to input value')
        } else {
          activeInput.textContent = suggestion
          activeInput.innerHTML = suggestion
          console.log('✅ Applied to contentEditable')
        }
        
        // Trigger multiple events to ensure it's detected
        activeInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
        activeInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
        activeInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: 'Enter' }))
        
        applied = true
      } catch (error) {
        console.error('❌ Error applying to active input:', error)
      }
    } else {
      // Try to find the text input that was used for analysis
      const textInputs = document.querySelectorAll('textarea, input[type="text"], input[type="email"], [contenteditable="true"]')
      console.log(`🔍 Found ${textInputs.length} text inputs on page`)
      
      for (const input of textInputs) {
        let inputText = ''
        try {
          if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
            inputText = input.value || ''
          } else {
            inputText = input.textContent || input.innerText || ''
          }
          
          // Check if this input contains the analyzed text
          const textMatch = originalText.length > 0 && (
            inputText.includes(originalText.substring(0, Math.min(20, originalText.length))) || 
            originalText.includes(inputText.substring(0, Math.min(20, inputText.length)))
          )
          
          if (textMatch || input === document.activeElement) {
            console.log('📝 Found matching input:', input.tagName, input.className)
            if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
              input.value = suggestion
            } else {
              input.textContent = suggestion
              input.innerHTML = suggestion
            }
            input.focus()
            input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
            input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
            applied = true
            break
          }
        } catch (error) {
          console.error('❌ Error checking input:', error)
        }
      }
      
      // If still not found, use first available input
      if (!applied && textInputs.length > 0) {
        const firstInput = textInputs[0]
        console.log('📝 Using first available input:', firstInput.tagName)
        try {
          if (firstInput.tagName === 'TEXTAREA' || firstInput.tagName === 'INPUT') {
            firstInput.value = suggestion
          } else {
            firstInput.textContent = suggestion
            firstInput.innerHTML = suggestion
          }
          firstInput.focus()
          firstInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
          firstInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
          applied = true
        } catch (error) {
          console.error('❌ Error applying to first input:', error)
        }
      }
    }
    
    if (applied) {
      // Show success message
      button.textContent = '✓ Applied!'
      button.style.background = '#10b981'
      console.log('✅ Suggestion applied successfully')
      setTimeout(() => {
        panel.style.animation = 'biasguard-slideOut 0.3s ease'
        setTimeout(() => panel.remove(), 300)
      }, 1500)
      return true
    } else {
      // Copy to clipboard as fallback
      console.log('📋 No input found, copying to clipboard')
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(suggestion)
          button.textContent = '✓ Copied to Clipboard!'
          button.style.background = '#10b981'
          console.log('✅ Copied to clipboard')
          setTimeout(() => {
            button.textContent = 'Apply All Suggestions'
            button.style.background = '#3b82f6'
          }, 2000)
          return true
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea')
          textArea.value = suggestion
          textArea.style.position = 'fixed'
          textArea.style.opacity = '0'
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          button.textContent = '✓ Copied!'
          button.style.background = '#10b981'
          setTimeout(() => {
            button.textContent = 'Apply All Suggestions'
            button.style.background = '#3b82f6'
          }, 2000)
          return true
        }
      } catch (err) {
        console.error('❌ Clipboard copy failed:', err)
        button.textContent = '⚠️ Select text input first'
        button.style.background = '#f59e0b'
        setTimeout(() => {
          button.textContent = 'Apply All Suggestions'
          button.style.background = '#3b82f6'
        }, 2000)
        return false
      }
    }
  }
  
  // Learn About Bias Types button
  setTimeout(() => {
    const learnTypesBtn = resultPanel.querySelector('#biasguard-learn-types')
    if (learnTypesBtn) {
      console.log('✅ Learn About Bias Types button found, attaching listener')
      learnTypesBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('📚 Learn About Bias Types button clicked')
        
        // Remove existing info panel if any
        const existing = document.getElementById('biasguard-bias-types-panel')
        if (existing) {
          existing.remove()
        }
        
        // Show inline info panel
        const infoPanel = document.createElement('div')
        infoPanel.id = 'biasguard-bias-types-panel'
        infoPanel.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          z-index: 1000002;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          animation: biasguard-slideIn 0.3s ease;
        `
      infoPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; color: #1f2937; font-size: 20px;">📚 Bias Types Guide</h3>
          <button id="close-bias-types" style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
            padding: 0;
            width: 24px;
            height: 24px;
            line-height: 1;
          ">×</button>
        </div>
        <div style="color: #374151; line-height: 1.6;">
          <div style="margin-bottom: 16px;">
            <strong style="color: #1f2937;">1. Stereotyping</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px;">Generalizations about groups based on assumptions rather than facts.</p>
          </div>
          <div style="margin-bottom: 16px;">
            <strong style="color: #1f2937;">2. Prejudice</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px;">Preconceived opinions or attitudes about groups without adequate knowledge.</p>
          </div>
          <div style="margin-bottom: 16px;">
            <strong style="color: #1f2937;">3. Universal Claims</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px;">Statements that apply characteristics to all members of a group.</p>
          </div>
          <div style="margin-bottom: 16px;">
            <strong style="color: #1f2937;">4. Essentialism</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px;">Attributing inherent, unchangeable traits to groups.</p>
          </div>
          <div style="margin-bottom: 16px;">
            <strong style="color: #1f2937;">5. Prescriptive Statements</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px;">Telling groups what they should or must do based on stereotypes.</p>
          </div>
          <div style="margin-bottom: 16px;">
            <strong style="color: #1f2937;">6. Competence Assumptions</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px;">Assuming groups lack abilities or skills.</p>
          </div>
        </div>
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
          <a href="https://github.com/biasguard/biasguard-4.0" target="_blank" style="
            color: #3b82f6;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
          ">Learn More →</a>
        </div>
      `
        
        // Create overlay
        const overlay = document.createElement('div')
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          z-index: 1000001;
          animation: fadeIn 0.2s ease;
        `
        
        overlay.addEventListener('click', () => {
          infoPanel.style.animation = 'biasguard-slideOut 0.3s ease'
          overlay.style.animation = 'fadeOut 0.3s ease'
          setTimeout(() => {
            infoPanel.remove()
            overlay.remove()
          }, 300)
        })
        
        document.body.appendChild(overlay)
        document.body.appendChild(infoPanel)
        
        // Close button
        infoPanel.querySelector('#close-bias-types').addEventListener('click', () => {
          infoPanel.style.animation = 'biasguard-slideOut 0.3s ease'
          overlay.style.animation = 'fadeOut 0.3s ease'
          setTimeout(() => {
            infoPanel.remove()
            overlay.remove()
          }, 300)
        })
        
        // Also open documentation in new tab
        const biasTypesUrl = 'https://github.com/biasguard/biasguard-4.0/blob/main/COMPREHENSIVE_ANALYSIS.md#bias-types'
        window.open(biasTypesUrl, '_blank')
      })
    } else {
      console.log('⚠️ Learn About Bias Types button not found')
    }
  }, 100)
  
  // Auto-close after 15 seconds
  setTimeout(() => {
    if (document.getElementById('biasguard-context-result')) {
      resultPanel.style.animation = 'biasguard-slideOut 0.3s ease'
      setTimeout(() => resultPanel.remove(), 300)
    }
  }, 15000)
  
  // Attach Export and Share handlers
  attachExportShareHandlers(resultPanel, text, analysis)
}

// Function to attach Export and Share handlers
function attachExportShareHandlers(resultPanel, text, analysis) {
  // Export button
  setTimeout(() => {
    const exportBtn = resultPanel.querySelector('#biasguard-export')
    if (exportBtn) {
      console.log('✅ Export button found, attaching listener')
      exportBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('📤 Export button clicked')
        handleExport(text, analysis)
      })
    } else {
      console.error('❌ Export button not found')
    }
  }, 100)
  
  // Share button
  setTimeout(() => {
    const shareBtn = resultPanel.querySelector('#biasguard-share')
    if (shareBtn) {
      console.log('✅ Share button found, attaching listener')
      shareBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('🔗 Share button clicked')
        await handleShare(text, analysis)
      })
    } else {
      console.error('❌ Share button not found')
    }
  }, 100)
}

// Export function
function handleExport(text, analysis) {
  console.log('📤 Export clicked')
  console.log('📊 Analysis data:', analysis)
  
  try {
    // Create export data
    const exportData = {
      timestamp: new Date().toISOString(),
      originalText: text,
      biasScore: analysis.bias_score,
      biasLevel: analysis.bias_level,
      protectedClasses: analysis.protected_classes || [],
      biasPatterns: analysis.bias_patterns || [],
      biasTypes: analysis.bias_types || [],
      suggestedRewrite: analysis.suggested_rewrite || '',
      explanation: analysis.explanation || ''
    }
    
    // Create JSON blob
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `biasguard-analysis-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('✅ Export successful')
    showNotification('Analysis exported successfully!', 'success')
  } catch (error) {
    console.error('❌ Export failed:', error)
    showNotification('Export failed. Please try again.', 'error')
  }
}

// Share function
async function handleShare(text, analysis) {
  console.log('🔗 Share clicked')
  console.log('📊 Analysis data:', analysis)
  
  try {
    // Create shareable text
    const shareText = `BiasGuard Analysis\n\n` +
      `Original Text: "${text}"\n` +
      `Bias Score: ${analysis.bias_score}/10 (${analysis.bias_level})\n` +
      `Protected Classes: ${(analysis.protected_classes || []).join(', ')}\n` +
      `Issues: ${(analysis.bias_patterns || []).join(', ')}\n` +
      (analysis.suggested_rewrite ? `Suggestion: "${analysis.suggested_rewrite}"` : '')
    
    // Try Web Share API first
    if (navigator.share) {
      await navigator.share({
        title: 'BiasGuard Analysis',
        text: shareText,
        url: window.location.href
      })
      console.log('✅ Shared via Web Share API')
      showNotification('Shared successfully!', 'success')
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText)
      console.log('✅ Copied to clipboard')
      showNotification('Analysis copied to clipboard!', 'success')
    } else {
      // Fallback: show share text in prompt
      prompt('Copy this analysis:', shareText)
      showNotification('Share text displayed', 'info')
    }
  } catch (error) {
    console.error('❌ Share failed:', error)
    if (error.name !== 'AbortError') {
      showNotification('Share failed. Please try again.', 'error')
    }
  }
}

// Notification helper
function showNotification(message, type = 'info') {
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000003;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    animation: slideInRight 0.3s ease;
  `
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Add animations for result panel
if (!document.getElementById('biasguard-result-animations')) {
  const style = document.createElement('style')
  style.id = 'biasguard-result-animations'
  style.textContent = `
    @keyframes biasguard-slideIn {
      from {
        opacity: 0;
        transform: translate(-50%, -60%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }
    @keyframes biasguard-slideOut {
      from {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
      to {
        opacity: 0;
        transform: translate(-50%, -40%);
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}
