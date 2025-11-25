/* @proprietary license */

import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { apiVersion, dataset, projectId } from './env';

// Client configured for static generation
export const client = createClient({
  projectId: projectId(),
  dataset: dataset(),
  apiVersion,
  useCdn: true, // Use CDN for better performance and caching
  token: process.env.SANITY_API_TOKEN, // Include token for authenticated requests
  perspective: 'published', // Only fetch published content
  stega: false,
});

// Enhanced image builder with improved defaults
const builder = imageUrlBuilder(client);

// Improved image URL helper with better defaults and options
export const urlFor = (
  source: SanityImageSource,
  options?: { width?: number; height?: number; quality?: number },
) => {
  if (!source) return builder.image({});

  let imageBuilder = builder.image(source);

  // Apply options if provided
  if (options) {
    if (options.width) imageBuilder = imageBuilder.width(options.width);
    if (options.height) imageBuilder = imageBuilder.height(options.height);
    if (options.quality) imageBuilder = imageBuilder.quality(options.quality);
  }

  // Always ensure proper format and auto-optimization
  imageBuilder = imageBuilder.format('webp').auto('format');

  return imageBuilder;
};
