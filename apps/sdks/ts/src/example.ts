/**
 * Example usage of the lomi. TypeScript SDK
 */

import { LomiSDK } from './index.js';

async function main() {
  // Initialize SDK
  const lomi = new LomiSDK({
    apiKey: process.env.LOMI_API_KEY || 'test_key',
    environment: 'test',
  });

  console.log('🚀 lomi. TypeScript SDK\n');
  console.log('='.repeat(60));
  console.log('\n✅ SDK initialized successfully!');
  console.log(`📍 Base URL: ${lomi.getBaseUrl()}`);
  console.log('\n📦 Available Services:');
  console.log('  Core Payments:');
  console.log('    - lomi.customers');
  console.log('    - lomi.paymentRequests');
  console.log('    - lomi.transactions');
  console.log('    - lomi.refunds');
  console.log('\n  Products & Subscriptions:');
  console.log('    - lomi.products');
  console.log('    - lomi.prices');
  console.log('    - lomi.subscriptions');
  console.log('    - lomi.invoices');
  console.log('    - lomi.coupons');
  console.log('\n  Checkout:');
  console.log('    - lomi.checkoutSessions');
  console.log('    - lomi.paymentLinks');
  console.log('\n  Payouts:');
  console.log('    - lomi.payouts');
  console.log('    - lomi.payoutMethods');
  console.log('    - lomi.beneficiaryPayouts');
  console.log('\n  SPI (Senegal Interbank):');
  console.log('    - lomi.spiQrCodes');
  console.log('    - lomi.spiAliases');
  console.log('\n  Webhooks & Events:');
  console.log('    - lomi.webhooks');
  console.log('    - lomi.webhookLogs');
  console.log('    - lomi.events');
  console.log('\n  Usage Billing:');
  console.log('    - lomi.meters');
  console.log('    - lomi.meterBalances');
  console.log('\n  BNPL:');
  console.log('    - lomi.installmentPayments');

  console.log('\n' + '='.repeat(60));
  console.log('\n📝 Example Usage:\n');
  console.log('// Create a customer');
  console.log('const customer = await lomi.customers.createCustomer({');
  console.log('  requestBody: {');
  console.log('    email: "customer@example.com",');
  console.log('    name: "John Doe",');
  console.log('    phone: "+225021234567"');
  console.log('  }');
  console.log('});\n');
  
  console.log('// Create a payment request');
  console.log('const payment = await lomi.paymentRequests.createPaymentRequest({');
  console.log('  requestBody: {');
  console.log('    customer_id: customer.customer_id,');
  console.log('    amount: 10000, // 100 XOF');
  console.log('    currency_code: "XOF",');
  console.log('    payment_method_code: "MOBILE_MONEY"');
  console.log('  }');
  console.log('});\n');

  console.log('✨ SDK is ready to use!');
  console.log('\n💡 Set your API key: export LOMI_API_KEY=your_api_key_here\n');
}

main().catch(console.error);
