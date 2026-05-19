#!/usr/bin/env node
/**
 * TypeScript SDK Generator
 * 
 * Generates TypeScript SDK from api.ts types
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generatedDir = join(__dirname, '../ts/src/generated');

console.log('🔨 Generating TypeScript SDK...');

// Step 1: Run type-based SDK generator
console.log('📋 Running type-based SDK generator...');
execSync('node scripts/generate-types-sdk.js', {
    cwd: join(__dirname, '..'),
    stdio: 'inherit'
});

// Step 2: Fix ES module imports
console.log('🔧 Fixing ES module imports...');
function fixImports(dir) {
    if (!existsSync(dir)) return;

    const files = readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const filePath = join(dir, file.name);

        if (file.isDirectory()) {
            fixImports(filePath);
        } else if (file.name.endsWith('.ts')) {
            let content = readFileSync(filePath, 'utf-8');
            const importRegex = /(from\s+['"])(\.\.?[^'"]+)(['"])/g;
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

// Step 3: Run post-generation script to create SDK wrapper
console.log('🔧 Running post-generation script...');
execSync('node ../scripts/post-generate-sdk.js', {
    cwd: join(__dirname, '../ts'),
    stdio: 'inherit'
});

console.log('✅ TypeScript SDK generated successfully!');
