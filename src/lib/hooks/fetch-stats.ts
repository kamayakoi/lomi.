import { createServerClient, createStorageClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env["VITE_PUBLIC_SUPABASE_URL"];
const SUPABASE_SERVICE_KEY = process.env["VITE_SUPABASE_SERVICE_KEY"];

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing required Supabase environment variables");
}

// Database function return types
type TransactionStats = {
  total_count: number;
  total_gross_amount: number;
  total_net_amount: number;
  total_fee_amount: number;
};

type TransactionByProvider = {
  provider_code: string;
  count: number;
  gross_amount: number;
  net_amount: number;
  fee_amount: number;
};

type TransactionByStatus = {
  status: string;
  count: number;
  gross_amount: number;
};

type TransactionByDate = {
  date: string;
  count: number;
  gross_amount: number;
  net_amount: number;
  fee_amount: number;
};

type TopPerformingProduct = {
  id: string;
  name: string;
  gross_revenue: number;
  net_revenue: number;
  transactions: number;
};

type SubscriptionStats = {
  total_subscriptions: number;
  active_subscriptions: number;
  total_revenue: number;
  recurring_revenue: number;
};

type SubscriptionByPlan = {
  plan_id: string;
  plan_name: string;
  total_count: number;
  active_count: number;
  total_revenue: number;
  recurring_revenue: number;
};

type InvoiceByStatus = {
  status: string;
  count: number;
  amount: number;
  due_amount: number;
};

// Add new types for the additional statistics
type MerchantGrowthStats = {
  total_merchants: number;
  onboarded_merchants: number;
  total_mrr: number;
  total_arr: number;
};

type OrganizationStats = {
  total_organizations: number;
  verified_organizations: number;
  total_customers: number;
  total_merchants: number;
};

type OrganizationByIndustry = {
  industry: string;
  status: string;
  count: number;
};

type OrganizationByCountry = {
  country: string;
  count: number;
};

type OrganizationKycStats = {
  status: string;
  count: number;
};

type CustomerDemographics = {
  is_business: boolean;
  country: string;
  count: number;
};

type MerchantBalanceStats = {
  currency_code: string;
  average_balance: number;
  total_balance: number;
  merchant_count: number;
};

type TransactionStatsByMerchant = {
  merchant_id: string;
  total_transactions: number;
  total_amount: number;
  average_amount: number;
};

type TransactionStatsByProvider = {
  provider_code: string;
  total_transactions: number;
  total_amount: number;
  successful_transactions: number;
  failed_transactions: number;
  success_rate: number;
};

// Add new types for admin metrics
type GlobalProductPlanStats = {
  total_products: number;
  total_plans: number;
  active_subscriptions: number;
  avg_products_per_merchant: number;
};

type GlobalTransactionStats = {
  total_transactions: number;
  total_gross_amount: number;
  total_fee_amount: number;
  total_net_amount: number;
  currency_code: string;
};

type GlobalRefundStats = {
  total_refunds: number;
  total_refunded_amount: number;
  status: string;
  currency_code: string;
};

type GlobalBankingStats = {
  total_bank_accounts: number;
  total_payouts: number;
  total_payout_amount: number;
  currency_code: string;
  payout_status: string;
};

type ApiUsageStats = {
  total_active_users: number;
  last_24h_users: number;
  last_7d_users: number;
  last_30d_users: number;
};

// Add new types for merchant metrics
type MerchantProductStats = {
  total_products: number;
  active_products: number;
  total_plans: number;
  active_plans: number;
};

type MerchantTransactionStats = {
  total_transactions: number;
  total_amount: number;
  total_fees: number;
  net_amount: number;
  currency_code: string;
  status: string;
};

type MerchantCustomerStats = {
  total_customers: number;
  business_customers: number;
  individual_customers: number;
  customers_with_transactions: number;
};

type MerchantRefundStats = {
  total_refunds: number;
  refunded_amount: number;
  status: string;
  currency_code: string;
};

// Custom type for our Supabase client with RPC functions
interface CustomSupabaseClient extends Omit<SupabaseClient, "rpc"> {
  rpc<T>(
    fn: string,
    params?: object
  ): { data: T | null; error: Error | null };
}

