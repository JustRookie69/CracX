class PopupController {
  constructor() {
    this.isTracking = true;
    this.currentVideoData = null;
    this.debugLog = [];
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadStoredData();
    this.requestVideoStatus();
    this.startPeriodicUpdates();
    this.addDebugLog('Popup initialized', 'success');
  }

  bindEvents() {
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
      this.requestVideoStatus();
      this.addDebugLog('Manual refresh triggered');
    });

    // Clear debug log
    document.getElementById('clearDebugBtn').addEventListener('click', () => {
      this.clearDebugLog();
    });

    // Toggle tracking
    document.getElementById('trackingToggle').addEventListener('click', () => {
      this.toggleTracking();
    });

    // Settings button
    document.getElementById('settingsBtn').addEventListener('click', () => {
      this.addDebugLog('Settings clicked (not implemented yet)');
    });
  }

  async loadStoredData() {
    try {
      const result = await chrome.storage.local.get(['isTracking', 'videoData']);
      this.isTracking = result.isTracking !== false; // Default to true
      this.updateTrackingUI();
      this.addDebugLog('Loaded stored data');
    } catch (error) {
      this.addDebugLog(`Error loading data: ${error.message}`, 'error');
    }
  }

  async requestVideoStatus() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        this.updateVideoStatus(null);
        this.addDebugLog('No active tab found', 'error');
        return;
      }

      // Send message to content script
      chrome.tabs.sendMessage(tab.id, { action: 'getVideoStatus' }, (response) => {
        if (chrome.runtime.lastError) {
          this.updateVideoStatus(null);
          this.addDebugLog(`Content script error: ${chrome.runtime.lastError.message}`, 'error');
          this.updateStatusIndicator('offline', 'Not Active');
          return;
        }

        if (response && response.videoData) {
          this.updateVideoStatus(response.videoData);
          this.updateStatusIndicator('live', 'Live Tracking');
          this.addDebugLog('Video detected and updated', 'success');
        } else {
          this.updateVideoStatus(null);
          this.updateStatusIndicator('offline', 'No Video');
          this.addDebugLog('No video currently playing');
        }
      });

    } catch (error) {
      this.addDebugLog(`Error requesting video status: ${error.message}`, 'error');
      this.updateStatusIndicator('offline', 'Error');
    }
  }

  updateVideoStatus(videoData) {
    const noVideoState = document.getElementById('noVideoState');
    const videoActiveState = document.getElementById('videoActiveState');

    if (!videoData) {
      noVideoState.classList.remove('hidden');
      videoActiveState.classList.add('hidden');
      this.currentVideoData = null;
      return;
    }

    // Update video info
    document.getElementById('videoTitle').textContent = videoData.title || 'Unknown Title';
    document.getElementById('videoPlatform').textContent = videoData.platform || 'Unknown Platform';
    document.getElementById('videoDuration').textContent = this.formatTime(videoData.duration || 0);
    document.getElementById('videoUrl').textContent = videoData.url || window.location.href;

    // Update progress
    const progress = videoData.currentTime && videoData.duration ? 
      (videoData.currentTime / videoData.duration) * 100 : 0;
    
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('currentTime').textContent = this.formatTime(videoData.currentTime || 0);
    document.getElementById('totalTime').textContent = this.formatTime(videoData.duration || 0);

    // Show video state
    noVideoState.classList.add('hidden');
    videoActiveState.classList.remove('hidden');
    
    this.currentVideoData = videoData;
  }

  updateStatusIndicator(status, text) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    statusDot.className = `status-dot ${status}`;
    statusText.textContent = text;
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  toggleTracking() {
    this.isTracking = !this.isTracking;
    this.updateTrackingUI();
    this.saveTrackingState();
    
    // Notify content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'toggleTracking', 
          isTracking: this.isTracking 
        });
      }
    });

    this.addDebugLog(`Tracking ${this.isTracking ? 'enabled' : 'disabled'}`, this.isTracking ? 'success' : 'error');
  }

  updateTrackingUI() {
    const toggleBtn = document.getElementById('trackingToggle');
    const trackingText = document.getElementById('trackingText');
    
    if (this.isTracking) {
      trackingText.textContent = '⏸️ Pause Tracking';
      toggleBtn.classList.remove('secondary');
      toggleBtn.classList.add('primary');
    } else {
      trackingText.textContent = '▶️ Resume Tracking';
      toggleBtn.classList.remove('primary');
      toggleBtn.classList.add('secondary');
    }
  }

  async saveTrackingState() {
    try {
      await chrome.storage.local.set({ isTracking: this.isTracking });
    } catch (error) {
      this.addDebugLog(`Error saving tracking state: ${error.message}`, 'error');
    }
  }

  addDebugLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      message,
      type,
      timestamp
    };
    
    this.debugLog.unshift(logEntry);
    
    // Keep only last 20 entries
    if (this.debugLog.length > 20) {
      this.debugLog = this.debugLog.slice(0, 20);
    }
    
    this.updateDebugDisplay();
  }

  updateDebugDisplay() {
    const debugLog = document.getElementById('debugLog');
    debugLog.innerHTML = '';
    
    this.debugLog.forEach(entry => {
      const div = document.createElement('div');
      div.className = `debug-item ${entry.type}`;
      div.textContent = `[${entry.timestamp}] ${entry.message}`;
      debugLog.appendChild(div);
    });
  }

  clearDebugLog() {
    this.debugLog = [];
    this.updateDebugDisplay();
    this.addDebugLog('Debug log cleared');
  }

  startPeriodicUpdates() {
    // Update video status every 3 seconds
    setInterval(() => {
      if (this.isTracking) {
        this.requestVideoStatus();
      }
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});