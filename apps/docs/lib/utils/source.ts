/* @proprietary license */

// import { createMDXSource } from 'fumadocs-mdx';
import type {
  InferMetaType,
  InferPageType,
  Source,
} from 'fumadocs-core/source';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { transformerOpenAPI } from 'fumadocs-openapi/server';
import { createElement } from 'react';
import { docs } from '@/.source/server';

export const source = loader({
  baseUrl: '/',
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
  source: docs.toFumadocsSource() as Source,
  pageTree: {
    transformers: [transformerOpenAPI()],
  },
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
