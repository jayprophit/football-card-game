/**
 * Testing Access Controls
 * 
 * Provides unlimited access to game features and testing tools for development.
 */

const debugConsole = require('./devTools/debugConsole');
const performanceMonitor = require('./devTools/performanceMonitor');
const { generateTestTeam } = require('./testData/teamGenerator');
const { generateMockMatch } = require('./testData/mockMatches');

class TestingAccess {
  constructor() {
    this.isEnabled = false;
    this.adminPassword = 'developer123'; // Simple password for demo purposes
    this.gameEngine = null;
    this.adminInterface = null;
    
    // Initialize UI if in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.initUI();
    }
  }
  
  /**
   * Initialize testing access UI
   */
  initUI() {
    // Create admin panel container if it doesn't exist
    if (!document.getElementById('admin-panel')) {
      const container = document.createElement('div');
      container.id = 'admin-panel';
      container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #333;
        color: white;
        font-family: sans-serif;
        padding: 20px;
        border-radius: 8px;
        z-index: 10000;
        display: none;
        width: 400px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
      `;
      
      const header = document.createElement('div');
      header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        border-bottom: 1px solid #555;
        padding-bottom: 10px;
      `;
      
      const title = document.createElement('h3');
      title.textContent = 'Developer Testing Access';
      title.style.margin = '0';
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'X';
      closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
      `;
      closeBtn.onclick = () => this.togglePanel(false);
      
      header.appendChild(title);
      header.appendChild(closeBtn);
      
      const content = document.createElement('div');
      content.id = 'admin-panel-content';
      
      // Create admin tools
      content.innerHTML = `
        <div class="admin-section">
          <h4>Game Controls</h4>
          <button id="reset-game-btn">Reset Game</button>
          <button id="add-goal-home-btn">Add Goal (Home)</button>
          <button id="add-goal-away-btn">Add Goal (Away)</button>
          <button id="toggle-turn-btn">Toggle Turn</button>
          <button id="unlimited-moves-btn">Toggle Unlimited Moves</button>
        </div>
        
        <div class="admin-section">
          <h4>Player Management</h4>
          <button id="heal-all-btn">Heal All Players</button>
          <button id="reset-cards-btn">Reset All Cards</button>
          <select id="player-select">
            <option value="">Select Player...</option>
          </select>
          <div class="player-actions">
            <button id="give-yellow-btn">Give Yellow</button>
            <button id="give-red-btn">Give Red</button>
            <button id="injure-btn">Injure</button>
            <button id="give-ball-btn">Give Ball</button>
          </div>
        </div>
        
        <div class="admin-section">
          <h4>Testing Tools</h4>
          <button id="toggle-debug-btn">Toggle Debug Console</button>
          <button id="toggle-performance-btn">Toggle Performance Monitor</button>
          <button id="generate-test-match-btn">Generate Test Match</button>
          <label>
            <input type="checkbox" id="god-mode-check"> God Mode (No Rules)
          </label>
        </div>
      `;
      
      // Apply some basic styles to the admin panel
      const style = document.createElement('style');
      style.textContent = `
        #admin-panel button {
          background-color: #4caf50;
          border: none;
          color: white;
          padding: 6px 12px;
          margin: 4px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        #admin-panel button:hover {
          background-color: #388e3c;
        }
        
        #admin-panel select {
          width: 100%;
          padding: 6px;
          margin: 5px 0;
          background-color: #444;
          color: white;
          border: 1px solid #555;
          border-radius: 4px;
        }
        
        .admin-section {
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #555;
        }
        
        .admin-section h4 {
          margin: 0 0 8px 0;
          color: #8bc34a;
        }
        
        .player-actions {
          display: flex;
          flex-wrap: wrap;
        }
      `;
      
      container.appendChild(header);
      container.appendChild(content);
      document.head.appendChild(style);
      document.body.appendChild(container);
      
      // Add keyboard shortcut (Ctrl+Shift+A)
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
          e.preventDefault();
          this.promptAccess();
        }
      });
      
      // Attach event listeners once the DOM is fully loaded
      if (document.readyState === 'complete') {
        this.attachEventListeners();
      } else {
        window.addEventListener('load', () => this.attachEventListeners());
      }
    }
  }
  
  /**
   * Attach event listeners to admin panel buttons
   */
  attachEventListeners() {
    // Game controls
    document.getElementById('reset-game-btn')?.addEventListener('click', () => this.resetGame());
    document.getElementById('add-goal-home-btn')?.addEventListener('click', () => this.addGoal(0));
    document.getElementById('add-goal-away-btn')?.addEventListener('click', () => this.addGoal(1));
    document.getElementById('toggle-turn-btn')?.addEventListener('click', () => this.toggleTurn());
    document.getElementById('unlimited-moves-btn')?.addEventListener('click', () => this.toggleUnlimitedMoves());
    
    // Player management
    document.getElementById('heal-all-btn')?.addEventListener('click', () => this.healAllPlayers());
    document.getElementById('reset-cards-btn')?.addEventListener('click', () => this.resetAllCards());
    document.getElementById('give-yellow-btn')?.addEventListener('click', () => this.giveCard('yellow'));
    document.getElementById('give-red-btn')?.addEventListener('click', () => this.giveCard('red'));
    document.getElementById('injure-btn')?.addEventListener('click', () => this.injurePlayer());
    document.getElementById('give-ball-btn')?.addEventListener('click', () => this.giveBall());
    
    // Testing tools
    document.getElementById('toggle-debug-btn')?.addEventListener('click', () => debugConsole.toggleConsole());
    document.getElementById('toggle-performance-btn')?.addEventListener('click', () => performanceMonitor.toggle());
    document.getElementById('generate-test-match-btn')?.addEventListener('click', () => this.generateTestMatch());
    document.getElementById('god-mode-check')?.addEventListener('change', (e) => this.toggleGodMode(e.target.checked));
  }
  
  /**
   * Prompt for admin access
   */
  promptAccess() {
    if (this.isEnabled) {
      this.togglePanel();
      return;
    }
    
    const password = prompt('Enter developer password:');
    
    if (password === this.adminPassword) {
      this.enableAccess();
      this.togglePanel(true);
    } else if (password !== null) {
      alert('Invalid password');
    }
  }
  
  /**
   * Enable admin access
   */
  enableAccess() {
    if (this.isEnabled) return;
    
    this.isEnabled = true;
    debugConsole.info('Developer testing access enabled');
    
    // Add admin badge to page
    const badge = document.createElement('div');
    badge.id = 'admin-badge';
    badge.textContent = 'DEV MODE';
    badge.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      background-color: #f44336;
      color: white;
      font-family: sans-serif;
      font-size: 12px;
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 4px;
      z-index: 9999;
      cursor: pointer;
    `;
    badge.onclick = () => this.togglePanel();
    
    document.body.appendChild(badge);
  }
  
  /**
   * Toggle admin panel visibility
   * @param {boolean} show - Force show/hide state
   */
  togglePanel(show) {
    const panel = document.getElementById('admin-panel');
    
    if (panel) {
      if (show === undefined) {
        // Toggle current state
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      } else {
        // Force state
        panel.style.display = show ? 'block' : 'none';
      }
      
      // Update player select if showing
      if (panel.style.display === 'block') {
        this.updatePlayerSelect();
      }
    }
  }
  
  /**
   * Update player select dropdown with current players
   */
  updatePlayerSelect() {
    if (!this.gameEngine) return;
    
    const select = document.getElementById('player-select');
    if (!select) return;
    
    // Clear existing options except the first one
    while (select.options.length > 1) {
      select.remove(1);
    }
    
    // Get all players from both teams
    const homeTeam = this.gameEngine.getCurrentTeam();
    const awayTeam = this.gameEngine.getBoard()[0][0]?.cards[0]?.player.team;
    
    if (!homeTeam || !awayTeam) return;
    
    // Add home team players
    const homeOptgroup = document.createElement('optgroup');
    homeOptgroup.label = `${homeTeam.name} (Home)`;
    
    homeTeam.players.forEach(player => {
      const option = document.createElement('option');
      option.value = `home_${player.id}`;
      option.textContent = `${player.name} (${player.position})`;
      homeOptgroup.appendChild(option);
    });
    
    select.appendChild(homeOptgroup);
    
    // Add away team players
    const awayOptgroup = document.createElement('optgroup');
    awayOptgroup.label = `${awayTeam.name} (Away)`;
    
    awayTeam.players.forEach(player => {
      const option = document.createElement('option');
      option.value = `away_${player.id}`;
      option.textContent = `${player.name} (${player.position})`;
      awayOptgroup.appendChild(option);
    });
    
    select.appendChild(awayOptgroup);
  }
  
  /**
   * Set the game engine reference
   * @param {object} engine - Game engine instance
   */
  setGameEngine(engine) {
    this.gameEngine = engine;
    debugConsole.info('Game engine reference set in testing access');
  }
  
  /**
   * Reset the game
   */
  resetGame() {
    if (!this.gameEngine) return;
    
    // This would typically recreate the game with the same teams
    debugConsole.info('Game reset requested through admin panel');
    
    // Dispatch a custom event that the game component can listen for
    const event = new CustomEvent('admin-reset-game');
    document.dispatchEvent(event);
  }
  
  /**
   * Add a goal to the specified team
   * @param {number} teamIndex - Index of team to add goal to (0 for home, 1 for away)
   */
  addGoal(teamIndex) {
    if (!this.gameEngine) return;
    
    debugConsole.info(`Adding goal for team ${teamIndex}`);
    
    // Dispatch a custom event that the game component can listen for
    const event = new CustomEvent('admin-add-goal', {
      detail: { teamIndex }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Toggle the current team's turn
   */
  toggleTurn() {
    if (!this.gameEngine) return;
    
    debugConsole.info('Toggling team turn');
    
    // Dispatch a custom event that the game component can listen for
    const event = new CustomEvent('admin-toggle-turn');
    document.dispatchEvent(event);
  }
  
  /**
   * Toggle unlimited moves
   */
  toggleUnlimitedMoves() {
    if (!this.gameEngine) return;
    
    debugConsole.info('Toggling unlimited moves');
    
    // Dispatch a custom event that the game component can listen for
    const event = new CustomEvent('admin-toggle-unlimited-moves');
    document.dispatchEvent(event);
  }
  
  /**
   * Heal all players (remove injuries)
   */
  healAllPlayers() {
    if (!this.gameEngine) return;
    
    debugConsole.info('Healing all players');
    
    // Dispatch a custom event that the game component can listen for
    const event = new CustomEvent('admin-heal-all-players');
    document.dispatchEvent(event);
  }
  
  /**
   * Reset all cards (remove yellow/red cards)
   */
  resetAllCards() {
    if (!this.gameEngine) return;
    
    debugConsole.info('Resetting all cards');
    
    // Dispatch a custom event that the game component can listen for
    const event = new CustomEvent('admin-reset-all-cards');
    document.dispatchEvent(event);
  }
  
  /**
   * Give a card to the selected player
   * @param {string} cardType - Type of card ('yellow' or 'red')
   */
  giveCard(cardType) {
    if (!this.gameEngine) return;
    
    const playerSelect = document.getElementById('player-select');
    if (!playerSelect || !playerSelect.value) {
      alert('Please select a player');
      return;
    }
    
    debugConsole.info(`Giving ${cardType} card to player ${playerSelect.value}`);
    
    // Dispatch a custom event that the game component can listen for
    const event = new CustomEvent('admin-give-card', {
      detail: { 
        playerId: playerSelect.value,
        cardType 
      }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Injure the selected player
   */
  injurePlayer() {
    if (!this.gameEngine) return;
    
    const playerSelect = document.getElementById('player-select');
    if (!playerSelect || !playerSelect.value) {
      alert('Please select a player');
      return;
    }
    
    const injuryType = prompt('Enter injury type (minor, serious, unable_to_continue):');
    if (!injuryType) return;
    
    debugConsole.info(`Injuring player ${playerSelect.value} with ${injuryType} injury`);
    
    // Dispatch a custom event that the game component can listen for
    const event = new CustomEvent('admin-injure-player', {
      detail: { 
        playerId: playerSelect.value,
        injuryType 
      }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Give the ball to the selected player
   */
  giveBall() {
    if (!this.gameEngine) return;
    
    const playerSelect = document.getElementById('player-select');
    if (!playerSelect || !playerSelect.value) {
      alert('Please select a player');
      return;
    }
    
    debugConsole.info(`Giving ball to player ${playerSelect.value}`);
    
    // Dispatch a custom event that the game component can listen for
    const event = new CustomEvent('admin-give-ball', {
      detail: { playerId: playerSelect.value }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Generate a test match with random events
   */
  generateTestMatch() {
    if (!this.gameEngine) return;
    
    debugConsole.info('Generating test match');
    
    // Get current teams from game engine
    const homeTeam = this.gameEngine.getCurrentTeam();
    const awayTeam = this.gameEngine.getBoard()[0][0]?.cards[0]?.player.team;
    
    if (!homeTeam || !awayTeam) {
      alert('Cannot generate test match: teams not found');
      return;
    }
    
    // Generate mock match
    const mockMatch = generateMockMatch(homeTeam, awayTeam, 30);
    
    // Display mock match results
    alert(`Test match generated:\n${homeTeam.name} ${mockMatch.finalScore[0]} - ${mockMatch.finalScore[1]} ${awayTeam.name}\nTotal actions: ${mockMatch.actions.length}`);
    
    // Log full match data to console
    debugConsole.info('Test match data:', mockMatch);
    console.log('Test match data:', mockMatch);
  }
  
  /**
   * Toggle god mode (no rules)
   * @param {boolean} enabled - Whether god mode is enabled
   */
  toggleGodMode(enabled) {
    if (!this.gameEngine) return;
    
    debugConsole.info(`${enabled ? 'Enabling' : 'Disabling'} god mode`);
    
    // Dispatch a custom event that the game component can listen for
    const event = new CustomEvent('admin-toggle-god-mode', {
      detail: { enabled }
    });
    document.dispatchEvent(event);
  }
}

// Create singleton instance
const testingAccess = new TestingAccess();

// Export the singleton
module.exports = testingAccess;
