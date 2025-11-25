import * as ts from 'typescript';
import * as fs from 'fs';

export interface TableSchema {
  tableName: string;
  row: Record<string, PropertyInfo>;
  insert: Record<string, PropertyInfo>;
  update: Record<string, PropertyInfo>;
}

export interface PropertyInfo {
  type: string;
  format?: string;
  enum?: string[];
  nullable: boolean;
  required: boolean;
  description?: string;
}

export interface EnumDefinition {
  name: string;
  values: string[];
}

export function parseDatabaseTypes(filePath: string): {
  tables: Map<string, TableSchema>;
  enums: Map<string, EnumDefinition>;
} {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    'database.types.ts',
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
  );

  const tables = new Map<string, TableSchema>();
  const enums = new Map<string, EnumDefinition>();

  function visit(node: ts.Node) {
    if (ts.isTypeAliasDeclaration(node) && node.name.text === 'Database') {
      const type = node.type;
      if (ts.isTypeLiteralNode(type)) {
        extractTables(type, tables);
        extractEnums(type, enums);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return { tables, enums };
}

function extractTables(
  databaseType: ts.TypeLiteralNode,
  tables: Map<string, TableSchema>,
) {
  const publicProp = databaseType.members.find(
    (member): member is ts.PropertySignature =>
      ts.isPropertySignature(member) &&
      ts.isIdentifier(member.name) &&
      member.name.text === 'public',
  );

  if (
    !publicProp ||
    !publicProp.type ||
    !ts.isTypeLiteralNode(publicProp.type)
  ) {
    return;
  }

  const tablesProp = publicProp.type.members.find(
    (member): member is ts.PropertySignature =>
      ts.isPropertySignature(member) &&
      ts.isIdentifier(member.name) &&
      member.name.text === 'Tables',
  );

  if (
    !tablesProp ||
    !tablesProp.type ||
    !ts.isTypeLiteralNode(tablesProp.type)
  ) {
    return;
  }

  tablesProp.type.members.forEach((member) => {
    if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
      const tableName = member.name.text;
      const tableType = member.type;

      if (tableType && ts.isTypeLiteralNode(tableType)) {
        const schema = extractTableSchema(tableName, tableType);
        if (schema) {
          tables.set(tableName, schema);
        }
      }
    }
  });
}

  function extractTableSchema(
  tableName: string,
  tableNode: ts.TypeLiteralNode,
): TableSchema | null {
  const schema: TableSchema = {
    tableName,
    row: {},
    insert: {},
    update: {},
  };

  tableNode.members.forEach((member) => {
    if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
      const propName = member.name.text;

      if (
        propName === 'Row' &&
        member.type &&
        ts.isTypeLiteralNode(member.type)
      ) {
        schema.row = extractProperties(member.type, false);
      } else if (
        propName === 'Insert' &&
        member.type &&
        ts.isTypeLiteralNode(member.type)
      ) {
        schema.insert = extractProperties(member.type, true);
      } else if (
        propName === 'Update' &&
        member.type &&
        ts.isTypeLiteralNode(member.type)
      ) {
        schema.update = extractProperties(member.type, true);
      }
    }
  });

  return schema;
}

function extractProperties(
  typeNode: ts.TypeLiteralNode,
  isOptional: boolean,
): Record<string, PropertyInfo> {
  const properties: Record<string, PropertyInfo> = {};

  typeNode.members.forEach((member) => {
    if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
      const propertyName = member.name.text;
      const propertyType = member.type;
      const required = !member.questionToken && !isOptional;

      if (propertyType) {
        const typeInfo = extractTypeInfo(propertyType);
        properties[propertyName] = {
          ...typeInfo,
          required,
        };
      }
    }
  });

  return properties;
}

