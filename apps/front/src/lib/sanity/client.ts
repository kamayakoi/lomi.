import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Use environment variables or fallback to hardcoded values for development
const projectId = import.meta.env["SANITY_PROJECT_ID"] || "ba8q9y9v";
const dataset = import.meta.env["SANITY_DATASET"] || "production";
const apiVersion = import.meta.env["SANITY_API_VERSION"] || "2024-03-01";
const token = import.meta.env["SANITY_TOKEN"];

// For debugging
console.log("Sanity Configuration:", { 
  projectId, 
  dataset, 
  apiVersion, 
  hasToken: !!token 
});

// Determine environment
const isDevelopment = import.meta.env.DEV;
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !isDevelopment, // Use CDN in production, not in development
  token, // Include token for authenticated requests
  perspective: 'published', // Only fetch published content
  stega: false, // Disable stega in development
  withCredentials: !isLocalhost, // Only use credentials for non-localhost domains
});

// Enhanced image builder with improved defaults
const builder = imageUrlBuilder(client);

// Improved image URL helper with better defaults and options
export const urlFor = (source: SanityImageSource, options?: { width?: number, height?: number, quality?: number }) => {
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