#!/usr/bin/env node
/**
 * Post-generation script to automatically create SDK wrapper
 * This reads the generated services and creates a clean SDK interface
 */

import { writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const servicesDir = join(__dirname, '../ts/src/generated/services');
const sdkPath = join(__dirname, '../ts/src/sdk.ts');

console.log('🔧 Generating SDK wrapper from services...');

if (!existsSync(servicesDir)) {
  console.error('❌ Services directory not found:', servicesDir);
  process.exit(1);
}

// Read all generated service files
const serviceFiles = readdirSync(servicesDir).filter(f => f.endsWith('.ts'));
const services = serviceFiles.map(f => f.replace('.ts', ''));

console.log(`Found ${services.length} services:`, services);

// Generate property names from service names (e.g., AccountsService -> accounts)
function getPropertyName(serviceName) {
  // Remove 'Service' suffix and convert to camelCase
  const withoutService = serviceName.replace(/Service$/, '');
  return withoutService.charAt(0).toLowerCase() + withoutService.slice(1);
}

// Generate the SDK class
const sdkContent = `/**
 * Main lomi. SDK class
 * AUTO-GENERATED - Do not edit manually
 */

import type { LomiConfig } from './config.js';
import { DEFAULT_CONFIG } from './config.js';
import { OpenAPI } from './generated/index.js';

// Import all generated services
import {
${services.map(s => `  ${s},`).join('\n')}
} from './generated/index.js';

export class LomiSDK {
${services.map(s => `  public readonly ${getPropertyName(s)}: typeof ${s};`).join('\n')}

  /**
   * Initialize the lomi. SDK
   */
  constructor(config: LomiConfig) {
    const baseUrl = config.environment === 'test' 
      ? 'https://sandbox.api.lomi.africa'
      : config.baseUrl || DEFAULT_CONFIG.baseUrl;

    // Configure OpenAPI client
    OpenAPI.BASE = baseUrl;
    OpenAPI.HEADERS = {
      'X-API-KEY': config.apiKey,
      ...config.headers,
    };

    // Assign all generated services
${services.map(s => {
  const propName = getPropertyName(s);
  return `    this.${propName} = ${s};`;
}).join('\n')}
  }

  /**
   * Update the API key
   */
  setApiKey(apiKey: string): void {
    OpenAPI.HEADERS = {
      ...OpenAPI.HEADERS,
      'X-API-KEY': apiKey,
    };
  }

  /**
   * Get the current base URL
   */
  getBaseUrl(): string {
    return OpenAPI.BASE;
  }
}
`;

writeFileSync(sdkPath, sdkContent, 'utf-8');
console.log('✅ SDK wrapper generated successfully!');
console.log(`   Available services: ${services.map(s => getPropertyName(s)).join(', ')}`);
