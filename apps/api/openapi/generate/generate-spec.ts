import * as fs from 'fs';
import * as path from 'path';
import {
  parseDatabaseTypes,
  tableSchemaToOpenAPI,
} from './parse-database-types';
import {
  getEnabledResources,
  isEnumExposed,
  type APIResourceConfig,
} from './api-config';

interface OpenAPISpec {
  openapi: string;
  info: any;
  servers: any[];
  security: any[];
  components: {
    securitySchemes: any;
    schemas: Record<string, any>;
    responses: Record<string, any>;
  };
  paths: Record<string, any>;
  tags: any[];
}

/**
 * Generate realistic example payloads for create operations
 */
function getExampleForResource(tableName: string): any {
  const examples: Record<string, any> = {
    customers: {
      name: 'Aminata Diallo',
      email: 'aminata.diallo@example.com',
      phone_number: '+225021234567',
      metadata: {
        customer_segment: 'premium',
        referral_source: 'instagram',
      },
    },
    payment_requests: {
      amount: 25000,
      currency_code: 'XOF',
      customer_id: 'cus_1234567890abcdef',
      description: 'Payment for premium subscription',
      metadata: {
        order_id: 'ORD-2024-001',
      },
    },
    products: {
      name: 'Premium Subscription',
      description: 'Monthly premium access with all features',
      product_type: 'recurring',
      is_active: true,
      metadata: {
        features: ['analytics', 'api_access', 'priority_support'],
      },
    },
    prices: {
      product_id: 'prod_1234567890abcdef',
      amount: 5000,
      currency_code: 'XOF',
      pricing_model: 'flat_rate',
      billing_frequency: 'monthly',
      is_active: true,
    },
    subscriptions: {
      customer_id: 'cus_1234567890abcdef',
      product_id: 'prod_1234567890abcdef',
      price_id: 'price_1234567890abcdef',
      billing_frequency: 'monthly',
      metadata: {
        plan: 'premium',
      },
    },
    discount_coupons: {
      code: 'WELCOME2024',
      discount_type: 'percentage',
      discount_percentage: 20,
      max_uses: 100,
      is_active: true,
      expires_at: '2024-12-31T23:59:59Z',
      description: 'Welcome discount for new customers',
    },
    checkout_sessions: {
      amount: 15000,
      currency_code: 'XOF',
      product_id: 'prod_1234567890abcdef',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      customer_email: 'customer@example.com',
    },
    payment_links: {
      title: 'Premium Membership',
      amount: 50000,
      currency_code: 'XOF',
      description: 'Annual premium membership',
      product_id: 'prod_1234567890abcdef',
    },
    payouts: {
      amount: 100000,
      currency_code: 'XOF',
      beneficiary_account_id: 'acc_1234567890abcdef',
      description: 'Monthly payout to vendor',
    },
    webhooks: {
      url: 'https://api.example.com/webhooks/lomi',
      events: ['payment.succeeded', 'payment.failed'],
      description: 'Production webhook endpoint',
      is_active: true,
    },
    spi_qr_codes: {
      amount: 5000,
      currency_code: 'XOF',
      description: 'QR code for in-store payment',
      expires_at: '2024-12-31T23:59:59Z',
    },
  };

  return examples[tableName] || {
    name: `Sample ${tableName.slice(0, -1)}`,
    description: `Example ${tableName.slice(0, -1)} object`,
  };
}

/**
 * Generate realistic example payloads for update operations
 */
