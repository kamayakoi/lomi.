-- Transaction Stats
CREATE OR REPLACE FUNCTION get_transaction_stats()
RETURNS TABLE (
  total_count bigint,
  total_gross_amount numeric,
  total_net_amount numeric,
  total_fee_amount numeric
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_count,
    COALESCE(SUM(gross_amount), 0) as total_gross_amount,
    COALESCE(SUM(net_amount), 0) as total_net_amount,
    COALESCE(SUM(fee_amount), 0) as total_fee_amount
  FROM transactions
  WHERE status = 'completed';
END;
$$;

-- Transactions by Provider
CREATE OR REPLACE FUNCTION get_transactions_by_provider()
RETURNS TABLE (
  provider_code text,
  count bigint,
  gross_amount numeric,
  net_amount numeric,
  fee_amount numeric
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.provider_code::text,
    COUNT(*)::bigint as count,
    COALESCE(SUM(t.gross_amount), 0) as gross_amount,
    COALESCE(SUM(t.net_amount), 0) as net_amount,
    COALESCE(SUM(t.fee_amount), 0) as fee_amount
  FROM transactions t
  WHERE t.status = 'completed'
  GROUP BY t.provider_code
  ORDER BY count DESC;
END;
$$;

-- Transactions by Status
CREATE OR REPLACE FUNCTION get_transactions_by_status()
RETURNS TABLE (
  status text,
  count bigint,
  gross_amount numeric
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.status::text,
    COUNT(*)::bigint as count,
    COALESCE(SUM(t.gross_amount), 0) as gross_amount
  FROM transactions t
  GROUP BY t.status
  ORDER BY count DESC;
END;
$$;

-- Transactions by Date
CREATE OR REPLACE FUNCTION get_transactions_by_date()
RETURNS TABLE (
  date date,
  count bigint,
  gross_amount numeric,
  net_amount numeric,
  fee_amount numeric
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(t.created_at) as date,
    COUNT(*)::bigint as count,
    COALESCE(SUM(t.gross_amount), 0) as gross_amount,
    COALESCE(SUM(t.net_amount), 0) as net_amount,
    COALESCE(SUM(t.fee_amount), 0) as fee_amount
  FROM transactions t
  WHERE t.status = 'completed'
  AND t.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY DATE(t.created_at)
  ORDER BY date DESC;
END;
$$;

-- Top Performing Products
CREATE OR REPLACE FUNCTION get_top_performing_products()
RETURNS TABLE (
  id text,
  name text,
  gross_revenue numeric,
  net_revenue numeric,
  transactions bigint
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.product_id::text as id,
    p.name,
    COALESCE(SUM(t.gross_amount), 0) as gross_revenue,
    COALESCE(SUM(t.net_amount), 0) as net_revenue,
    COUNT(t.transaction_id)::bigint as transactions
  FROM merchant_products p
  LEFT JOIN transactions t ON t.product_id = p.product_id 
    AND t.status = 'completed'
  WHERE p.display_on_storefront = true 
    AND p.is_archived = false
  GROUP BY p.product_id, p.name
  ORDER BY gross_revenue DESC
  LIMIT 10;
END;
$$;

-- Subscription Stats
CREATE OR REPLACE FUNCTION get_subscription_stats()
RETURNS TABLE (
  total_subscriptions bigint,
  active_subscriptions bigint,
  total_revenue numeric,
  recurring_revenue numeric
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_subscriptions,
    COUNT(*) FILTER (WHERE ms.status = 'active')::bigint as active_subscriptions,
    COALESCE(SUM(sp.amount), 0) as total_revenue,
    COALESCE(SUM(CASE WHEN ms.status = 'active' THEN sp.amount ELSE 0 END), 0) as recurring_revenue
  FROM merchant_subscriptions ms
  JOIN subscription_plans sp ON sp.plan_id = ms.plan_id
  WHERE sp.display_on_storefront = true;
END;
$$;

-- Subscriptions by Plan
CREATE OR REPLACE FUNCTION get_subscriptions_by_plan()
RETURNS TABLE (
  plan_id text,
  plan_name text,
  total_count bigint,
  active_count bigint,
  total_revenue numeric,
  recurring_revenue numeric
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.plan_id::text,
    sp.name as plan_name,
    COUNT(ms.subscription_id)::bigint as total_count,
    COUNT(*) FILTER (WHERE ms.status = 'active')::bigint as active_count,
    COALESCE(SUM(sp.amount), 0) as total_revenue,
    COALESCE(SUM(CASE WHEN ms.status = 'active' THEN sp.amount ELSE 0 END), 0) as recurring_revenue
  FROM subscription_plans sp
  LEFT JOIN merchant_subscriptions ms ON ms.plan_id = sp.plan_id
  WHERE sp.display_on_storefront = true
  GROUP BY sp.plan_id, sp.name
  ORDER BY active_count DESC;
END;
$$;

-- Invoices by Status
CREATE OR REPLACE FUNCTION get_invoices_by_status()
RETURNS TABLE (
  status text,
  count bigint,
  amount numeric,
  due_amount numeric
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.status::text,
    COUNT(*)::bigint as count,
    COALESCE(SUM(i.amount), 0) as amount,
    COALESCE(SUM(CASE WHEN i.status IN ('sent', 'overdue') THEN i.amount ELSE 0 END), 0) as due_amount
  FROM customer_invoices i
  GROUP BY i.status
  ORDER BY count DESC;
END;
$$;

-- Merchant Growth Stats
CREATE OR REPLACE FUNCTION get_merchant_growth_stats()
RETURNS TABLE (
  total_merchants bigint,
  onboarded_merchants bigint,
  total_mrr numeric,
  total_arr numeric
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_merchants,
    COUNT(*) FILTER (WHERE onboarded = true)::bigint as onboarded_merchants,
    COALESCE(SUM(mrr), 0) as total_mrr,
    COALESCE(SUM(arr), 0) as total_arr
  FROM merchants
  WHERE is_deleted = false;
END;
$$;

-- Organization Stats
CREATE OR REPLACE FUNCTION get_organization_stats()
RETURNS TABLE (
  total_organizations bigint,
  verified_organizations bigint,
  total_customers bigint,
  total_merchants bigint
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_organizations,
    COUNT(*) FILTER (WHERE verified = true)::bigint as verified_organizations,
    COALESCE(SUM(total_customers), 0)::bigint as total_customers,
    COALESCE(SUM(total_merchants), 0)::bigint as total_merchants
  FROM organizations
  WHERE is_deleted = false;
END;
$$;

-- Organizations by Industry and Status
CREATE OR REPLACE FUNCTION get_organizations_by_industry()
RETURNS TABLE (
  industry text,
  status organization_status,
  count bigint
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(o.industry, 'Unknown')::text,
    o.status,
    COUNT(*)::bigint as count
  FROM organizations o
  WHERE o.is_deleted = false
  GROUP BY o.industry, o.status
  ORDER BY count DESC;
END;
$$;

-- Organizations by Country
CREATE OR REPLACE FUNCTION get_organizations_by_country()
RETURNS TABLE (
  country text,
  count bigint
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(oa.country, 'Unknown')::text,
    COUNT(*)::bigint as count
  FROM organizations o
  LEFT JOIN organization_addresses oa ON o.organization_id = oa.organization_id
  WHERE o.is_deleted = false
  GROUP BY oa.country
  ORDER BY count DESC;
END;
$$;

-- Organization KYC Stats
CREATE OR REPLACE FUNCTION get_organization_kyc_stats()
RETURNS TABLE (
  status kyc_status,
  count bigint
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ok.status,
    COUNT(*)::bigint as count
  FROM organization_kyc ok
  GROUP BY ok.status
  ORDER BY count DESC;
END;
$$;

-- Customer Demographics
CREATE OR REPLACE FUNCTION get_customer_demographics()
RETURNS TABLE (
  is_business boolean,
  country text,
  count bigint
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.is_business,
    COALESCE(c.country, 'Unknown')::text,
    COUNT(*)::bigint as count
  FROM customers c
  WHERE c.is_deleted = false
  GROUP BY c.is_business, c.country
  ORDER BY count DESC;
END;
$$;

-- Merchant Account Balance Stats
CREATE OR REPLACE FUNCTION get_merchant_balance_stats()
RETURNS TABLE (
  currency_code text,
  average_balance numeric,
  total_balance numeric,
  merchant_count bigint
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ma.currency_code::text,
    COALESCE(AVG(ma.balance), 0) as average_balance,
    COALESCE(SUM(ma.balance), 0) as total_balance,
    COUNT(DISTINCT ma.merchant_id)::bigint as merchant_count
  FROM merchant_accounts ma
  GROUP BY ma.currency_code
  ORDER BY total_balance DESC;
END;
$$;

-- Transaction Stats by Merchant
CREATE OR REPLACE FUNCTION get_transaction_stats_by_merchant()
RETURNS TABLE (
  merchant_id uuid,
  total_transactions bigint,
  total_amount numeric,
  average_amount numeric
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.merchant_id,
    COUNT(*)::bigint as total_transactions,
    COALESCE(SUM(t.gross_amount), 0) as total_amount,
    COALESCE(AVG(t.gross_amount), 0) as average_amount
  FROM transactions t
  WHERE t.status = 'completed'
  GROUP BY t.merchant_id
  ORDER BY total_amount DESC;
END;
$$;

-- Transaction Stats by Provider (Extended)
CREATE OR REPLACE FUNCTION get_transaction_stats_by_provider()
RETURNS TABLE (
  provider_code text,
  total_transactions bigint,
  total_amount numeric,
  successful_transactions bigint,
  failed_transactions bigint,
  success_rate numeric
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.provider_code::text,
    COUNT(*)::bigint as total_transactions,
    COALESCE(SUM(t.gross_amount), 0) as total_amount,
    COUNT(*) FILTER (WHERE t.status = 'completed')::bigint as successful_transactions,
    COUNT(*) FILTER (WHERE t.status = 'failed')::bigint as failed_transactions,
    ROUND(COUNT(*) FILTER (WHERE t.status = 'completed')::numeric / COUNT(*)::numeric * 100, 2) as success_rate
  FROM transactions t
  GROUP BY t.provider_code
  ORDER BY total_amount DESC;
END;
$$;

-- ADMIN METRICS --

-- Global Product and Plan Stats (Admin)
CREATE OR REPLACE FUNCTION get_global_product_plan_stats()
RETURNS TABLE (
  total_products bigint,
  total_plans bigint,
  active_subscriptions bigint,
  avg_products_per_merchant numeric
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH merchant_product_counts AS (
    SELECT 
      merchant_id,
      COUNT(*) as product_count
    FROM merchant_products
    WHERE is_archived = false
    GROUP BY merchant_id
  )
  SELECT 
    (SELECT COUNT(*) FROM merchant_products WHERE is_archived = false)::bigint as total_products,
    (SELECT COUNT(*) FROM subscription_plans WHERE is_archived = false)::bigint as total_plans,
    (SELECT COUNT(*) FROM merchant_subscriptions WHERE status = 'active')::bigint as active_subscriptions,
    COALESCE(AVG(product_count), 0) as avg_products_per_merchant
  FROM merchant_product_counts;
END;
$$;

-- Global Transaction Stats (Admin)
CREATE OR REPLACE FUNCTION get_global_transaction_stats()
RETURNS TABLE (
  total_transactions bigint,
  total_gross_amount numeric,
  total_fee_amount numeric,
  total_net_amount numeric,
  currency_code currency_code
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_transactions,
    COALESCE(SUM(gross_amount), 0) as total_gross_amount,
    COALESCE(SUM(fee_amount), 0) as total_fee_amount,
    COALESCE(SUM(net_amount), 0) as total_net_amount,
    t.currency_code
  FROM transactions t
  GROUP BY t.currency_code;
END;
$$;

-- Global Refund Stats (Admin)
CREATE OR REPLACE FUNCTION get_global_refund_stats()
RETURNS TABLE (
  total_refunds bigint,
  total_refunded_amount numeric,
  status refund_status,
  currency_code currency_code
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_refunds,
    COALESCE(SUM(refunded_amount), 0) as total_refunded_amount,
    r.status,
    t.currency_code
  FROM refunds r
  JOIN transactions t ON t.transaction_id = r.transaction_id
  GROUP BY r.status, t.currency_code;
END;
$$;

-- Global Banking Stats (Admin)
CREATE OR REPLACE FUNCTION get_global_banking_stats()
RETURNS TABLE (
  total_bank_accounts bigint,
  total_payouts bigint,
  total_payout_amount numeric,
  currency_code currency_code,
  payout_status payout_status
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM merchant_bank_accounts)::bigint as total_bank_accounts,
    COUNT(*)::bigint as total_payouts,
    COALESCE(SUM(amount), 0) as total_payout_amount,
    p.currency_code,
    p.status as payout_status
  FROM payouts p
  GROUP BY p.currency_code, p.status;
END;
$$;

-- API Usage Stats (Admin)
CREATE OR REPLACE FUNCTION get_api_usage_stats()
RETURNS TABLE (
  total_active_users bigint,
  last_24h_users bigint,
  last_7d_users bigint,
  last_30d_users bigint
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT organization_id)::bigint as total_active_users,
    COUNT(DISTINCT organization_id) FILTER (WHERE last_request_at >= NOW() - INTERVAL '24 hours')::bigint as last_24h_users,
    COUNT(DISTINCT organization_id) FILTER (WHERE last_request_at >= NOW() - INTERVAL '7 days')::bigint as last_7d_users,
    COUNT(DISTINCT organization_id) FILTER (WHERE last_request_at >= NOW() - INTERVAL '30 days')::bigint as last_30d_users
  FROM api_usage;
END;
$$;

-- MERCHANT METRICS --

-- Merchant Product Stats
CREATE OR REPLACE FUNCTION get_merchant_product_stats(p_merchant_id UUID)
RETURNS TABLE (
  total_products bigint,
  active_products bigint,
  total_plans bigint,
  active_plans bigint
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_products,
    COUNT(*) FILTER (WHERE display_on_storefront = true AND is_archived = false)::bigint as active_products,
    (SELECT COUNT(*)::bigint FROM subscription_plans sp WHERE sp.merchant_id = p_merchant_id) as total_plans,
    (SELECT COUNT(*)::bigint FROM subscription_plans sp 
     WHERE sp.merchant_id = p_merchant_id 
     AND sp.display_on_storefront = true 
     AND sp.is_archived = false) as active_plans
  FROM merchant_products mp
  WHERE mp.merchant_id = p_merchant_id;
END;
$$;

-- Merchant Transaction Stats
CREATE OR REPLACE FUNCTION get_merchant_transaction_stats(p_merchant_id UUID)
RETURNS TABLE (
  total_transactions bigint,
  total_amount numeric,
  total_fees numeric,
  net_amount numeric,
  currency_code currency_code,
  status transaction_status
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_transactions,
    COALESCE(SUM(gross_amount), 0) as total_amount,
    COALESCE(SUM(fee_amount), 0) as total_fees,
    COALESCE(SUM(net_amount), 0) as net_amount,
    t.currency_code,
    t.status
  FROM transactions t
  WHERE t.merchant_id = p_merchant_id
  GROUP BY t.currency_code, t.status;
END;
$$;

-- Merchant Customer Stats
CREATE OR REPLACE FUNCTION get_merchant_customer_stats(p_merchant_id UUID)
RETURNS TABLE (
  total_customers bigint,
  business_customers bigint,
  individual_customers bigint,
  customers_with_transactions bigint
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_customers,
    COUNT(*) FILTER (WHERE is_business = true)::bigint as business_customers,
    COUNT(*) FILTER (WHERE is_business = false)::bigint as individual_customers,
    COUNT(DISTINCT t.customer_id)::bigint as customers_with_transactions
  FROM customers c
  LEFT JOIN transactions t ON t.customer_id = c.customer_id
  WHERE c.merchant_id = p_merchant_id AND c.is_deleted = false
  GROUP BY c.merchant_id;
END;
$$;

-- Merchant Refund Stats
CREATE OR REPLACE FUNCTION get_merchant_refund_stats(p_merchant_id UUID)
RETURNS TABLE (
  total_refunds bigint,
  refunded_amount numeric,
  status refund_status,
  currency_code currency_code
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_refunds,
    COALESCE(SUM(r.refunded_amount), 0) as refunded_amount,
    r.status,
    t.currency_code
  FROM refunds r
  JOIN transactions t ON t.transaction_id = r.transaction_id
  WHERE t.merchant_id = p_merchant_id
  GROUP BY r.status, t.currency_code;
END;
$$;

-- Organization Demographics Stats
CREATE OR REPLACE FUNCTION get_organization_demographics()
RETURNS TABLE (
    industry text,
    status text,
    count bigint,
    country text,
    kyc_status text
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.industry::text,
        o.status::text,
        COUNT(*)::bigint,
        o.country::text,
        o.kyc_status::text
    FROM organizations o
    WHERE o.is_deleted = false
    GROUP BY o.industry, o.status, o.country, o.kyc_status;
END;
$$;

-- Customer Demographics Stats
CREATE OR REPLACE FUNCTION get_customer_demographics()
RETURNS TABLE (
    is_business boolean,
    country text,
    count bigint
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.is_business,
        c.country::text,
        COUNT(*)::bigint
    FROM customers c
    WHERE c.is_deleted = false
    GROUP BY c.is_business, c.country;
END;
$$;

-- Team Members Stats
CREATE OR REPLACE FUNCTION get_team_members_stats()
RETURNS TABLE (
    total_members bigint,
    active_members bigint,
    pending_invites bigint,
    average_members_per_merchant numeric
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::bigint as total_members,
        COUNT(*) FILTER (WHERE mol.team_status = 'active')::bigint as active_members,
        COUNT(*) FILTER (WHERE mol.team_status = 'pending')::bigint as pending_invites,
        ROUND(AVG(merchant_count), 2) as average_members_per_merchant
    FROM merchant_organization_links mol
    CROSS JOIN (
        SELECT merchant_id, COUNT(*) as merchant_count
        FROM merchant_organization_links
        WHERE team_status = 'active'
        GROUP BY merchant_id
    ) mc;
END;
$$; 