export type StatsResponse = {
  core: {
    merchants: number;
    organizations: number;
    customers: number;
    activeTeamMembers: number;
  };
  transactions: {
    total: number;
    totalGrossAmount: number;
    totalNetAmount: number;
    totalFeeAmount: number;
    byProvider: {
      providerCode: string;
      count: number;
      grossAmount: number;
      netAmount: number;
      feeAmount: number;
    }[];
    byStatus: {
      status: string;
      count: number;
      grossAmount: number;
    }[];
    byDate: {
      date: string;
      count: number;
      grossAmount: number;
      netAmount: number;
      feeAmount: number;
    }[];
  };
  products: {
    active: number;
    total: number;
    topPerforming: {
      id: string;
      name: string;
      grossRevenue: number;
      netRevenue: number;
      transactions: number;
    }[];
  };
  subscriptions: {
    total: number;
    active: number;
    totalRevenue: number;
    recurringRevenue: number;
    byPlan: {
      planId: string;
      planName: string;
      totalCount: number;
      activeCount: number;
      totalRevenue: number;
      recurringRevenue: number;
    }[];
  };
  invoices: {
    total: number;
    pending: number;
    byStatus: {
      status: string;
      count: number;
      amount: number;
      dueAmount: number;
    }[];
  };
  storage: {
    logos: number;
    avatars: number;
    kycDocuments: number;
    productImages: number;
    planImages: number;
    total: number;
  };
  growth: {
    merchants: {
      total: number;
      onboarded: number;
      mrr: number;
      arr: number;
    };
    organizations: {
      total: number;
      verified: number;
      totalCustomers: number;
      totalMerchants: number;
    };
  };
  demographics: {
    organizationsByIndustry: {
      industry: string;
      status: string;
      count: number;
    }[];
    organizationsByCountry: {
      country: string;
      count: number;
    }[];
    organizationsByKycStatus: {
      status: string;
      count: number;
    }[];
    customersByType: {
      is_business: boolean;
      country: string;
      count: number;
    }[];
  };
  financials: {
    merchantBalances: {
      currencyCode: string;
      averageBalance: number;
      totalBalance: number;
      merchantCount: number;
    }[];
    transactionsByMerchant: {
      merchantId: string;
      totalTransactions: number;
      totalAmount: number;
      averageAmount: number;
    }[];
    transactionsByProvider: {
      providerCode: string;
      totalTransactions: number;
      totalAmount: number;
      successfulTransactions: number;
      failedTransactions: number;
      successRate: number;
    }[];
  };
  admin: {
    products: {
      total: number;
      totalPlans: number;
      activeSubscriptions: number;
      avgProductsPerMerchant: number;
    };
    transactions: {
      byCurrency: {
        currencyCode: string;
        totalTransactions: number;
        totalGrossAmount: number;
        totalFeeAmount: number;
        totalNetAmount: number;
      }[];
    };
    refunds: {
      byCurrency: {
        currencyCode: string;
        status: string;
        totalRefunds: number;
        totalRefundedAmount: number;
      }[];
    };
    banking: {
      totalBankAccounts: number;
      byStatus: {
        currencyCode: string;
        status: string;
        totalPayouts: number;
        totalAmount: number;
      }[];
    };
    apiUsage: {
      totalActiveUsers: number;
      last24hUsers: number;
      last7dUsers: number;
      last30dUsers: number;
    };
  };
  merchant?: {
    products: {
      total: number;
      active: number;
      totalPlans: number;
      activePlans: number;
    };
    transactions: {
      byCurrency: {
        currencyCode: string;
        status: string;
        totalTransactions: number;
        totalAmount: number;
        totalFees: number;
        netAmount: number;
      }[];
    };
    customers: {
      total: number;
      business: number;
      individual: number;
      withTransactions: number;
    };
    refunds: {
      byCurrency: {
        currencyCode: string;
        status: string;
        totalRefunds: number;
        refundedAmount: number;
      }[];
    };
  };
};