function getUpdateExampleForResource(tableName: string): any {
  const examples: Record<string, any> = {
    customers: {
      name: 'Aminata Diallo-Kane',
      phone_number: '+225779876543',
      metadata: {
        customer_segment: 'vip',
        notes: 'Upgraded to VIP tier',
      },
    },
    payment_requests: {
      metadata: {
        order_id: 'ORD-2024-001-UPDATED',
        notes: 'Customer requested invoice',
      },
    },
    products: {
      name: 'Premium Plus Subscription',
      description: 'Enhanced premium access with exclusive features',
      is_active: true,
    },
    prices: {
      is_active: false,
    },
    subscriptions: {
      metadata: {
        plan: 'enterprise',
        upgraded_at: new Date().toISOString(),
      },
    },
    discount_coupons: {
      is_active: false,
      max_uses: 50,
    },
    webhooks: {
      is_active: false,
      description: 'Temporarily disabled for maintenance',
    },
  };

  return examples[tableName] || {
    metadata: {
      updated_at: new Date().toISOString(),
      updated_reason: 'Administrative update',
    },
  };
}

function generateCRUDPaths(
  tableName: string,
  idField: string = `${tableName.slice(0, -1)}_id`,
  resourceConfig?: APIResourceConfig,
): Record<string, any> {
  const singularName = tableName.endsWith('s')
    ? tableName.slice(0, -1)
    : tableName;

  // Convert to camelCase for operationId (e.g., payment_requests -> paymentRequests)
  const camelCaseName = tableName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  const singularCamelCase = singularName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

  return {
    [`/${tableName}`]: {
      get: {
        operationId: `list${camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1)}`,
        summary: `List ${tableName.replace(/_/g, ' ')}`,
        description: resourceConfig?.description || `Retrieve a paginated list of ${tableName.replace(/_/g, ' ')}. Returns up to 100 items per request.`,
        tags: [resourceConfig?.tag || singularName],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'Maximum number of items to return (1-100)',
            schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Number of items to skip for pagination',
            schema: { type: 'integer', default: 0, minimum: 0 },
          },
          {
            name: 'sort',
            in: 'query',
            description: 'Sort order. Format: `field:direction` (e.g., `created_at:desc`)',
            schema: { type: 'string', example: 'created_at:desc' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response with paginated data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: `#/components/schemas/${tableName}` },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        limit: { type: 'integer', description: 'Number of items per page' },
                        offset: { type: 'integer', description: 'Number of items skipped' },
                        total: { type: 'integer', description: 'Total number of items available' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
      post: {
        operationId: `create${singularCamelCase.charAt(0).toUpperCase() + singularCamelCase.slice(1)}`,
        summary: `Create ${singularName.replace(/_/g, ' ')}`,
        description: resourceConfig?.description || `Create a new ${singularName.replace(/_/g, ' ')} object.`,
        tags: [resourceConfig?.tag || singularName],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${tableName}_create` },
              examples: {
                default: {
                  summary: `Sample ${singularName} creation`,
                  value: getExampleForResource(tableName),
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: `${singularName.charAt(0).toUpperCase() + singularName.slice(1)} successfully created`,
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/${tableName}` },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    [`/${tableName}/{${idField}}`]: {
      get: {
        operationId: `retrieve${singularCamelCase.charAt(0).toUpperCase() + singularCamelCase.slice(1)}`,
        summary: `Retrieve ${singularName.replace(/_/g, ' ')}`,
        description: `Retrieve a specific ${singularName.replace(/_/g, ' ')} by its unique identifier.`,
        tags: [resourceConfig?.tag || singularName],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: idField,
            in: 'path',
            required: true,
            description: `Unique identifier for the ${singularName.replace(/_/g, ' ')}`,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: `${singularName.charAt(0).toUpperCase() + singularName.slice(1)} retrieved successfully`,
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/${tableName}` },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
      patch: {
        operationId: `update${singularCamelCase.charAt(0).toUpperCase() + singularCamelCase.slice(1)}`,
        summary: `Update ${singularName.replace(/_/g, ' ')}`,
        description: `Update a specific ${singularName.replace(/_/g, ' ')}. Only provided fields will be updated.`,
        tags: [resourceConfig?.tag || singularName],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: idField,
            in: 'path',
            required: true,
            description: `Unique identifier for the ${singularName.replace(/_/g, ' ')}`,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${tableName}_update` },
              examples: {
                default: {
                  summary:  `Sample ${singularName} update`,
                  value: getUpdateExampleForResource(tableName),
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: `${singularName.charAt(0).toUpperCase() + singularName.slice(1)} successfully updated`,
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/${tableName}` },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
      delete: {
        operationId: `delete${singularCamelCase.charAt(0).toUpperCase() + singularCamelCase.slice(1)}`,
        summary: `Delete ${singularName.replace(/_/g, ' ')}`,
        description: `Delete a specific ${singularName.replace(/_/g, ' ')}. This action cannot be undone.`,
        tags: [resourceConfig?.tag || singularName],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: idField,
            in: 'path',
            required: true,
            description: `Unique identifier for the ${singularName.replace(/_/g, ' ')}`,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': {
            description: `${singularName.charAt(0).toUpperCase() + singularName.slice(1)} successfully deleted`,
          },
          '404': { $ref: '#/components/responses/NotFound' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
    },
  };
}

function generateCRUDPathsWithConfig(
  tableName: string,
  idField: string,
  config: APIResourceConfig,
): Record<string, any> {
  const paths = generateCRUDPaths(tableName, idField, config);

  const operations = config.operations || {
    list: true,
    get: true,
    create: true,
    update: true,
    delete: true,
  };

  const filteredPaths: Record<string, any> = {};

  if (paths[`/${tableName}`]) {
    const collectionPath: any = {};

    if (operations.list !== false && paths[`/${tableName}`].get) {
      collectionPath.get = paths[`/${tableName}`].get;
    }

    if (operations.create !== false && paths[`/${tableName}`].post) {
      collectionPath.post = paths[`/${tableName}`].post;
    }

    if (Object.keys(collectionPath).length > 0) {
      filteredPaths[`/${tableName}`] = collectionPath;
    }
  }

  if (paths[`/${tableName}/{${idField}}`]) {
    const itemPath: any = {};

    if (operations.get !== false && paths[`/${tableName}/{${idField}}`].get) {
      itemPath.get = paths[`/${tableName}/{${idField}}`].get;
    }

    if (
      operations.update !== false &&
      paths[`/${tableName}/{${idField}}`].patch
    ) {
      itemPath.patch = paths[`/${tableName}/{${idField}}`].patch;
    }

    if (
      operations.delete !== false &&
      paths[`/${tableName}/{${idField}}`].delete
    ) {
      itemPath.delete = paths[`/${tableName}/{${idField}}`].delete;
    }

    if (Object.keys(itemPath).length > 0) {
      filteredPaths[`/${tableName}/{${idField}}`] = itemPath;
    }
  }

  return filteredPaths;
}

function generateOpenAPISpec(): OpenAPISpec {
  console.log('📖 Parsing database.types.ts...\n');

  const dbTypesPath = path.join(
    __dirname,
    '../../../../apps/docs/lib/types/database.types.ts',
  );
  const { tables, enums } = parseDatabaseTypes(dbTypesPath);

  console.log(`✅ Found ${tables.size} tables`);
  console.log(`✅ Found ${enums.size} enums\n`);

  const spec: OpenAPISpec = {
    openapi: '3.0.3',
    info: {
      title: 'lomi. API',
      version: '1.1.0',
      description: 'Payment processing API for francophone West African businesses.',
      contact: {
        name: 'lomi. Support',
        email: 'hello@lomi.africa',
        url: 'https://lomi.africa',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'https://api.lomi.africa/v1',
        description: 'Production server',
      },
      {
        url: 'https://sandbox.api.lomi.africa/v1',
        description: 'Sandbox server',
      },
    ],
    security: [{ ApiKeyAuth: [] }],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-KEY',
          description:
            'API key for authentication. Get yours from the lomi. dashboard.',
        },
      },
      schemas: {},
      responses: {
        BadRequest: {
          description: 'Bad request - Invalid input',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized - Invalid or missing API key',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        NotFound: {
          description: 'Not found - Resource does not exist',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        InternalError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
    },
    paths: {},
    tags: [],
  };

  // Convert all tables to OpenAPI schemas
  const allSchemas: Record<string, any> = {};

  tables.forEach((table) => {
    const schemas = tableSchemaToOpenAPI(table);
    Object.assign(allSchemas, schemas);
  });

  // Add enums as schemas
  enums.forEach((enumDef, enumName) => {
    allSchemas[enumName] = {
      type: 'string',
      enum: enumDef.values,
      description: `Enum: ${enumName}`,
    };
  });

  // Add Error schema
  allSchemas.Error = {
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
          details: { type: 'object' },
        },
      },
    },
  };

  spec.components.schemas = allSchemas;

  const enabledResources = getEnabledResources();

  console.log(`📡 Exposing ${enabledResources.length} resources via API\n`);

  const enabledTableNames = new Set(enabledResources.map((r) => r.tableName));
  const filteredSchemas: Record<string, any> = {};

  Object.entries(allSchemas).forEach(([schemaName, schema]) => {
    const isEnabledResource =
      enabledTableNames.has(schemaName) ||
      Array.from(enabledTableNames).some(
        (tableName) =>
          schemaName === `${tableName}_create` ||
          schemaName === `${tableName}_update`,
      );

    const isCommonSchema = schemaName === 'Error';

    if (isEnabledResource || isCommonSchema) {
      filteredSchemas[schemaName] = schema;
    }
  });

  const referencedEnums = new Set<string>();

  function findEnumReferences(obj: any) {
    if (!obj || typeof obj !== 'object') return;

    if (obj.type === 'string' && obj.enum && Array.isArray(obj.enum)) {
      return;
    }
    Object.values(obj).forEach((value) => {
      if (typeof value === 'object') {
        findEnumReferences(value);
      }
    });
  }

  Object.values(filteredSchemas).forEach((schema) => {
    findEnumReferences(schema);
  });
  enums.forEach((enumDef, enumName) => {
    if (isEnumExposed(enumName) || referencedEnums.has(enumName)) {
      if (!filteredSchemas[enumName]) {
        filteredSchemas[enumName] = {
          type: 'string',
          enum: enumDef.values,
          description: `Enum: ${enumName}`,
        };
      }
    }
  });

  spec.components.schemas = filteredSchemas;

  console.log(
    `📋 Filtered schemas: ${Object.keys(filteredSchemas).length} (from ${Object.keys(allSchemas).length} total)`,
  );

  enabledResources.forEach((resource) => {
    if (tables.has(resource.tableName)) {
      const singularName =
        resource.displayName ||
        (resource.tableName.endsWith('s')
          ? resource.tableName.slice(0, -1)
          : resource.tableName);

      spec.tags.push({
        name: resource.tag || singularName,
        description:
          resource.description || `Operations related to ${resource.tableName}`,
      });

      const idField = resource.idField || `${singularName}_id`;
      const paths = generateCRUDPathsWithConfig(
        resource.tableName,
        idField,
        resource,
      );
      Object.assign(spec.paths, paths);
    }
  });

  return spec;
}

function main() {
  console.log('🚀 Generating OpenAPI specification from database schema...\n');

  try {
    const spec = generateOpenAPISpec();

    const outputPath = path.join(__dirname, '../spec.yaml');
    const yaml = require('js-yaml');
    const yamlContent = yaml.dump(spec, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });

    fs.writeFileSync(outputPath, yamlContent, 'utf8');

    console.log('✅ OpenAPI spec generated successfully!');
    console.log(`📄 Output: ${outputPath}`);
    console.log(`📊 Resources: ${spec.tags.length}`);
    console.log(`🛣️  Paths: ${Object.keys(spec.paths).length}`);
    console.log(`📋 Schemas: ${Object.keys(spec.components.schemas).length}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Review the generated spec');
    console.log('   2. Run: npm run generate:docs (to generate documentation)');
    console.log('   3. Generate SDKs from this spec\n');
  } catch (error) {
    console.error('❌ Error generating OpenAPI spec:');
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { generateOpenAPISpec };
