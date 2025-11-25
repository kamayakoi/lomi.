/* @proprietary license */

import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/sanity/queries';

export async function GET() {
  try {
    const posts = await getAllPosts();

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('API Route: Error fetching posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
