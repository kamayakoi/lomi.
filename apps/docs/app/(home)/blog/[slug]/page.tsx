/* @proprietary license */

import type { Metadata } from 'next';
import BlogPostClient from '@/components/blog/blog-post-client';
import { client } from '@/lib/sanity/client';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(
    `*[_type == "post" && defined(slug.current)][].slug.current`,
  );

  const slugsArray = Array.isArray(slugs) ? slugs : [];
  return slugsArray.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);

  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        title,
        excerpt
      }`,
      { slug },
    );

    if (post) {
      // Get the base URL for absolute OG image URLs
      const headersList = await headers();
      const host = headersList.get('host') || 'lomi.so';
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const baseUrl = `${protocol}://${host}`;

      // Use the og-image API endpoint for optimized OG images
      const ogImageUrl = `${baseUrl}/api/blog/og-image/${slug}`;

      return {
        title: `${post.title} | lomi.`,
        description: post.excerpt || 'Read our latest blog post',
        openGraph: {
          title: `${post.title} | lomi.`,
          description: post.excerpt || 'Read our latest blog post',
          url: `${baseUrl}/blog/${slug}`,
          type: 'article',
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${post.title} | lomi.`,
          description: post.excerpt || 'Read our latest blog post',
          images: [ogImageUrl],
        },
      };
    }
  } catch (error) {
    console.error('Error fetching post metadata:', error);
  }

  return {
    title: 'lomi. | Blog post',
  };
}

// Server component that renders the client component
export default async function BlogPost({ params }: PageProps) {
  const { slug } = await Promise.resolve(params);
  return (
    <main className="flex-1 pt-0">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_10%,transparent_0%,var(--background)_75%)]"></div>

        <BlogPostClient slug={slug} />
      </div>
    </main>
  );
}
