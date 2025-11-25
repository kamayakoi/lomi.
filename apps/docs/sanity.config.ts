'use client';

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { apiVersion, dataset, projectId } from './lib/sanity/env';
import { schemaTypes } from './lib/sanity/schemaTypes';
import { structure } from './lib/sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId: projectId(),
  dataset: dataset(),
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
