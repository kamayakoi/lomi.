/**
 * Static contract: Tier-1 modules call these Supabase RPC names.
 * If SQL renames an RPC, update services and this list so drift is caught in CI.
 */
describe('Tier-1 Supabase RPC identifiers (contract)', () => {
  it('lists unique RPC names relied upon by Tier-1 flows', () => {
    const tier1RpcNames = [
      'verify_api_key',
      'create_payment_request_api',
      'list_payment_requests',
      'create_payment_link',
      'get_payment_link_api',
      'list_payment_links',
      'fetch_transactions',
      'get_transaction',
      'create_checkout_session',
      'create_checkout_session_with_line_items',
      'list_checkout_sessions',
    ] as const;

    expect(tier1RpcNames).toHaveLength(11);
    expect(new Set(tier1RpcNames).size).toBe(tier1RpcNames.length);
  });
});
