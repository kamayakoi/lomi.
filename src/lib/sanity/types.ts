import { PortableTextBlock } from "@portabletext/types";
import { SanityImageAssetDocument } from "@sanity/client";

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
  title_es?: string;
  title_pt?: string;
  title_zh?: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  image?: SanityImage;
  mainImage?: SanityImage;
  body: PortableTextBlock[];
  body_fr?: PortableTextBlock[];
  body_es?: PortableTextBlock[];
  body_pt?: PortableTextBlock[];
  body_zh?: PortableTextBlock[];
  excerpt?: string;
  excerpt_fr?: string;
  excerpt_es?: string;
  excerpt_pt?: string;
  excerpt_zh?: string;
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
} 