#!/usr/bin/env node
/**
 * Go SDK Generator
 */

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const specPath = join(__dirname, '../spec.yaml');
const outputDir = join(__dirname, '../go');

console.log('🔨 Generating Go SDK...');

try {
    execSync(
        `npx @openapitools/openapi-generator-cli generate \\
      -i ${specPath} \\
      -g go \\
      -o ${outputDir} \\
      --package-name lomisdk \\
      --git-repo-id lomi-go-sdk \\
      --git-user-id lomiafrica \\
      --additional-properties=packageVersion=1.0.0 \\
      --skip-validate-spec`,
        { stdio: 'inherit' }
    );

    console.log('✅ Go SDK generated successfully!');
} catch (error) {
    console.error('❌ Failed to generate Go SDK');
    process.exit(1);
}
