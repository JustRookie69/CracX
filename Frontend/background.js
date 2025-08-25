class BackgroundService {
  constructor() {
    this.videoSessions = new Map();
    this.currentSession = null;
    this.init();
  }

  init() {
    console.log('Smart Learning Tracker: Background service initialized');
    this.setupMessageListener();
    this.setupInstallListener();
    this.setupTabListeners();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Background: Received message', message);
      
      switch (message.action) {
        case 'videoStatusChanged':
          this.handleVideoStatusChange(message.videoData, sender.tab);
          sendResponse({ success: true });
          break;
          
        case 'getVideoSessions':
          sendResponse({ sessions: Array.from(this.videoSessions.values()) });
          break;
          
        case 'clearVideoHistory':
          this.videoSessions.clear();
          this.saveVideoSessions();
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ error: 'Unknown action' });
      }
      
      return true;
    });
  }

  setupInstallListener() {
    chrome.runtime.onInstalled.addListener((details) => {
      console.log('Extension installed/updated:', details.reason);
      
      if (details.reason === 'install') {
        this.handleFirstInstall();
      } else if (details.reason === 'update') {
        this.handleUpdate(details.previousVersion);
      }
    });
  }

  setupTabListeners() {
    // Listen for tab updates to track navigation
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.handleTabUpdate(tabId, tab);
      }
    });

    // Listen for tab activation
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabActivated(activeInfo.tabId);
    });
  }

  handleVideoStatusChange(videoData, tab) {
    console.log('Video status changed:', videoData);
    
    if (videoData) {
      // Video is playing
      this.startVideoSession(videoData, tab);
    } else {
      // Video stopped
      this.endCurrentSession();
    }
    
    // Update badge
    this.updateBadge(videoData ? 'LIVE' : '');
  }

  startVideoSession(videoData, tab) {
    const sessionId = `${tab.id}_${Date.now()}`;
    
    // End previous session if exists
    if (this.currentSession) {
      this.endCurrentSession();
    }
    
    const session = {
      id: sessionId,
      tabId: tab.id,
      startTime: new Date().toISOString(),
      endTime: null,
      videoData: videoData,
      platform: videoData.platform,
      title: videoData.title,
      url: videoData.url,
      totalWatchTime: 0,
      lastUpdateTime: Date.now(),
      isActive: true
    };
    
    this.currentSession = session;
    this.videoSessions.set(sessionId, session);
    
    console.log('Started video session:', sessionId);
    
    // Start tracking watch time
    this.startWatchTimeTracking(sessionId);
    
    // Save to storage
    this.saveVideoSessions();
  }

  endCurrentSession() {
    if (this.currentSession) {
      const session = this.currentSession;
      session.endTime = new Date().toISOString();
      session.isActive = false;
      
      // Calculate final watch time
      const now = Date.now();
      const timeDiff = (now - session.lastUpdateTime) / 1000;
      if (timeDiff < 10) { // Only add if less than 10 seconds (avoid counting paused time)
        session.totalWatchTime += timeDiff;
      }
      
      console.log('Ended video session:', session.id, 'Total watch time:', session.totalWatchTime);
      
      this.videoSessions.set(session.id, session);
      this.currentSession = null;
      
      // Save to storage
      this.saveVideoSessions();
    }
  }

  startWatchTimeTracking(sessionId) {
    const trackingInterval = setInterval(() => {
      const session = this.videoSessions.get(sessionId);
      
      if (!session || !session.isActive) {
        clearInterval(trackingInterval);
        return;
      }
      
      // Update watch time (add 1 second)
      session.totalWatchTime += 1;
      session.lastUpdateTime = Date.now();
      
      // Update session
      this.videoSessions.set(sessionId, session);
      
      // Save every 10 seconds
      if (session.totalWatchTime % 10 === 0) {
        this.saveVideoSessions();
      }
      
    }, 1000);
  }

  async saveVideoSessions() {
    try {
      const sessionsArray = Array.from(this.videoSessions.entries());
      await chrome.storage.local.set({ 
        videoSessions: sessionsArray,
        lastSaved: new Date().toISOString()
      });
      console.log('Video sessions saved:', sessionsArray.length);
    } catch (error) {
      console.error('Error saving video sessions:', error);
    }
  }

  async loadVideoSessions() {
    try {
      const result = await chrome.storage.local.get(['videoSessions']);
      if (result.videoSessions) {
        this.videoSessions = new Map(result.videoSessions);
        console.log('Video sessions loaded:', this.videoSessions.size);
      }
    } catch (error) {
      console.error('Error loading video sessions:', error);
    }
  }

  updateBadge(text) {
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ 
      color: text === 'LIVE' ? '#00ff88' : '#ff6b6b' 
    });
  }

  handleTabUpdate(tabId, tab) {
    // If current session is on this tab and URL changed significantly,
    // it might be a new video
    if (this.currentSession && this.currentSession.tabId === tabId) {
      const currentUrl = this.currentSession.url;
      const newUrl = tab.url;
      
      // Check if it's a different video (simple URL comparison)
      if (currentUrl && newUrl && this.isDifferentVideo(currentUrl, newUrl)) {
        console.log('URL changed significantly, ending current session');
        this.endCurrentSession();
      }
    }
  }

  handleTabActivated(tabId) {
    // Could be used to pause/resume tracking based on active tab
    console.log('Tab activated:', tabId);
  }

  isDifferentVideo(oldUrl, newUrl) {
    try {
      const oldUrlObj = new URL(oldUrl);
      const newUrlObj = new URL(newUrl);
      
      // Different domains
      if (oldUrlObj.hostname !== newUrlObj.hostname) {
        return true;
      }
      
      // YouTube video ID changed
      if (oldUrlObj.hostname.includes('youtube.com')) {
        const oldVideoId = oldUrlObj.searchParams.get('v');
        const newVideoId = newUrlObj.searchParams.get('v');
        return oldVideoId !== newVideoId;
      }
      
      // Different paths (for other platforms)
      if (oldUrlObj.pathname !== newUrlObj.pathname) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error comparing URLs:', error);
      return false;
    }
  }

  handleFirstInstall() {
    console.log('Extension installed for the first time');
    
    // Set default settings
    chrome.storage.local.set({
      isTracking: true,
      firstInstall: new Date().toISOString(),
      settings: {
        autoQuiz: true,
        notifications: true,
        minWatchTime: 60 // seconds
      }
    });
    
    // Show welcome notification
    this.showNotification('Welcome to Smart Learning Tracker!', 
      'Start watching educational videos to begin tracking your learning progress.');
  }

  handleUpdate(previousVersion) {
    console.log('Extension updated from version:', previousVersion);
    
    // Load existing sessions
    this.loadVideoSessions();
  }

  showNotification(title, message) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: title,
      message: message
    });
  }

  // Get statistics for popup/dashboard
  getSessionStats() {
    const sessions = Array.from(this.videoSessions.values());
    
    const stats = {
      totalSessions: sessions.length,
      totalWatchTime: sessions.reduce((sum, session) => sum + session.totalWatchTime, 0),
      platforms: {},
      todaysSessions: 0,
      thisWeekSessions: 0
    };
    
    const today = new Date().toDateString();
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    sessions.forEach(session => {
      // Platform stats
      const platform = session.platform || 'Unknown';
      stats.platforms[platform] = (stats.platforms[platform] || 0) + 1;
      
      // Today's sessions
      const sessionDate = new Date(session.startTime).toDateString();
      if (sessionDate === today) {
        stats.todaysSessions++;
      }
      
      // This week's sessions
      const sessionTime = new Date(session.startTime).getTime();
      if (sessionTime > weekAgo) {
        stats.thisWeekSessions++;
      }
    });
    
    return stats;
  }
}

// Initialize background service
const backgroundService = new BackgroundService();