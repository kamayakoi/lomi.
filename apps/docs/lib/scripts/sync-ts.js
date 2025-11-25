/* @proprietary license */

#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sync missing translation keys from English to all locales (fr, es, zh)
 * Reads missing keys from missing-keys-*.txt files and adds them to the respective locale files
 * using the corresponding values from en.json
 */

function getNestedValue(obj, keys) {
  return keys.reduce((current, key) => current?.[key], obj);
}

function setNestedValue(obj, keys, value) {
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!(key in current)) {
      current[key] = {};
    }
    return current[key];
  }, obj);
  target[lastKey] = value;
}

// Recursively get all translation keys from nested object
function getAllKeys(obj, prefix = '') {
  const keys = new Set();

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      const nestedKeys = getAllKeys(value, fullKey);
      nestedKeys.forEach((k) => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }

  return keys;
}

function findMissingKeys(enTranslations, localeTranslations) {
  const enKeys = getAllKeys(enTranslations);
  const localeKeys = getAllKeys(localeTranslations);

  const missingKeys = [];
  enKeys.forEach((key) => {
    if (!localeKeys.has(key)) {
      missingKeys.push(key);
    }
  });

  return missingKeys;
}

function syncTranslations() {
  try {
    // Read the English translations
    const enPath = path.join(__dirname, '../i18n/locales/en.json');
    const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));

    // Locales to sync
    const locales = ['fr', 'es', 'zh'];
    let totalAddedCount = 0;

    for (const locale of locales) {
      console.log(`\n🔄 Processing ${locale.toUpperCase()} locale...`);

      // Read the target locale file
      const localePath = path.join(__dirname, `../i18n/locales/${locale}.json`);
      const localeTranslations = JSON.parse(
        fs.readFileSync(localePath, 'utf8'),
      );

      // Find missing keys by comparing with English
      const missingKeys = findMissingKeys(enTranslations, localeTranslations);

      if (missingKeys.length === 0) {
        console.log(`No missing keys for ${locale.toUpperCase()}`);
        continue;
      }

      console.log(
        `Found ${missingKeys.length} missing keys for ${locale.toUpperCase()}`,
      );

      let addedCount = 0;

      // Process each missing key
      for (const key of missingKeys) {
        const keyParts = key.split('.');

        // Get the English value
        const englishValue = getNestedValue(enTranslations, keyParts);

        if (englishValue === undefined) {
          console.warn(`Warning: Key "${key}" not found in en.json`);
          continue;
        }

        // Add to locale translations
        setNestedValue(localeTranslations, keyParts, englishValue);
        addedCount++;

        console.log(`✓ Added to ${locale.toUpperCase()}: ${key}`);
      }

      // Sort the translations
      function sortObjectKeys(obj) {
        if (typeof obj !== 'object' || obj === null) {
          return obj;
        }

        if (Array.isArray(obj)) {
          return obj.map(sortObjectKeys);
        }

        const sorted = {};
        Object.keys(obj)
          .sort()
          .forEach((key) => {
            sorted[key] = sortObjectKeys(obj[key]);
          });

        return sorted;
      }

      const sortedTranslations = sortObjectKeys(localeTranslations);

      // Write back the updated locale translations
      fs.writeFileSync(
        localePath,
        JSON.stringify(sortedTranslations, null, 2),
        'utf8',
      );

      console.log(
        `✅ Successfully synced ${addedCount} translation keys from English to ${locale.toUpperCase()}`,
      );
      console.log(`Updated file: ${localePath}`);

      totalAddedCount += addedCount;
    }

    console.log(
      `\n🎉 Total: Synced ${totalAddedCount} translation keys across all locales`,
    );
  } catch (error) {
    console.error('❌ Error syncing translations:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  syncTranslations();
}

export { syncTranslations };
