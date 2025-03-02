import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'lomi.',

  projectId: 'ba8q9y9v',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  cors: {
    origin: ['https://lomi.africa', 'https://www.lomi.africa', 'https://portal.lomi.africa', 'https://pay.lomi.africa', 'https://store.lomi.africa', 'https://app.lomi.africa'],
  },

  schema: {
    types: schemaTypes,
  },
})
