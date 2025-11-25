import { parseDatabaseTypes } from './parse-database-types';
import * as path from 'path';

const dbTypesPath = path.join(
  __dirname,
    '../../../../apps/docs/lib/types/database.types.ts',
);
const { tables, enums } = parseDatabaseTypes(dbTypesPath);

console.log(`\n📊 Found ${tables.size} tables:\n`);
console.log(Array.from(tables.keys()).sort().join('\n'));

console.log(`\n\n📋 Found ${enums.size} enums:\n`);
console.log(Array.from(enums.keys()).sort().join('\n'));
