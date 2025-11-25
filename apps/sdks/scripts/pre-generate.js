#!/usr/bin/env node
/**
 * Pre-generation validation and setup script
 *
 * This script validates the OpenAPI spec and prepares it for code generation
 */

import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceSpecPath = join(__dirname, '../../api/openapi/spec.yaml');
const targetSpecPath = join(__dirname, '../spec.yaml');

try {
    console.log('📋 Copying OpenAPI specification from API...');

    // Copy spec.yaml from api/openapi
    copyFileSync(sourceSpecPath, targetSpecPath);
    console.log('✅ Spec copied successfully');

    // Read and validate the spec
    console.log('📋 Validating OpenAPI specification...');
    const specContent = readFileSync(targetSpecPath, 'utf-8');

    // Basic validation for YAML
    if (!specContent.includes('openapi:')) {
        throw new Error('Missing "openapi:" field in spec');
    }

    if (!specContent.includes('paths:')) {
        throw new Error('Missing "paths:" field in spec');
    }

    console.log('✅ OpenAPI specification validated');
} catch (error) {
    console.error('❌ Error in pre-generation:', error.message);
    process.exit(1);
}
