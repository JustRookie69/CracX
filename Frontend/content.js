class VideoDetector {
  constructor() {
    this.isTracking = true; //enable/disable tracking
    this.currentVideo = null;
    this.lastVideoData = null;
    this.observers = [];
    this.checkInterval = null;
    this.init();
  }

  init() {
    console.log('Smart Learning Tracker: Content script initialized');
    this.loadTrackingState();
    this.setupMessageListener();
    this.startVideoDetection();
  }

  async loadTrackingState() {
    try {
      const result = await chrome.storage.local.get(['isTracking']);
      this.isTracking = result.isTracking !== false;
      console.log('Tracking state loaded:', this.isTracking);
    } catch (error) {
      console.error('Error loading tracking state:', error);
    }
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Content script received message:', message);
      
      switch (message.action) {
        case 'getVideoStatus':
          const videoData = this.getCurrentVideoData();
          sendResponse({ videoData });
          break;
          
        case 'toggleTracking':
          this.isTracking = message.isTracking;
          console.log('Tracking toggled:', this.isTracking);
          if (!this.isTracking) {
            this.stopVideoDetection();
          } else {
            this.startVideoDetection();
          }
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ error: 'Unknown action' });
      }
      
      return true; // Keep message channel open for async response
    });
  }

  startVideoDetection() {
    if (!this.isTracking) return;
    
    console.log('Starting video detection...');
    
    // Clear existing detection
    this.stopVideoDetection();
    
    // Start periodic checks
    this.checkInterval = setInterval(() => {
      this.detectVideos();
    }, 1000);
    
    // Initial detection
    this.detectVideos();
    
    // Setup observers for dynamic content
    this.setupObservers();
  }

  stopVideoDetection() {
    console.log('Stopping video detection...');
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    
    this.currentVideo = null;
  }

  detectVideos() {
    if (!this.isTracking) return;
    
    // Try multiple video detection methods
    const video = this.findActiveVideo();
    
    if (video && !video.paused && video.currentTime > 0) {
      if (this.currentVideo !== video) {
        this.currentVideo = video;
        console.log('New video detected:', this.getVideoInfo(video));
        this.notifyVideoChange();
      }
    } else {
      if (this.currentVideo) {
        console.log('Video stopped or paused');
        this.currentVideo = null;
        this.notifyVideoChange();
      }
    }
  }

  findActiveVideo() {
    // Method 1: Find HTML5 video elements
    const videos = document.querySelectorAll('video');
    
    for (const video of videos) {
      if (this.isVideoPlaying(video)) {
        return video;
      }
    }
    
    // Method 2: Platform-specific detection
    return this.detectPlatformSpecificVideo();
  }

  isVideoPlaying(video) {
    return video && 
           !video.paused && 
           !video.ended && 
           video.currentTime > 0 && 
           video.readyState > 2 &&
           video.videoWidth > 0 &&
           video.videoHeight > 0;
  }

  detectPlatformSpecificVideo() {
    const hostname = window.location.hostname.toLowerCase();
    
    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return this.detectYouTubeVideo();
    }
    
    // Vimeo
    if (hostname.includes('vimeo.com')) {
      return this.detectVimeoVideo();
    }
    
    // Twitch
    if (hostname.includes('twitch.tv')) {
      return this.detectTwitchVideo();
    }
    
    // Netflix
    if (hostname.includes('netflix.com')) {
      return this.detectNetflixVideo();
    }
    
    // Generic HTML5 video
    return document.querySelector('video[src], video source');
  }

  detectYouTubeVideo() {
    // YouTube uses multiple video elements, find the main one
    const videos = document.querySelectorAll('video');
    
    for (const video of videos) {
      const rect = video.getBoundingClientRect();
      if (rect.width > 200 && rect.height > 150 && this.isVideoPlaying(video)) {
        return video;
      }
    }
    
    return null;
  }

  detectVimeoVideo() {
    return document.querySelector('video[data-ready="true"]') || 
           document.querySelector('.vp-video video');
  }

  detectTwitchVideo() {
    return document.querySelector('video[data-a-target="video-player"]') ||
           document.querySelector('.video-player video');
  }

  detectNetflixVideo() {
    return document.querySelector('.VideoContainer video') ||
           document.querySelector('[data-testid="video-player"] video');
  }

  getCurrentVideoData() {
    if (!this.currentVideo || !this.isTracking) {
      return null;
    }
    
    const videoInfo = this.getVideoInfo(this.currentVideo);
    this.lastVideoData = videoInfo;
    return videoInfo;
  }

  getVideoInfo(video) {
    if (!video) return null;
    
    const platform = this.detectPlatform();
    const title = this.getVideoTitle();
    const url = window.location.href;
    
    return {
      title: title || 'Unknown Video',
      platform: platform,
      url: url,
      duration: video.duration || 0,
      currentTime: video.currentTime || 0,
      isPlaying: !video.paused && !video.ended,
      videoWidth: video.videoWidth || 0,
      videoHeight: video.videoHeight || 0,
      volume: video.volume || 0,
      playbackRate: video.playbackRate || 1,
      timestamp: new Date().toISOString()
    };
  }

  detectPlatform() {
    const hostname = window.location.hostname.toLowerCase();
    
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'YouTube';
    } else if (hostname.includes('vimeo.com')) {
      return 'Vimeo';
    } else if (hostname.includes('twitch.tv')) {
      return 'Twitch';
    } else if (hostname.includes('netflix.com')) {
      return 'Netflix';
    } else if (hostname.includes('amazon.') && hostname.includes('prime')) {
      return 'Amazon Prime';
    } else if (hostname.includes('hulu.com')) {
      return 'Hulu';
    } else if (hostname.includes('disney')) {
      return 'Disney+';
    } else if (hostname.includes('khanacademy.org')) {
      return 'Khan Academy';
    } else if (hostname.includes('coursera.org')) {
      return 'Coursera';
    } else if (hostname.includes('udemy.com')) {
      return 'Udemy';
    } else if (hostname.includes('edx.org')) {
      return 'edX';
    } else {
      return this.capitalizeFirstLetter(hostname.replace('www.', '').split('.')[0]);
    }
  }

  getVideoTitle() {
    const hostname = window.location.hostname.toLowerCase();
    
    // YouTube
    if (hostname.includes('youtube.com')) {
      return document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent?.trim() ||
             document.querySelector('[data-title]')?.getAttribute('data-title') ||
             document.querySelector('meta[name="title"]')?.content ||
             document.title;
    }
    
    // Vimeo
    if (hostname.includes('vimeo.com')) {
      return document.querySelector('.clip-header h1')?.textContent?.trim() ||
             document.querySelector('meta[property="og:title"]')?.content ||
             document.title;
    }
    
    // Netflix
    if (hostname.includes('netflix.com')) {
      return document.querySelector('.video-title')?.textContent?.trim() ||
             document.querySelector('meta[property="og:title"]')?.content ||
             document.title;
    }
    
    // Generic fallback
    return document.querySelector('meta[property="og:title"]')?.content ||
           document.querySelector('meta[name="title"]')?.content ||
           document.querySelector('title')?.textContent ||
           'Unknown Video';
  }

  setupObservers() {
    // Observe DOM changes for dynamically loaded videos
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.tagName === 'VIDEO' || node.querySelector('video')) {
                shouldCheck = true;
              }
            }
          });
        }
      });
      
      if (shouldCheck) {
        setTimeout(() => this.detectVideos(), 500);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    this.observers.push(observer);
  }

  notifyVideoChange() {
    // Send message to background script about video change
    const videoData = this.getCurrentVideoData();
    
    chrome.runtime.sendMessage({
      action: 'videoStatusChanged',
      videoData: videoData,
      timestamp: new Date().toISOString()
    }).catch(error => {
      console.log('Could not send message to background script:', error);
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

// Initialize video detector when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new VideoDetector();
  });
} else {
  new VideoDetector();
}