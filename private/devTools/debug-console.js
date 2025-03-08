/**
 * Debug Console
 * 
 * A developer tool that provides enhanced debugging capabilities 
 * for the Football Card Game.
 */

const DEBUG_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  DEBUG: 'debug'
};

class DebugConsole {
  constructor() {
    this.enabled = true;
    this.logHistory = [];
    this.filters = [];
    this.debugLevel = DEBUG_LEVELS.INFO;
    
    // Initialize UI if in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.initUI();
    }
  }
  
  /**
   * Initialize debug console UI
   */
  initUI() {
    // Create console container if it doesn't exist
    if (!document.getElementById('debug-console-container')) {
      const container = document.createElement('div');
      container.id = 'debug-console-container';
      container.style.cssText = `
        position: fixed;
        bottom: 0;
        right: 0;
        width: 400px;
        height: 300px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        font-family: monospace;
        font-size: 12px;
        display: none;
        flex-direction: column;
        z-index: 9999;
        border-top-left-radius: 8px;
        overflow: hidden;
      `;
      
      const header = document.createElement('div');
      header.style.cssText = `
        padding: 5px;
        background-color: #444;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #666;
      `;
      
      const title = document.createElement('div');
      title.textContent = 'Debug Console';
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'X';
      closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
      `;
      closeBtn.onclick = () => this.toggleConsole(false);
      
      header.appendChild(title);
      header.appendChild(closeBtn);
      
      const content = document.createElement('div');
      content.id = 'debug-console-content';
      content.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 10px;
      `;
      
      const footer = document.createElement('div');
      footer.style.cssText = `
        padding: 5px;
        background-color: #444;
        display: flex;
        border-top: 1px solid #666;
      `;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Enter command...';
      input.style.cssText = `
        flex: 1;
        background-color: #333;
        color: white;
        border: none;
        padding: 5px;
        border-radius: 3px;
      `;
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.executeCommand(input.value);
          input.value = '';
        }
      });
      
      footer.appendChild(input);
      
      container.appendChild(header);
      container.appendChild(content);
      container.appendChild(footer);
      
      document.body.appendChild(container);
      
      // Add keyboard shortcut (Ctrl+Shift+D)
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          this.toggleConsole();
        }
      });
      
      // Add toggle button
      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = 'Debug';
      toggleBtn.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        z-index: 9998;
      `;
      toggleBtn.onclick = () => this.toggleConsole();
      
      document.body.appendChild(toggleBtn);
    }
  }
  
  /**
   * Toggle debug console visibility
   * @param {boolean} show - Force show/hide state
   */
  toggleConsole(show) {
    const container = document.getElementById('debug-console-container');
    
    if (container) {
      if (show === undefined) {
        // Toggle current state
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
      } else {
        // Force state
        container.style.display = show ? 'flex' : 'none';
      }
    }
  }
  
  /**
   * Execute debug command
   * @param {string} command - Command to execute
   */
  executeCommand(command) {
    if (!command) return;
    
    this.log(`> ${command}`, DEBUG_LEVELS.DEBUG);
    
    // Parse command
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    switch (cmd) {
      case 'clear':
        this.clearLogs();
        break;
        
      case 'help':
        this.showHelp();
        break;
        
      case 'disable':
        this.enabled = false;
        this.log('Debug console disabled', DEBUG_LEVELS.INFO);
        break;
        
      case 'enable':
        this.enabled = true;
        this.log('Debug console enabled', DEBUG_LEVELS.INFO);
        break;
        
      case 'level':
        if (args.length > 0 && Object.values(DEBUG_LEVELS).includes(args[0])) {
          this.debugLevel = args[0];
          this.log(`Debug level set to ${this.debugLevel}`, DEBUG_LEVELS.INFO);
        } else {
          this.log(`Current debug level: ${this.debugLevel}`, DEBUG_LEVELS.INFO);
        }
        break;
        
      case 'filter':
        if (args.length > 0) {
          this.filters.push(args[0]);
          this.log(`Added filter: ${args[0]}`, DEBUG_LEVELS.INFO);
        } else {
          this.log(`Current filters: ${this.filters.join(', ') || 'none'}`, DEBUG_LEVELS.INFO);
        }
        break;
        
      case 'clearfilters':
        this.filters = [];
        this.log('Filters cleared', DEBUG_LEVELS.INFO);
        break;
        
      default:
        // Try to evaluate as JavaScript
        try {
          // Use with caution - eval can be dangerous
          const result = eval(command);
          this.log(`Result: ${JSON.stringify(result)}`, DEBUG_LEVELS.INFO);
        } catch (error) {
          this.log(`Unknown command or error: ${error.message}`, DEBUG_LEVELS.ERROR);
        }
    }
  }
  
  /**
   * Show help information
   */
  showHelp() {
    const helpInfo = [
      'Debug Console Commands:',
      '  help - Show this help',
      '  clear - Clear console logs',
      '  enable - Enable debug console',
      '  disable - Disable debug console',
      '  level [info|warning|error|debug] - Set or view debug level',
      '  filter [text] - Add log filter',
      '  clearfilters - Clear all filters',
      '',
      'Keyboard Shortcut:',
      '  Ctrl+Shift+D - Toggle console'
    ];
    
    helpInfo.forEach(line => this.log(line, DEBUG_LEVELS.INFO));
  }
  
  /**
   * Log a message to the debug console
   * @param {string} message - Message to log
   * @param {string} level - Debug level
   * @param {object} data - Additional data to log
   */
  log(message, level = DEBUG_LEVELS.INFO, data = null) {
    if (!this.enabled) return;
    
    // Check debug level
    const levels = Object.values(DEBUG_LEVELS);
    const currentLevelIndex = levels.indexOf(this.debugLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    if (messageLevelIndex < currentLevelIndex) return;
    
    // Check filters
    if (this.filters.length > 0) {
      const passesFilter = this.filters.some(filter => 
        message.toLowerCase().includes(filter.toLowerCase())
      );
      
      if (!passesFilter) return;
    }
    
    // Format timestamp
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    
    // Format log entry
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };
    
    // Add to history
    this.logHistory.push(logEntry);
    
    // Output to console
    const consoleMethod = level === DEBUG_LEVELS.ERROR ? 'error' : 
                         level === DEBUG_LEVELS.WARNING ? 'warn' : 
                         level === DEBUG_LEVELS.DEBUG ? 'debug' : 'log';
    
    console[consoleMethod](`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || '');
    
    // Update UI if available
    this.updateUI(logEntry);
  }
  
  /**
   * Update the debug console UI with new log entry
   * @param {object} logEntry - Log entry to display
   */
  updateUI(logEntry) {
    const content = document.getElementById('debug-console-content');
    
    if (content) {
      const entry = document.createElement('div');
      entry.className = `log-entry ${logEntry.level}`;
      
      // Style based on level
      let color;
      switch (logEntry.level) {
        case DEBUG_LEVELS.ERROR:
          color = '#ff5252';
          break;
        case DEBUG_LEVELS.WARNING:
          color = '#ffb142';
          break;
        case DEBUG_LEVELS.DEBUG:
          color = '#2196f3';
          break;
        default:
          color = '#ffffff';
      }
      
      entry.style.cssText = `
        margin-bottom: 5px;
        color: ${color};
      `;
      
      entry.innerHTML = `<span class="timestamp">[${logEntry.timestamp}]</span> <span class="level">[${logEntry.level.toUpperCase()}]</span> <span class="message">${logEntry.message}</span>`;
      
      content.appendChild(entry);
      
      // Auto-scroll to bottom
      content.scrollTop = content.scrollHeight;
    }
  }
  
  /**
   * Clear all logs
   */
  clearLogs() {
    this.logHistory = [];
    
    const content = document.getElementById('debug-console-content');
    if (content) {
      content.innerHTML = '';
    }
    
    this.log('Console cleared', DEBUG_LEVELS.INFO);
  }
  
  /**
   * Log an info message
   * @param {string} message - Message to log
   * @param {object} data - Additional data
   */
  info(message, data = null) {
    this.log(message, DEBUG_LEVELS.INFO, data);
  }
  
  /**
   * Log a warning message
   * @param {string} message - Message to log
   * @param {object} data - Additional data
   */
  warn(message, data = null) {
    this.log(message, DEBUG_LEVELS.WARNING, data);
  }
  
  /**
   * Log an error message
   * @param {string} message - Message to log
   * @param {object} data - Additional data
   */
  error(message, data = null) {
    this.log(message, DEBUG_LEVELS.ERROR, data);
  }
  
  /**
   * Log a debug message
   * @param {string} message - Message to log
   * @param {object} data - Additional data
   */
  debug(message, data = null) {
    this.log(message, DEBUG_LEVELS.DEBUG, data);
  }
}

// Create singleton instance
const debugConsole = new DebugConsole();

// Export the singleton
module.exports = debugConsole;
