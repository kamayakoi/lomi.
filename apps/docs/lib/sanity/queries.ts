/* @proprietary license */

import { client } from './client';
import type { Post } from './types';

// Get all posts
export async function getAllPosts(): Promise<Post[]> {
  try {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      title_fr,
      slug,
      publishedAt,
      excerpt,
      excerpt_fr,
      "tags": tags,
      "languages": languages,
      "image": image {
        asset->,
        alt,
        caption
      },
      "mainImage": image {
        asset->,
        alt,
        caption
      },
      "category": category,
      "categories": categories[] {
        _id,
        title,
        slug
      },
      "author": author->{
        _id,
        name,
        "image": image{
          asset->,
          alt
        },
        bio,
        role
      },
      featured,
      body
    }`;
    const result = await client.fetch(query);
    return result || [];
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<Post> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      title_fr,
      slug,
      publishedAt,
      excerpt,
      excerpt_fr,
      "tags": tags,
      "languages": languages,
      "image": image {
        asset->,
        alt,
        caption
      },
      "mainImage": image {
        asset->,
        alt,
        caption
      },
      "category": category,
      "categories": categories[] {
        _id,
        title,
        slug
      },
      "author": author->{
        _id,
        name,
        "image": image{
          asset->,
          alt
        },
        bio,
        role
      },
      featured,
      body,
      body_fr
    }`,
    { slug },
  );
}

// Get featured posts (most recent 3)
export async function getFeaturedPosts(): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc)[0...3] {
      _id,
      title,
      title_fr,
      slug,
      publishedAt,
      excerpt,
      excerpt_fr,
      "tags": tags,
      "languages": languages,
      "image": image {
        asset->,
        alt,
        caption
      },
      "mainImage": image {
        asset->,
        alt,
        caption
      },
      "category": category,
      "categories": categories[] {
        _id,
        title,
        slug
      }
    }`,
  );
}

// Get posts by tag - modified to use a different query approach that doesn't require params
export async function getPostsByTag(tagValue: string): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post" && "${tagValue}" in tags] | order(publishedAt desc) {
      _id,
      title,
      title_fr,
      slug,
      publishedAt,
      excerpt,
      excerpt_fr,
      "tags": tags,
      "languages": languages,
      "image": image {
        asset->,
        alt,
        caption
      },
      "mainImage": image {
        asset->,
        alt,
        caption
      },
      "category": category,
      "categories": categories[] {
        _id,
        title,
        slug
      },
      "author": author->{
        _id,
        name,
        "image": image{
          asset->,
          alt
        },
        bio,
        role
      }
    }`,
  );
}
