// popup.js - LeetCode Buddy Popup Logic

document.addEventListener('DOMContentLoaded', function() {
    initializePopup();
});

function initializePopup() {
    // Check if we're on a LeetCode page
    checkLeetCodeStatus();
    
    // Load saved settings
    loadSettings();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load usage stats
    loadUsageStats();
}

function checkLeetCodeStatus() {
    const statusIndicator = document.getElementById('leetcode-status');
    const statusText = document.getElementById('status-text');
    
    // Check current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        
        if (currentTab.url.includes('leetcode.com/problems/')) {
            statusIndicator.className = 'status-indicator';
            statusText.textContent = 'Ready on LeetCode!';
        } else if (currentTab.url.includes('leetcode.com')) {
            statusIndicator.className = 'status-indicator checking';
            statusText.textContent = 'On LeetCode (navigate to a problem)';
        } else {
            statusIndicator.className = 'status-indicator error';
            statusText.textContent = 'Not on LeetCode';
        }
    });
}

function loadUsageStats() {
    // Load and display usage statistics
    chrome.storage.sync.get(['problems_helped', 'total_requests'], function(result) {
        const problemsHelped = result.problems_helped || 0;
        const statsElement = document.getElementById('usage-stats');
        
        if (statsElement) {
            statsElement.innerHTML = `Problems helped: <strong>${problemsHelped}</strong>`;
        }
    });
}

function loadSettings() {
    // Load API provider setting
    chrome.storage.sync.get(['api_provider', 'auto_detect_errors'], function(result) {
        const apiProvider = document.getElementById('api-provider');
        const autoDetect = document.getElementById('auto-detect-errors');
        
        if (result.api_provider) {
            apiProvider.value = result.api_provider;
            toggleApiKeySection(result.api_provider);
        }
        
        if (result.auto_detect_errors !== undefined) {
            autoDetect.checked = result.auto_detect_errors;
        }
    });
    
    // Load API key if present
    chrome.storage.sync.get(['openai_api_key'], function(result) {
        const apiKeyInput = document.getElementById('api-key');
        if (result.openai_api_key) {
            apiKeyInput.value = '••••••••••••' + result.openai_api_key.slice(-4);
        }
    });
}

function setupEventListeners() {
    // API provider change
    document.getElementById('api-provider').addEventListener('change', function() {
        const provider = this.value;
        toggleApiKeySection(provider);
        
        // Save setting
        chrome.storage.sync.set({ api_provider: provider });
    });
    
    // Save API key
    document.getElementById('save-key').addEventListener('click', function() {
        const apiKey = document.getElementById('api-key').value;
        
        if (apiKey && !apiKey.includes('••••')) {
            chrome.storage.sync.set({ openai_api_key: apiKey }, function() {
                showNotification('API key saved successfully!');
                
                // Update display
                const input = document.getElementById('api-key');
                input.value = '••••••••••••' + apiKey.slice(-4);
            });
        }
    });
    
    // Auto-detect errors toggle
    document.getElementById('auto-detect-errors').addEventListener('change', function() {
        chrome.storage.sync.set({ auto_detect_errors: this.checked });
    });
    
    // Help link
    document.getElementById('help-link').addEventListener('click', function(e) {
        e.preventDefault();
        showHelpModal();
    });
}

function toggleApiKeySection(provider) {
    const apiKeySection = document.getElementById('api-key-section');
    if (provider === 'openai') {
        apiKeySection.style.display = 'block';
    } else {
        apiKeySection.style.display = 'none';
    }
}

function toggleApiKeySection(provider) {
    const apiKeySection = document.getElementById('api-key-section');
    if (provider === 'openai' || provider === 'gemini') {
        apiKeySection.style.display = 'block';
    } else {
        apiKeySection.style.display = 'none';
    }
}


function showNotification(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #10b981;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showHelpModal() {
    // Create help modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 20px;
        max-width: 320px;
        width: 90%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    `;
    
    modal.innerHTML = `
        <h3 style="margin: 0 0 16px 0; color: #374151;">💡 Tips & Tricks</h3>
        <ul style="margin: 0; padding-left: 16px; font-size: 13px; line-height: 1.5; color: #4b5563;">
            <li style="margin-bottom: 8px;">The AI works best when you include any error messages</li>
            <li style="margin-bottom: 8px;">Try running your code first to get error output</li>
            <li style="margin-bottom: 8px;">The AI can help with optimization, debugging, and explanations</li>
            <li style="margin-bottom: 8px;">Use Demo Mode for free basic analysis</li>
            <li style="margin-bottom: 8px;">Get an OpenAI API key for advanced analysis</li>
        </ul>
        <button id="close-help" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 16px;
            float: right;
        ">Got it!</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close modal handlers
    document.getElementById('close-help').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

// Handle popup closing to save any unsaved changes
window.addEventListener('beforeunload', function() {
    // Any cleanup if needed
});