function extractTypeInfo(
  typeNode: ts.TypeNode,
): Omit<PropertyInfo, 'required'> {
  const info: Omit<PropertyInfo, 'required'> = {
    type: 'string',
    nullable: false,
  };

  if (ts.isUnionTypeNode(typeNode)) {
    const types = typeNode.types;
    const nonNullTypes = types.filter((t) => !isNullType(t));

    if (types.length > nonNullTypes.length) {
      info.nullable = true;
    }

    if (nonNullTypes.length > 0) {
      const primaryType = nonNullTypes[0];
      Object.assign(info, extractSimpleType(primaryType));
    }

    return info;
  }

  return { ...info, ...extractSimpleType(typeNode) };
}

function extractSimpleType(typeNode: ts.TypeNode): Partial<PropertyInfo> {
  if (ts.isIndexedAccessTypeNode(typeNode)) {
    return { type: 'string' }; // Enums are strings
  }
  if (ts.isLiteralTypeNode(typeNode)) {
    if (ts.isStringLiteral(typeNode.literal)) {
      return {
        type: 'string',
        enum: [typeNode.literal.text],
      };
    }
    if (ts.isNumericLiteral(typeNode.literal)) {
      return { type: 'number' };
    }
    if (
      typeNode.literal.kind === ts.SyntaxKind.TrueKeyword ||
      typeNode.literal.kind === ts.SyntaxKind.FalseKeyword
    ) {
      return { type: 'boolean' };
    }
  }

  if (typeNode.kind === ts.SyntaxKind.StringKeyword) {
    return { type: 'string' };
  }
  if (typeNode.kind === ts.SyntaxKind.NumberKeyword) {
    return { type: 'number', format: 'double' };
  }
  if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) {
    return { type: 'boolean' };
  }

  if (typeNode.kind === ts.SyntaxKind.UnknownKeyword) {
    return { type: 'object' };
  }
  if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
    if (typeNode.typeName.text === 'Json') {
      return { type: 'object' };
    }
  }

  return { type: 'string' };
}

function isNullType(typeNode: ts.TypeNode): boolean {
  return typeNode.kind === ts.SyntaxKind.NullKeyword;
}

function extractEnums(
  databaseType: ts.TypeLiteralNode,
  enums: Map<string, EnumDefinition>,
) {
  const publicProp = databaseType.members.find(
    (member): member is ts.PropertySignature =>
      ts.isPropertySignature(member) &&
      ts.isIdentifier(member.name) &&
      member.name.text === 'public',
  );

  if (
    !publicProp ||
    !publicProp.type ||
    !ts.isTypeLiteralNode(publicProp.type)
  ) {
    return;
  }

  const enumsProp = publicProp.type.members.find(
    (member): member is ts.PropertySignature =>
      ts.isPropertySignature(member) &&
      ts.isIdentifier(member.name) &&
      member.name.text === 'Enums',
  );

  if (!enumsProp || !enumsProp.type || !ts.isTypeLiteralNode(enumsProp.type)) {
    return;
  }

  enumsProp.type.members.forEach((member) => {
    if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
      const enumName = member.name.text;
      const enumType = member.type;

      if (enumType && ts.isUnionTypeNode(enumType)) {
        const values: string[] = [];
        enumType.types.forEach((typeNode) => {
          if (
            ts.isLiteralTypeNode(typeNode) &&
            ts.isStringLiteral(typeNode.literal)
          ) {
            values.push(typeNode.literal.text);
          }
        });

        if (values.length > 0) {
          enums.set(enumName, { name: enumName, values });
        }
      }
    }
  });
}

