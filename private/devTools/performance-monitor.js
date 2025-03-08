/**
 * Performance Monitor
 * 
 * A developer tool for monitoring and optimizing game performance.
 */

const debugConsole = require('./debugConsole');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: {
        current: 0,
        min: Infinity,
        max: 0,
        average: 0,
        samples: []
      },
      memory: {
        current: 0,
        peak: 0
      },
      timing: {}
    };
    
    this.isMonitoring = false;
    this.fpsFrameCount = 0;
    this.fpsPreviousTime = 0;
    this.fpsUpdateInterval = 1000; // Update FPS every second
    
    // Initialize UI if in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.initUI();
    }
  }
  
  /**
   * Initialize performance monitor UI
   */
  initUI() {
    // Create monitor container if it doesn't exist
    if (!document.getElementById('performance-monitor')) {
      const container = document.createElement('div');
      container.id = 'performance-monitor';
      container.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border-radius: 5px;
        z-index: 9990;
        display: none;
        min-width: 200px;
      `;
      
      const title = document.createElement('div');
      title.textContent = 'Performance Monitor';
      title.style.cssText = `
        margin-bottom: 5px;
        font-weight: bold;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        padding-bottom: 3px;
      `;
      
      const metrics = document.createElement('div');
      metrics.id = 'performance-metrics';
      
      const fps = document.createElement('div');
      fps.id = 'fps-monitor';
      
      const memory = document.createElement('div');
      memory.id = 'memory-monitor';
      
      const timing = document.createElement('div');
      timing.id = 'timing-monitor';
      
      metrics.appendChild(fps);
      metrics.appendChild(memory);
      metrics.appendChild(timing);
      
      container.appendChild(title);
      container.appendChild(metrics);
      
      document.body.appendChild(container);
    }
  }
  
  /**
   * Start monitoring performance
   */
  start() {
    if (this.isMonitoring) return;
    
    debugConsole.info('Performance monitoring started');
    this.isMonitoring = true;
    this.fpsPreviousTime = performance.now();
    this.fpsFrameCount = 0;
    
    // Show monitor UI
    const monitor = document.getElementById('performance-monitor');
    if (monitor) {
      monitor.style.display = 'block';
    }
    
    // Start animation frame loop for FPS monitoring
    this.animationFrameId = requestAnimationFrame(this.monitorFrame.bind(this));
    
    // Start memory monitoring if available
    if (performance.memory) {
      this.memoryMonitorId = setInterval(this.monitorMemory.bind(this), 1000);
    }
  }
  
  /**
   * Stop monitoring performance
   */
  stop() {
    if (!this.isMonitoring) return;
    
    debugConsole.info('Performance monitoring stopped');
    this.isMonitoring = false;
    
    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Clear memory monitoring
    if (this.memoryMonitorId) {
      clearInterval(this.memoryMonitorId);
    }
    
    // Hide monitor UI
    const monitor = document.getElementById('performance-monitor');
    if (monitor) {
      monitor.style.display = 'none';
    }
  }
  
  /**
   * Toggle performance monitoring
   */
  toggle() {
    if (this.isMonitoring) {
      this.stop();
    } else {
      this.start();
    }
  }
  
  /**
   * Monitor a frame for FPS calculation
   */
  monitorFrame() {
    if (!this.isMonitoring) return;
    
    // Increment frame count
    this.fpsFrameCount++;
    
    // Check if it's time to update FPS
    const currentTime = performance.now();
    const elapsed = currentTime - this.fpsPreviousTime;
    
    if (elapsed >= this.fpsUpdateInterval) {
      // Calculate FPS
      const fps = Math.round((this.fpsFrameCount * 1000) / elapsed);
      
      // Update metrics
      this.metrics.fps.current = fps;
      this.metrics.fps.min = Math.min(this.metrics.fps.min, fps);
      this.metrics.fps.max = Math.max(this.metrics.fps.max, fps);
      
      // Add to samples (keep last 60 samples)
      this.metrics.fps.samples.push(fps);
      if (this.metrics.fps.samples.length > 60) {
        this.metrics.fps.samples.shift();
      }
      
      // Calculate average
      this.metrics.fps.average = Math.round(
        this.metrics.fps.samples.reduce((sum, val) => sum + val, 0) / 
        this.metrics.fps.samples.length
      );
      
      // Reset counters
      this.fpsFrameCount = 0;
      this.fpsPreviousTime = currentTime;
      
      // Update UI
      this.updateFpsUI();
      
      // Log to debug console if significant change
      if (fps < 30 && this.metrics.fps.samples.length > 10) {
        debugConsole.warn(`Low FPS detected: ${fps}`);
      }
    }
    
    // Continue monitoring
    this.animationFrameId = requestAnimationFrame(this.monitorFrame.bind(this));
  }
  
  /**
   * Monitor memory usage
   */
  monitorMemory() {
    if (!this.isMonitoring || !performance.memory) return;
    
    const memory = performance.memory;
    
    // Convert to MB for readability
    const usedHeapSizeMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
    
    // Update metrics
    this.metrics.memory.current = usedHeapSizeMB;
    this.metrics.memory.peak = Math.max(this.metrics.memory.peak, usedHeapSizeMB);
    
    // Update UI
    this.updateMemoryUI();
    
    // Log to debug console if high memory usage
    if (usedHeapSizeMB > 100) {
      debugConsole.warn(`High memory usage: ${usedHeapSizeMB} MB`);
    }
  }
  
  /**
   * Update FPS display in UI
   */
  updateFpsUI() {
    const fpsDisplay = document.getElementById('fps-monitor');
    
    if (fpsDisplay) {
      // Color coding based on FPS values
      let fpsColor;
      if (this.metrics.fps.current >= 50) {
        fpsColor = '#4caf50'; // Green for good FPS
      } else if (this.metrics.fps.current >= 30) {
        fpsColor = '#ff9800'; // Orange for marginal FPS
      } else {
        fpsColor = '#f44336'; // Red for poor FPS
      }
      
      fpsDisplay.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
          <span>FPS:</span> 
          <span style="color: ${fpsColor};">${this.metrics.fps.current}</span>
        </div>
        <div style="font-size: 10px; color: #aaa;">
          Min: ${this.metrics.fps.min === Infinity ? 'N/A' : this.metrics.fps.min} | 
          Avg: ${this.metrics.fps.average || 'N/A'} | 
          Max: ${this.metrics.fps.max || 'N/A'}
        </div>
      `;
    }
  }
  
  /**
   * Update memory display in UI
   */
  updateMemoryUI() {
    const memoryDisplay = document.getElementById('memory-monitor');
    
    if (memoryDisplay) {
      // Color coding based on memory usage
      let memoryColor;
      if (this.metrics.memory.current < 50) {
        memoryColor = '#4caf50'; // Green for low memory usage
      } else if (this.metrics.memory.current < 100) {
        memoryColor = '#ff9800'; // Orange for moderate memory usage
      } else {
        memoryColor = '#f44336'; // Red for high memory usage
      }
      
      memoryDisplay.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-top: 5px;">
          <span>Memory:</span> 
          <span style="color: ${memoryColor};">${this.metrics.memory.current} MB</span>
        </div>
        <div style="font-size: 10px; color: #aaa;">
          Peak: ${this.metrics.memory.peak} MB
        </div>
      `;
    }
  }
  
  /**
   * Start timing a specific operation
   * @param {string} name - Name of the operation to time
   */
  startTiming(name) {
    if (!this.isMonitoring) return;
    
    this.metrics.timing[name] = {
      startTime: performance.now(),
      endTime: null,
      duration: null,
      min: Infinity,
      max: 0,
      average: 0,
      count: 0,
      total: 0
    };
  }
  
  /**
   * End timing of an operation
   * @param {string} name - Name of the operation
   */
  endTiming(name) {
    if (!this.isMonitoring || !this.metrics.timing[name]) return;
    
    const timing = this.metrics.timing[name];
    timing.endTime = performance.now();
    timing.duration = timing.endTime - timing.startTime;
    
    // Update stats
    timing.count++;
    timing.total += timing.duration;
    timing.min = Math.min(timing.min, timing.duration);
    timing.max = Math.max(timing.max, timing.duration);
    timing.average = timing.total / timing.count;
    
    // Update UI
    this.updateTimingUI();
    
    // Log to debug console if slow operation
    if (timing.duration > 16.67) { // Longer than one frame at 60fps
      debugConsole.warn(`Slow operation detected: ${name} (${timing.duration.toFixed(2)}ms)`);
    }
  }
  
  /**
   * Update timing display in UI
   */
  updateTimingUI() {
    const timingDisplay = document.getElementById('timing-monitor');
    
    if (timingDisplay) {
      let html = '<div style="margin-top: 5px;">Operations:</div>';
      
      Object.entries(this.metrics.timing).forEach(([name, timing]) => {
        if (timing.count > 0) {
          // Color coding based on timing duration
          let timingColor;
          if (timing.average < 16) {
            timingColor = '#4caf50'; // Green for fast operations
          } else if (timing.average < 33) {
            timingColor = '#ff9800'; // Orange for moderate operations
          } else {
            timingColor = '#f44336'; // Red for slow operations
          }
          
          html += `
            <div style="font-size: 10px; display: flex; justify-content: space-between; margin-top: 3px;">
              <span>${name}:</span> 
              <span style="color: ${timingColor};">${timing.average.toFixed(2)}ms</span>
            </div>
          `;
        }
      });
      
      timingDisplay.innerHTML = html;
    }
  }
  
  /**
   * Get a snapshot of current performance metrics
   * @returns {object} - Performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }
  
  /**
   * Reset all performance metrics
   */
  reset() {
    this.metrics = {
      fps: {
        current: 0,
        min: Infinity,
        max: 0,
        average: 0,
        samples: []
      },
      memory: {
        current: 0,
        peak: 0
      },
      timing: {}
    };
    
    debugConsole.info('Performance metrics reset');
    
    // Update UI
    this.updateFpsUI();
    this.updateMemoryUI();
    this.updateTimingUI();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export the singleton
module.exports = performanceMonitor;
