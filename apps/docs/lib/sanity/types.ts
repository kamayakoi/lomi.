/* @proprietary license */

import type { PortableTextBlock } from '@portabletext/types';
import type { SanityImageAssetDocument } from '@sanity/client';

interface SanityImage {
  asset: SanityImageAssetDocument;
  alt?: string;
  caption?: string;
}

interface Author {
  _id?: string;
  name: string;
  image?: {
    asset: SanityImageAssetDocument;
    alt?: string;
  };
  bio?: string;
  role?: string;
}

export interface Post {
  _id: string;
  title: string;
  title_fr?: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  image?: SanityImage;
  mainImage?: SanityImage;
  body: PortableTextBlock[];
  body_fr?: PortableTextBlock[];
  excerpt?: string;
  excerpt_fr?: string;
  tags?: string[];
  languages?: string[];
  category?: string;
  categories?: Array<{
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  }>;
  author?: Author;
  featured?: boolean;
}
