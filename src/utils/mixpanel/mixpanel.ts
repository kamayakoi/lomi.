import mixpanel from 'mixpanel-browser';

// Replace YOUR_TOKEN with your actual Mixpanel token
// We'll use an environment variable for this
const MIXPANEL_TOKEN = import.meta.env['VITE_MIXPANEL_TOKEN'] || '';

/**
 * Mixpanel utility for tracking events and user identification
 */
class MixpanelService {
  private initialized = false;

  /**
   * Initialize Mixpanel with the project token
   */
  init() {
    if (!MIXPANEL_TOKEN) {
      console.warn('Mixpanel token is missing! Check your .env file.');
      return;
    }

    try {
      mixpanel.init(MIXPANEL_TOKEN, { 
        debug: import.meta.env['DEV'],
        track_pageview: true,
        persistence: 'localStorage',
        api_host: "https://api.mixpanel.com",
      });
      this.initialized = true;
      console.log('Mixpanel initialized with token:', MIXPANEL_TOKEN);
    } catch (error) {
      console.error('Failed to initialize Mixpanel:', error);
    }
  }

  /**
   * Get accurate operating system information
   * @returns The detected operating system
   */
  getOperatingSystem(): string {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Check for macOS
    if (platform.indexOf('Mac') !== -1) return 'MacOS';
    
    // Check for Windows
    if (platform.indexOf('Win') !== -1) return 'Windows';
    
    // Check for Linux
    if (platform.indexOf('Linux') !== -1 && userAgent.indexOf('Android') === -1) return 'Linux';
    
    // Check for iOS devices
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) return 'iOS';
    
    // Check for Android
    if (userAgent.indexOf('Android') !== -1) return 'Android';
    
    return 'Unknown';
  }

  /**
   * Track an event in Mixpanel
   * @param eventName - Name of the event to track
   * @param properties - Additional properties to include with the event
   */
  track(eventName: string, properties?: Record<string, any>) {
    console.log('Tracking event:', eventName, properties);
    if (!this.initialized) {
      this.init();
    }

    try {
      // Add operating system info to all events
      const enhancedProperties = {
        ...properties,
        operating_system: this.getOperatingSystem(),
      };
      
      mixpanel.track(eventName, enhancedProperties);
    } catch (error) {
      console.error(`Failed to track event ${eventName}:`, error);
    }
  }

  /**
   * Identify a user in Mixpanel
   * @param userId - Unique identifier for the user
   * @param userProperties - Additional properties about the user
   */
  identify(userId: string, userProperties?: Record<string, any>) {
    if (!this.initialized) {
      this.init();
    }

    try {
      mixpanel.identify(userId);
      if (userProperties) {
        // Add operating system info to user properties
        const enhancedProperties = {
          ...userProperties,
          operating_system: this.getOperatingSystem(),
        };
        
        mixpanel.people.set(enhancedProperties);
      }
    } catch (error) {
      console.error(`Failed to identify user ${userId}:`, error);
    }
  }

  /**
   * Track a page view in Mixpanel
   * @param pageName - Name of the page being viewed
   * @param properties - Additional properties to include with the event
   */
  trackPageView(pageName: string, properties?: Record<string, any>) {
    this.track('Page View', {
      page_name: pageName,
      url: window.location.href,
      ...properties
    });
  }

  /**
   * Reset the current user's identity
   */
  reset() {
    if (!this.initialized) {
      return;
    }

    try {
      mixpanel.reset();
    } catch (error) {
      console.error('Failed to reset Mixpanel user:', error);
    }
  }
}

// Create a singleton instance
const mixpanelService = new MixpanelService();

export default mixpanelService; 