export async function fetchStats(merchantId?: string): Promise<StatsResponse> {
  const supabase = createServerClient(
    SUPABASE_URL as string,
    SUPABASE_SERVICE_KEY as string,
    {
      cookies: {
        get() {
          return null;
        },
        set() {
          return null;
        },
        remove() {
          return null;
        },
      },
    },
  ) as unknown as CustomSupabaseClient;

  const storage = createStorageClient(
    SUPABASE_URL as string,
    SUPABASE_SERVICE_KEY as string,
    {
      cookies: {
        get() {
          return null;
        },
        set() {
          return null;
        },
        remove() {
          return null;
        },
      },
    },
  );

  // Core metrics
  const [
    { count: merchants },
    { count: organizations },
    { count: customers },
    { count: activeTeamMembers },
  ] = await Promise.all([
    supabase
      .from("merchants")
      .select("merchant_id", { count: "exact", head: true })
      .eq("is_deleted", false),
    supabase
      .from("organizations")
      .select("organization_id", { count: "exact", head: true })
      .eq("is_deleted", false),
    supabase
      .from("customers")
      .select("customer_id", { count: "exact", head: true })
      .eq("is_deleted", false),
    supabase
      .from("merchant_organization_links")
      .select("merchant_org_id", { count: "exact", head: true })
      .eq("team_status", "active"),
  ]);

  // Transaction metrics
  const { data: transactionStats } = await supabase.rpc<TransactionStats>("get_transaction_stats");
  const { data: transactionsByProvider } = await supabase.rpc<TransactionByProvider[]>("get_transactions_by_provider");
  const { data: transactionsByStatus } = await supabase.rpc<TransactionByStatus[]>("get_transactions_by_status");
  const { data: transactionsByDate } = await supabase.rpc<TransactionByDate[]>("get_transactions_by_date");

  // Product metrics
  const [
    { count: activeProducts },
    { count: totalProducts },
    { data: topProducts },
  ] = await Promise.all([
    supabase
      .from("merchant_products")
      .select("product_id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("merchant_products")
      .select("product_id", { count: "exact", head: true }),
    supabase.rpc<TopPerformingProduct[]>("get_top_performing_products"),
  ]);

  // Subscription metrics
  const { data: subscriptionStats } = await supabase.rpc<SubscriptionStats>("get_subscription_stats");
  const { data: subscriptionsByPlan } = await supabase.rpc<SubscriptionByPlan[]>("get_subscriptions_by_plan");

  // Invoice metrics
  const [
    { count: totalInvoices },
    { count: pendingInvoices },
    { data: invoicesByStatus },
  ] = await Promise.all([
    supabase
      .from("customer_invoices")
      .select("customer_invoice_id", { count: "exact", head: true }),
    supabase
      .from("customer_invoices")
      .select("customer_invoice_id", { count: "exact", head: true })
      .in("status", ["sent", "overdue"]),
    supabase.rpc<InvoiceByStatus[]>("get_invoices_by_status"),
  ]);

  // Storage metrics
  const [logos, avatars, kycDocs, productImages, planImages] = await Promise.all([
      storage.from("logos").list(),
      storage.from("avatars").list(),
      storage.from("kyc_documents").list(),
      storage.from("product_images").list(),
      storage.from("plan_images").list(),
  ]);

  // Fetch all the new statistics
  const [
    { data: merchantGrowthStats },
    { data: organizationStats },
    { data: organizationsByIndustry },
    { data: organizationsByCountry },
    { data: organizationKycStats },
    { data: customerDemographics },
    { data: merchantBalanceStats },
    { data: transactionStatsByMerchant },
    { data: transactionStatsByProvider }
  ] = await Promise.all([
    supabase.rpc<MerchantGrowthStats>('get_merchant_growth_stats'),
    supabase.rpc<OrganizationStats>('get_organization_stats'),
    supabase.rpc<OrganizationByIndustry[]>('get_organizations_by_industry'),
    supabase.rpc<OrganizationByCountry[]>('get_organizations_by_country'),
    supabase.rpc<OrganizationKycStats[]>('get_organization_kyc_stats'),
    supabase.rpc<CustomerDemographics[]>('get_customer_demographics'),
    supabase.rpc<MerchantBalanceStats[]>('get_merchant_balance_stats'),
    supabase.rpc<TransactionStatsByMerchant[]>('get_transaction_stats_by_merchant'),
    supabase.rpc<TransactionStatsByProvider[]>('get_transaction_stats_by_provider')
  ]);

  // Fetch admin metrics
  const [
    { data: globalProductStats },
    { data: globalTransactionStats },
    { data: globalRefundStats },
    { data: globalBankingStats },
    { data: apiUsageStats }
  ] = await Promise.all([
    supabase.rpc<GlobalProductPlanStats>('get_global_product_plan_stats'),
    supabase.rpc<GlobalTransactionStats[]>('get_global_transaction_stats'),
    supabase.rpc<GlobalRefundStats[]>('get_global_refund_stats'),
    supabase.rpc<GlobalBankingStats[]>('get_global_banking_stats'),
    supabase.rpc<ApiUsageStats>('get_api_usage_stats')
  ]);

  // Fetch merchant metrics if merchantId is provided
  let merchantStats = undefined;
  if (merchantId) {
    const [
      { data: merchantProductStats },
      { data: merchantTransactionStats },
      { data: merchantCustomerStats },
      { data: merchantRefundStats }
    ] = await Promise.all([
      supabase.rpc<MerchantProductStats>('get_merchant_product_stats', { p_merchant_id: merchantId }),
      supabase.rpc<MerchantTransactionStats[]>('get_merchant_transaction_stats', { p_merchant_id: merchantId }),
      supabase.rpc<MerchantCustomerStats>('get_merchant_customer_stats', { p_merchant_id: merchantId }),
      supabase.rpc<MerchantRefundStats[]>('get_merchant_refund_stats', { p_merchant_id: merchantId })
    ]);

    merchantStats = {
      products: {
        total: merchantProductStats?.total_products ?? 0,
        active: merchantProductStats?.active_products ?? 0,
        totalPlans: merchantProductStats?.total_plans ?? 0,
        activePlans: merchantProductStats?.active_plans ?? 0
      },
      transactions: {
        byCurrency: merchantTransactionStats?.map(t => ({
          currencyCode: t.currency_code,
          status: t.status,
          totalTransactions: t.total_transactions,
          totalAmount: t.total_amount,
          totalFees: t.total_fees,
          netAmount: t.net_amount
        })) ?? []
      },
      customers: {
        total: merchantCustomerStats?.total_customers ?? 0,
        business: merchantCustomerStats?.business_customers ?? 0,
        individual: merchantCustomerStats?.individual_customers ?? 0,
        withTransactions: merchantCustomerStats?.customers_with_transactions ?? 0
      },
      refunds: {
        byCurrency: merchantRefundStats?.map(r => ({
          currencyCode: r.currency_code,
          status: r.status,
          totalRefunds: r.total_refunds,
          refundedAmount: r.refunded_amount
        })) ?? []
      }
    };
  }

  return {
    core: {
      merchants: merchants ?? 0,
      organizations: organizations ?? 0,
      customers: customers ?? 0,
      activeTeamMembers: activeTeamMembers ?? 0,
    },
    transactions: {
      total: transactionStats?.total_count ?? 0,
      totalGrossAmount: transactionStats?.total_gross_amount ?? 0,
      totalNetAmount: transactionStats?.total_net_amount ?? 0,
      totalFeeAmount: transactionStats?.total_fee_amount ?? 0,
      byProvider: transactionsByProvider?.map((p: TransactionByProvider) => ({
        providerCode: p.provider_code,
        count: p.count,
        grossAmount: p.gross_amount,
        netAmount: p.net_amount,
        feeAmount: p.fee_amount,
      })) ?? [],
      byStatus: transactionsByStatus?.map((s: TransactionByStatus) => ({
        status: s.status,
        count: s.count,
        grossAmount: s.gross_amount,
      })) ?? [],
      byDate: transactionsByDate?.map((d: TransactionByDate) => ({
        date: d.date,
        count: d.count,
        grossAmount: d.gross_amount,
        netAmount: d.net_amount,
        feeAmount: d.fee_amount,
      })) ?? [],
    },
    products: {
      active: activeProducts ?? 0,
      total: totalProducts ?? 0,
      topPerforming: topProducts?.map((p: TopPerformingProduct) => ({
        id: p.id,
        name: p.name,
        grossRevenue: p.gross_revenue,
        netRevenue: p.net_revenue,
        transactions: p.transactions,
      })) ?? [],
    },
    subscriptions: {
      total: subscriptionStats?.total_subscriptions ?? 0,
      active: subscriptionStats?.active_subscriptions ?? 0,
      totalRevenue: subscriptionStats?.total_revenue ?? 0,
      recurringRevenue: subscriptionStats?.recurring_revenue ?? 0,
      byPlan: subscriptionsByPlan?.map((p: SubscriptionByPlan) => ({
        planId: p.plan_id,
        planName: p.plan_name,
        totalCount: p.total_count,
        activeCount: p.active_count,
        totalRevenue: p.total_revenue,
        recurringRevenue: p.recurring_revenue,
      })) ?? [],
    },
    invoices: {
      total: totalInvoices ?? 0,
      pending: pendingInvoices ?? 0,
      byStatus: invoicesByStatus?.map((s: InvoiceByStatus) => ({
        status: s.status,
        count: s.count,
        amount: s.amount,
        dueAmount: s.due_amount,
      })) ?? [],
    },
    storage: {
      logos: logos.data?.length ?? 0,
      avatars: avatars.data?.length ?? 0,
      kycDocuments: kycDocs.data?.length ?? 0,
      productImages: productImages.data?.length ?? 0,
      planImages: planImages.data?.length ?? 0,
      total: 
        (logos.data?.length ?? 0) +
        (avatars.data?.length ?? 0) +
        (kycDocs.data?.length ?? 0) +
        (productImages.data?.length ?? 0) +
        (planImages.data?.length ?? 0),
    },
    growth: {
      merchants: {
        total: merchantGrowthStats?.total_merchants ?? 0,
        onboarded: merchantGrowthStats?.onboarded_merchants ?? 0,
        mrr: merchantGrowthStats?.total_mrr ?? 0,
        arr: merchantGrowthStats?.total_arr ?? 0
      },
      organizations: {
        total: organizationStats?.total_organizations ?? 0,
        verified: organizationStats?.verified_organizations ?? 0,
        totalCustomers: organizationStats?.total_customers ?? 0,
        totalMerchants: organizationStats?.total_merchants ?? 0
      }
    },
    demographics: {
      organizationsByIndustry: organizationsByIndustry?.map(org => ({
        industry: org.industry,
        status: org.status,
        count: org.count
      })) ?? [],
      organizationsByCountry: organizationsByCountry?.map(org => ({
        country: org.country,
        count: org.count
      })) ?? [],
      organizationsByKycStatus: organizationKycStats?.map(kyc => ({
        status: kyc.status,
        count: kyc.count
      })) ?? [],
      customersByType: customerDemographics?.map(demo => ({
        is_business: demo.is_business,
        country: demo.country,
        count: demo.count
      })) ?? []
    },
    financials: {
      merchantBalances: merchantBalanceStats?.map(balance => ({
        currencyCode: balance.currency_code,
        averageBalance: balance.average_balance,
        totalBalance: balance.total_balance,
        merchantCount: balance.merchant_count
      })) ?? [],
      transactionsByMerchant: transactionStatsByMerchant?.map(stat => ({
        merchantId: stat.merchant_id,
        totalTransactions: stat.total_transactions,
        totalAmount: stat.total_amount,
        averageAmount: stat.average_amount
      })) ?? [],
      transactionsByProvider: transactionStatsByProvider?.map(stat => ({
        providerCode: stat.provider_code,
        totalTransactions: stat.total_transactions,
        totalAmount: stat.total_amount,
        successfulTransactions: stat.successful_transactions,
        failedTransactions: stat.failed_transactions,
        successRate: stat.success_rate
      })) ?? []
    },
    admin: {
      products: {
        total: globalProductStats?.total_products ?? 0,
        totalPlans: globalProductStats?.total_plans ?? 0,
        activeSubscriptions: globalProductStats?.active_subscriptions ?? 0,
        avgProductsPerMerchant: globalProductStats?.avg_products_per_merchant ?? 0
      },
      transactions: {
        byCurrency: globalTransactionStats?.map(t => ({
          currencyCode: t.currency_code,
          totalTransactions: t.total_transactions,
          totalGrossAmount: t.total_gross_amount,
          totalFeeAmount: t.total_fee_amount,
          totalNetAmount: t.total_net_amount
        })) ?? []
      },
      refunds: {
        byCurrency: globalRefundStats?.map(r => ({
          currencyCode: r.currency_code,
          status: r.status,
          totalRefunds: r.total_refunds,
          totalRefundedAmount: r.total_refunded_amount
        })) ?? []
      },
      banking: {
        totalBankAccounts: globalBankingStats?.[0]?.total_bank_accounts ?? 0,
        byStatus: globalBankingStats?.map(b => ({
          currencyCode: b.currency_code,
          status: b.payout_status,
          totalPayouts: b.total_payouts,
          totalAmount: b.total_payout_amount
        })) ?? []
      },
      apiUsage: {
        totalActiveUsers: apiUsageStats?.total_active_users ?? 0,
        last24hUsers: apiUsageStats?.last_24h_users ?? 0,
        last7dUsers: apiUsageStats?.last_7d_users ?? 0,
        last30dUsers: apiUsageStats?.last_30d_users ?? 0
      }
    },
    merchant: merchantStats
  };
}