export function tableSchemaToOpenAPI(table: TableSchema) {
  // Fields that should be marked as readOnly in the response schema
  const readOnlyFields = new Set([
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    table.tableName === 'customers' ? 'customer_id' : null,
    table.tableName === 'payment_requests' ? 'request_id' : null,
    table.tableName === 'transactions' ? 'transaction_id' : null,
    table.tableName === 'products' ? 'product_id' : null,
    table.tableName === 'subscriptions' ? 'subscription_id' : null,
  ].filter(Boolean) as string[]);

  // Fields that should never appear in create/update schemas
  const systemManagedFields = new Set([
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'organization_id', // Set from auth context
    'merchant_id',     // Set from auth context  
    'environment',     // Set by SDK/API
    ...Array.from(readOnlyFields),
  ]);

  // Clean insert properties (exclude system-managed fields)
  const cleanInsertProps = Object.entries(table.insert)
    .filter(([name]) => !systemManagedFields.has(name))
    .reduce((acc, [name, prop]) => ({ ...acc, [name]: prop }), {} as Record<string, PropertyInfo>);

  // Clean update properties (exclude system-managed fields)
  const cleanUpdateProps = Object.entries(table.update)
    .filter(([name]) => !systemManagedFields.has(name))
    .reduce((acc, [name, prop]) => ({ ...acc, [name]: prop }), {} as Record<string, PropertyInfo>);

  return {
    [table.tableName]: {
      type: 'object',
      description: `${table.tableName.replace(/_/g, ' ')} resource object`,
      properties: propertiesToOpenAPI(table.row, readOnlyFields),
    },
    [`${table.tableName}_create`]: {
      type: 'object',
      description: `Request body for creating a ${table.tableName.replace(/_/g, ' ')} object. System-managed fields like \`created_at\`, \`organization_id\`, and IDs are automatically set.`,
      required: Object.entries(cleanInsertProps)
        .filter(([_, prop]) => prop.required)
        .map(([name]) => name),
      properties: propertiesToOpenAPI(cleanInsertProps),
    },
    [`${table.tableName}_update`]: {
      type: 'object',
      description: `Request body for updating a ${table.tableName.replace(/_/g, ' ')} object. Only include fields you want to modify.`,
      properties: propertiesToOpenAPI(cleanUpdateProps),
    },
  };
}

function propertiesToOpenAPI(
  properties: Record<string, PropertyInfo>,
  readOnlyFields: Set<string> = new Set(),
): Record<string, any> {
  const result: Record<string, any> = {};

  Object.entries(properties).forEach(([name, prop]) => {
    const schema: any = {
      type: prop.type,
    };

    if (prop.format) {
      schema.format = prop.format;
    }

    if (prop.enum) {
      schema.enum = prop.enum;
    }

    if (prop.nullable) {
      schema.nullable = true;
    }

    if (prop.description) {
      schema.description = prop.description;
    }

    // Mark as readOnly if in the readOnlyFields set
    if (readOnlyFields.has(name)) {
      schema.readOnly = true;
    }

    // Add format hints based on field name patterns
    if (name.includes('_id') || name === 'id') {
      schema.format = 'uuid';
      if (!schema.description) {
        schema.description = `Unique identifier (UUID format)`;
      }
    }

    if (name.includes('email')) {
      schema.format = 'email';
      if (!schema.description) {
        schema.description = 'Email address';
      }
    }

    if (name.includes('url') || name.includes('uri')) {
      schema.format = 'uri';
      if (!schema.description) {
        schema.description = 'URL/URI';
      }
    }

    if (name.includes('_at') || name === 'timestamp') {
      schema.format = 'date-time';
      if (!schema.description) {
        schema.description = 'ISO 8601 datetime';
      }
    }

    // Add helpful descriptions for common fields
    if (name === 'metadata' && !schema.description) {
      schema.description = 'Set of key-value pairs for storing additional information';
    }

    if (name === 'currency_code' && !schema.description) {
      schema.description = 'Three-letter ISO currency code (e.g., XOF, USD, EUR)';
    }

    if (name === 'amount' && !schema.description) {
      schema.description = 'Amount in the smallest currency unit (e.g., cents for USD, same for XOF)';
    }

    if (name === 'status' && !schema.description) {
      schema.description = 'Current status of the resource';
    }

    if (name === 'is_active' && !schema.description) {
      schema.description = 'Whether this resource is currently active';
    }

    if (name === 'is_deleted' && !schema.description) {
      schema.description = 'Soft deletion flag';
    }

    result[name] = schema;
  });

  return result;
}
