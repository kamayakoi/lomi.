#!/usr/bin/env node
/**
 * TypeScript SDK Generator
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const specPath = join(__dirname, '../spec.yaml');
const generatedDir = join(__dirname, '../ts/src/generated');

console.log('📋 Using OpenAPI spec from sdks root...');

console.log('🔨 Generating TypeScript SDK...');
execSync(
    'npx openapi-typescript-codegen --input ../spec.yaml --output ./src/generated --client axios --useOptions',
    { cwd: join(__dirname, '../ts'), stdio: 'inherit' }
);

console.log('🔧 Fixing ES module imports...');
function fixImports(dir) {
    const files = readdirSync(dir);

    for (const file of files) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
            fixImports(filePath);
        } else if (file.endsWith('.ts')) {
            let content = readFileSync(filePath, 'utf-8');
            const importRegex = /(from\s+['"])(\.[^'"]+)(['"])/g;
            const modified = content.replace(importRegex, (match, prefix, path, suffix) => {
                if (!path.endsWith('.js') && !path.includes('.json')) {
                    return `${prefix}${path}.js${suffix}`;
                }
                return match;
            });

            if (modified !== content) {
                writeFileSync(filePath, modified, 'utf-8');
            }
        }
    }
}

fixImports(generatedDir);

const openAPIPath = join(generatedDir, 'core/OpenAPI.ts');
let content = readFileSync(openAPIPath, 'utf-8');
content = content.replace(/BASE: '.*'/, "BASE: 'https://api.lomi.africa/v1'");
writeFileSync(openAPIPath, content, 'utf-8');

console.log('✅ TypeScript SDK generated successfully!');

// Run post-generation script to create SDK wrapper
console.log('🔧 Running post-generation script...');
execSync('node ../scripts/post-generate-sdk.js', { cwd: join(__dirname, '../ts'), stdio: 'inherit' });
