#!/usr/bin/env node
/**
 * PHP SDK Generator
 */

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const specPath = join(__dirname, '../spec.yaml');
const outputDir = join(__dirname, '../php');

console.log('🔨 Generating PHP SDK...');

try {
    execSync(
        `npx @openapitools/openapi-generator-cli generate \\
      -i ${specPath} \\
      -g php \\
      -o ${outputDir} \\
      --invoker-package Lomi\\\\SDK \\
      --package-name lomi/sdk \\
      --git-repo-id lomi-sdk \\
      --git-user-id lomi \\
      --additional-properties=packageVersion=1.0.0 \\
      --skip-validate-spec`,
        { stdio: 'inherit' }
    );

    console.log('✅ PHP SDK generated successfully!');
} catch (error) {
    console.error('❌ Failed to generate PHP SDK');
    process.exit(1);
}
