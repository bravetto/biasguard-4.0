/**
 * BiasGuard Background Service Worker
 * Handles extension lifecycle, context menus, and messaging
 */

// Initialize on install
chrome.runtime.onInstalled.addListener((details) => {
  console.log('🛡️ BiasGuard Extension Installed:', details.reason)

  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      biasguard_settings: {
        enabled: true,
        realTimeChecking: true,
        showSuggestions: true,
        checkDelay: 1000,
        minTextLength: 10
      }
    })

    // Set default API URL
    chrome.storage.sync.set({
      biasguard_api_url: 'http://localhost:3001/api/analyze'
    })

    // Initialize stats
    chrome.storage.local.set({
      biasguard_stats: {
        textInputsMonitored: 0,
        biasChecksToday: 0,
        lastCheckDate: new Date().toDateString()
      }
    })

    // Open welcome page (optional)
    // chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') })
  } else if (details.reason === 'update') {
    console.log('🔄 BiasGuard Extension Updated')
  }
})

// Create context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'biasguard-check',
    title: 'Check for bias with BiasGuard',
    contexts: ['selection']
  })

  chrome.contextMenus.create({
    id: 'biasguard-separator',
    type: 'separator',
    contexts: ['selection']
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'biasguard-check' && info.selectionText) {
    const selectedText = info.selectionText.trim()
    
    if (!selectedText || selectedText.length < 5) {
      // Show notification for short text
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('assets/icon48.png'),
        title: 'BiasGuard',
        message: 'Please select at least 5 characters to analyze.'
      })
      return
    }

    try {
      // First, try to send message to content script
      await chrome.tabs.sendMessage(tab.id, {
        type: 'ANALYZE_SELECTED_TEXT',
        text: selectedText
      })
    } catch (error) {
      console.log('Content script not available, analyzing in background:', error)
      
      // Fallback: Analyze in background and show result
      try {
        const response = await fetch('http://localhost:3001/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: selectedText })
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            // Show notification with result
            const level = result.data.bias_level || 'none'
            const score = result.data.bias_score || 0
            const emoji = level === 'high' ? '🔴' : level === 'moderate' ? '🟡' : level === 'mild' ? '🟠' : '🟢'
            
            chrome.notifications.create({
              type: 'basic',
              iconUrl: chrome.runtime.getURL('assets/icon48.png'),
              title: `BiasGuard Analysis ${emoji}`,
              message: `Bias Score: ${score}/10 (${level}) - Click to see details`,
              buttons: [{ title: 'View Details' }]
            })
            
            // Store result for popup to display
            chrome.storage.local.set({
              lastContextMenuAnalysis: {
                text: selectedText,
                result: result.data,
                timestamp: Date.now()
              }
            })
          }
        }
      } catch (apiError) {
        console.error('API analysis failed:', apiError)
        // Use mock analysis
        const mockResult = getMockAnalysis(selectedText)
        const emoji = mockResult.bias_level === 'high' ? '🔴' : mockResult.bias_level === 'moderate' ? '🟡' : '🟢'
        
        chrome.notifications.create({
          type: 'basic',
          iconUrl: chrome.runtime.getURL('assets/icon48.png'),
          title: `BiasGuard Analysis ${emoji}`,
          message: `Bias Score: ${mockResult.bias_score}/10 (${mockResult.bias_level})`
        })
      }
    }
  }
})

// Helper function for mock analysis (same as in api.js)
function getMockAnalysis(text) {
  const patterns = [
    { pattern: /(all |every )?women (are|is).*(bad|terrible|awful|stupid|incapable|inferior|worse)/i, 
      score: 8.5, level: 'high' },
    { pattern: /(all |every )?men (are|is).*(better|superior|smarter|stronger)/i, 
      score: 8.0, level: 'high' },
    { pattern: /(all |every )?(black|white|asian|hispanic|latino) (people|men|women) (are|is)/i, 
      score: 9.0, level: 'high' },
  ]
  
  for (const p of patterns) {
    if (p.pattern.test(text)) {
      return { bias_score: p.score, bias_level: p.level }
    }
  }
  
  return { bias_score: 0, bias_level: 'none' }
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STATS') {
    chrome.storage.local.get(['biasguard_stats'], (result) => {
      sendResponse({ stats: result.biasguard_stats || {} })
    })
    return true // Async response
  }

  if (message.type === 'UPDATE_STATS') {
    chrome.storage.local.set({ biasguard_stats: message.stats }, () => {
      sendResponse({ success: true })
    })
    return true
  }

  if (message.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(['biasguard_settings'], (result) => {
      sendResponse({ settings: result.biasguard_settings || {} })
    })
    return true
  }

  if (message.type === 'ANALYZE_TEXT') {
    // Forward to API
    fetch(message.apiUrl || 'http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message.text })
    })
      .then(response => response.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }))
    return true // Async response
  }

  if (message.type === 'OPEN_POPUP') {
    // Open extension popup (this will show the popup)
    chrome.action.openPopup()
    sendResponse({ success: true })
    return true
  }

  if (message.type === 'OPEN_EDITOR') {
    // Open editor in new tab
    chrome.tabs.create({ url: 'http://localhost:3001/editor' })
    sendResponse({ success: true })
    return true
  }
})

// Handle extension icon click (if no popup)
chrome.action.onClicked.addListener((tab) => {
  // This only fires if no popup is set in manifest
  chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_BIASGUARD' })
})

// Periodic cleanup (every hour)
setInterval(() => {
  // Clear old cache if needed
  chrome.storage.local.get(['biasguard_cache'], (result) => {
    // Implement cache cleanup logic if needed
  })
}, 60 * 60 * 1000)

console.log('✅ BiasGuard Background Service Worker Active')

