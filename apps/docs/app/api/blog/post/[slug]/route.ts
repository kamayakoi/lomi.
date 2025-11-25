/* @proprietary license */

import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/sanity/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('API Route: Error fetching post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
