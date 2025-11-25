/* @proprietary license */

import { getPostBySlug } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';
import type { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return Response.json(
        { error: 'Slug parameter is required' },
        { status: 400 },
      );
    }

    const post = await getPostBySlug(slug);

    if (!post) {
      // Return default lomi banner for non-existent posts
      return new Response(null, {
        status: 302,
        headers: {
          Location:
            'https://res.cloudinary.com/dzrdlevfn/image/upload/v1759315964/x_banner_vu16vp.webp',
        },
      });
    }

    // Try to get the post's main image
    let imageUrl: string;

    if (post.image) {
      // Use the post's primary image, optimized for OG
      imageUrl = urlFor(post.image, {
        width: 1200,
        height: 630,
        quality: 90,
      }).url();
    } else if (post.mainImage) {
      // Fallback to mainImage if image doesn't exist
      imageUrl = urlFor(post.mainImage, {
        width: 1200,
        height: 630,
        quality: 90,
      }).url();
    } else {
      // No image found, use default banner
      imageUrl =
        'https://res.cloudinary.com/dzrdlevfn/image/upload/v1759315964/x_banner_vu16vp.webp';
    }

    // Set cache headers and redirect to the image
    return new Response(null, {
      status: 302,
      headers: {
        Location: imageUrl,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[OG Image API] Error getting image:', error);

    // Fallback to default lomi banner
    return new Response(null, {
      status: 302,
      headers: {
        Location:
          'https://res.cloudinary.com/dzrdlevfn/image/upload/v1759315964/x_banner_vu16vp.webp',
      },
    });
  }
}
