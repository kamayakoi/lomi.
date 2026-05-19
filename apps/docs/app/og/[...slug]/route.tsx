/* @proprietary license */

import { source } from '@/lib/utils/source';
import { notFound } from 'next/navigation';
import { generateOGImage } from '@/lib/og/mono';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  // OG images use default locale so crawlers without `lomi.language` see consistent branding.
  const page = source.getPage(slug.slice(0, -1), 'en');
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
  });
}

export function generateStaticParams(): {
  slug: string[];
}[] {
  return source.getPages('en').map((page) => ({
    slug: [...page.slugs, 'image.png'],
  }));
}
