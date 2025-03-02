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

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Don't use CDN to ensure we get the latest data
  token, // Include token for authenticated requests
  perspective: 'published', // Only fetch published content
  stega: false, // Disable stega in development
});

// Helper function to build image URLs
const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => {
  // Always return an ImageUrlBuilder even if source is null/undefined
  return source ? builder.image(source) : builder.image({});
}; 