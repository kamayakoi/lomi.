import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface MetaTagsProps {
  title: string;
  description: string;
  favicon: string;
}

export const useMetaTags = ({ title, description, favicon }: MetaTagsProps) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', description);
    }

    const faviconLink = document.querySelector('link[rel="icon"]');
    if (faviconLink) {
      faviconLink.setAttribute('href', favicon);
    }
  }, [location.pathname, title, description, favicon]);
};