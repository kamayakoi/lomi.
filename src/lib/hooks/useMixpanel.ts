import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mixpanelService from '../../utils/mixpanel/mixpanel';

/**
 * Hook to use Mixpanel in components
 * @returns Mixpanel service instance
 */
export const useMixpanel = () => {
  const location = useLocation();

  // Initialize Mixpanel on first render
  useEffect(() => {
    mixpanelService.init();
  }, []);

  // Track page views when location changes
  useEffect(() => {
    // Extract page name from pathname
    const pageName = location.pathname === '/' 
      ? 'Home' 
      : location.pathname
          .split('/')
          .filter(Boolean)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

    mixpanelService.trackPageView(pageName, {
      path: location.pathname,
      search: location.search,
      url: window.location.href,
    });
  }, [location]);

  return mixpanelService;
};

export default useMixpanel; 