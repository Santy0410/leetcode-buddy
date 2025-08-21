// content.js - LeetCode Buddy Content Script

// --- Keep background alive hack ---
try {
  chrome.runtime.connect({ name: "keepAlive" });
  console.log("LeetCode Buddy: Connected to background to keep alive.");
} catch (e) {
  console.warn("KeepAlive connection failed:", e);
}

// --- Main LeetCode Buddy class ---
class LeetCodeBuddy {
  constructor() {
    this.modal = null;
    this.button = null;
    this.init();
  }

  init() {
    this.waitForEditor();
  }

  waitForEditor() {
    const checkForEditor = () => {
      const editorContainer = document.querySelector('[data-track-load="description_content"]') ||
                              document.querySelector('.monaco-editor') ||
                              document.querySelector('[class*="editor"]') ||
                              document.querySelector('#editor');
      
      if (editorContainer) {
        console.log('LeetCode Buddy: Editor found, injecting button...');
        this.injectButton();
      } else {
        setTimeout(checkForEditor, 500);
      }
    };
    checkForEditor();
  }

  injectButton() {
    if (document.getElementById('leetcode-buddy-btn')) return;

    const targetContainer = document.querySelector('[data-e2e-locator="console-submit-button"]')?.parentElement ||
                           document.querySelector('button[data-e2e-locator="console-run-button"]')?.parentElement ||
                           document.querySelector('.flex.items-center.space-x-4') ||
                           document.querySelector('.flex.justify-between') ||
                           document.body;

    this.button = document.createElement('button');
    this.button.id = 'leetcode-buddy-btn';
    this.button.className = 'leetcode-buddy-button';
    this.button.innerHTML = '🤖 Get AI Help';
    this.button.title = 'Get AI assistance with your code';

    this.button.addEventListener('click', () => this.handleButtonClick());

    if (targetContainer) {
      targetContainer.appendChild(this.button);
    } else {
      this.button.classList.add('floating');
      document.body.appendChild(this.button);
    }

    console.log('LeetCode Buddy: Button injected successfully');
  }

  async handleButtonClick() {
    console.log('LeetCode Buddy: Button clicked');
    const originalText = this.button.innerHTML;
    this.button.innerHTML = '⏳ Analyzing...';
    this.button.disabled = true;

    try {
      const codeData = this.extractCodeAndErrors();
      if (!codeData.code.trim()) {
        this.showModal('Error', 'No code found in the editor. Please write some code first.');
        return;
      }

      const response = await this.sendToBackground(codeData);
      this.showModal('AI Assistance', response.explanation, response.suggestedFix);
    } catch (error) {
      console.error('LeetCode Buddy Error:', error);
      this.showModal('Error', 'Failed to get AI assistance. Please reload the extension or check your API key.');
    } finally {
      this.button.innerHTML = originalText;
      this.button.disabled = false;
    }
  }

  extractCodeAndErrors() {
    let code = '';
    let errors = '';
    let problemTitle = '';

    const titleElement = document.querySelector('[data-cy="question-title"]') || 
                        document.querySelector('h1') ||
                        document.querySelector('.text-title-large');
    if (titleElement) {
      problemTitle = titleElement.textContent.trim();
    }

    const monacoEditor = document.querySelector('.monaco-editor');
    if (monacoEditor) {
      const lines = monacoEditor.querySelectorAll('.view-line');
      code = Array.from(lines).map(line => line.textContent).join('\n');
    }

    if (!code.trim()) {
      const codeInputs = document.querySelectorAll('textarea, .CodeMirror, [class*="editor"] textarea');
      for (const input of codeInputs) {
        if (input.value && input.value.trim().length > 10) {
          code = input.value;
          break;
        }
      }
    }

    const errorElements = document.querySelectorAll([
      '[data-e2e-locator="console-result"]',
      '.text-red-500',
      '.error-message',
      '[class*="error"]',
      '.console-output .text-red'
    ].join(', '));

    errors = Array.from(errorElements)
      .map(el => el.textContent.trim())
      .filter(text => text.length > 0)
      .join('\n');

    return { code: code.trim(), errors: errors.trim(), problemTitle };
  }

  async sendToBackground(data) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'ANALYZE_CODE', data }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  showModal(title, explanation, suggestedFix = '') {
    if (this.modal) this.modal.remove();

    this.modal = document.createElement('div');
    this.modal.className = 'leetcode-buddy-modal-overlay';
    
    this.modal.innerHTML = `
      <div class="leetcode-buddy-modal">
        <div class="leetcode-buddy-modal-header">
          <h3>${title}</h3>
          <button class="leetcode-buddy-close-btn">&times;</button>
        </div>
        <div class="leetcode-buddy-modal-content">
          <div class="explanation-section">
            <h4>Explanation:</h4>
            <p>${explanation}</p>
          </div>
          ${suggestedFix ? `
            <div class="fix-section">
              <h4>Suggested Fix:</h4>
              <pre><code>${suggestedFix}</code></pre>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.modal.querySelector('.leetcode-buddy-close-btn').addEventListener('click', () => {
      this.modal.remove();
    });

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.modal.remove();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal) this.modal.remove();
    });

    document.body.appendChild(this.modal);
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new LeetCodeBuddy());
} else {
  new LeetCodeBuddy();
}

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(() => new LeetCodeBuddy(), 1000);
  }
}).observe(document, { subtree: true, childList: true });
