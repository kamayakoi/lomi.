#!/usr/bin/env node
/**
 * Python SDK Generator
 */

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const specPath = join(__dirname, '../spec.yaml');
const outputDir = join(__dirname, '../python');

console.log('🔨 Generating Python SDK...');

try {
    execSync(
        `npx @openapitools/openapi-generator-cli generate \\
      -i ${specPath} \\
      -g python \\
      -o ${outputDir} \\
      --package-name lomi \\
      --additional-properties=projectName=lomi-sdk,packageVersion=1.0.0 \\
      --skip-validate-spec`,
        { stdio: 'inherit' }
    );

    console.log('✅ Python SDK generated successfully!');
} catch (error) {
    console.error('❌ Failed to generate Python SDK');
    process.exit(1);
}
