import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { SupabaseService } from '../src/utils/supabase/supabase.service';

function createSupabaseE2eMock() {
  const rpc = jest.fn(
    async (fn: string, args: Record<string, unknown>) => {
      if (fn === 'verify_api_key') {
        const key = args.p_api_key as string;
        if (key !== 'valid_e2e_key') {
          return {
            data: [{ is_valid: false }],
            error: null,
          };
        }
        return {
          data: [
            {
              is_valid: true,
              merchant_id: 'merch_e2e',
              organization_id: 'org_e2e',
              environment: 'test',
            },
          ],
          error: null,
        };
      }

      if (fn === 'fetch_transactions') {
        return { data: [{ transaction_id: 'txn_e2e' }], error: null };
      }

      if (fn === 'list_payment_links') {
        return {
          data: [{ link_id: 'plink_e2e', title: 'E2E link' }],
          error: null,
        };
      }

      if (fn === 'create_payment_request_api') {
        return {
          data: {
            request_id: 'pr_e2e',
            amount: args.p_amount,
            currency_code: args.p_currency_code,
          },
          error: null,
        };
      }

      if (fn === 'create_checkout_session') {
        return {
          data: {
            checkout_session_id: 'cs_e2e',
            currency_code: 'XOF',
          },
          error: null,
        };
      }

      return { data: null, error: null };
    },
  );

  return {
    onModuleInit: () => {},
    rpc,
    getClient: () => ({
      rpc,
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              single: async () => ({ data: null, error: { message: 'not found' } }),
            }),
            single: async () => ({ data: null, error: { message: 'not found' } }),
          }),
        }),
      }),
    }),
  };
}

describe('App (e2e)', () => {
  let app: INestApplication<App>;
  let supabaseMock: ReturnType<typeof createSupabaseE2eMock>;

  beforeAll(async () => {
    supabaseMock = createSupabaseE2eMock();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SupabaseService)
      .useValue(supabaseMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / is public', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('GET /transactions rejects without API key (401 + JSON shape)', async () => {
    const res = await request(app.getHttpServer()).get('/transactions').expect(401);

    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: 401,
        message: 'API Key is missing',
      }),
    );
  });

  it('GET /transactions rejects invalid API key', async () => {
    const res = await request(app.getHttpServer())
      .get('/transactions')
      .set('X-API-KEY', 'nope')
      .expect(401);

    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: 401,
        message: 'Invalid API Key',
      }),
    );
  });

  it('GET /transactions returns data with valid API key (Tier-1 read smoke)', async () => {
    const res = await request(app.getHttpServer())
      .get('/transactions')
      .set('X-API-KEY', 'valid_e2e_key')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toEqual(
      expect.objectContaining({ transaction_id: 'txn_e2e' }),
    );
  });

  it('GET /payment-links returns paginated payload with valid API key (Tier-1 read smoke)', async () => {
    const res = await request(app.getHttpServer())
      .get('/payment-links')
      .set('X-API-KEY', 'valid_e2e_key')
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        data: [expect.objectContaining({ link_id: 'plink_e2e' })],
        limit: 20,
        offset: 0,
      }),
    );
  });

  it('POST /payment-requests creates with valid API key (Tier-1 write smoke)', async () => {
    const res = await request(app.getHttpServer())
      .post('/payment-requests')
      .set('X-API-KEY', 'valid_e2e_key')
      .send({
        amount: 1000,
        currency_code: 'XOF',
        expiry_date: '2026-12-31T23:59:59.000Z',
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        request_id: 'pr_e2e',
        amount: 1000,
        currency_code: 'XOF',
      }),
    );
  });

  it('POST /checkout-sessions creates with valid API key (Tier-1 write smoke)', async () => {
    const res = await request(app.getHttpServer())
      .post('/checkout-sessions')
      .set('X-API-KEY', 'valid_e2e_key')
      .send({
        currency_code: 'XOF',
        amount: 5000,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        checkout_session_id: 'cs_e2e',
        currency_code: 'XOF',
      }),
    );
  });
});
