import { createServerClient, createStorageClient } from "@/utils/supabase/server";

const SUPABASE_URL = process.env["VITE_PUBLIC_SUPABASE_URL"];
const SUPABASE_SERVICE_KEY = process.env["VITE_SUPABASE_SERVICE_KEY"];

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing required Supabase environment variables");
}

export async function fetchStats() {
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
  );

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

  // Fetch counts from all relevant tables
  const [
    { count: merchants },
    { count: organizations },
    { count: transactions },
    { count: bankAccounts },
    { count: customers },
    { count: notifications },
    { count: merchantLinks },
    { count: products },
    { count: subscriptionPlans },
    { count: subscriptions },
    { count: invoices },
    storageStats,
  ] = await Promise.all([
    // Core business entities
    supabase
      .from("merchants")
      .select("merchant_id", { count: "exact", head: true })
      .eq("is_deleted", false)
      .limit(1),
    supabase
      .from("organizations")
      .select("organization_id", { count: "exact", head: true })
      .eq("is_deleted", false)
      .limit(1),
    // Transactions and financial data
    supabase
      .from("transactions")
      .select("transaction_id", { count: "exact", head: true })
      .eq("status", "completed")
      .limit(1),
    supabase
      .from("merchant_bank_accounts")
      .select("bank_account_id", { count: "exact", head: true })
      .eq("is_valid", true)
      .limit(1),
    // Customer data
    supabase
      .from("customers")
      .select("customer_id", { count: "exact", head: true })
      .eq("is_deleted", false)
      .limit(1),
    supabase
      .from("notifications")
      .select("notification_id", { count: "exact", head: true })
      .eq("is_read", false)
      .limit(1),
    // Merchant relationships
    supabase
      .from("merchant_organization_links")
      .select("merchant_org_id", { count: "exact", head: true })
      .eq("team_status", "active")
      .limit(1),
    // Products and subscriptions
    supabase
      .from("merchant_products")
      .select("product_id", { count: "exact", head: true })
      .eq("is_active", true)
      .limit(1),
    supabase
      .from("subscription_plans")
      .select("plan_id", { count: "exact", head: true })
      .eq("display_on_storefront", true)
      .limit(1),
    supabase
      .from("merchant_subscriptions")
      .select("subscription_id", { count: "exact", head: true })
      .eq("subscription_status", "active")
      .limit(1),
    // Invoices
    supabase
      .from("customer_invoices")
      .select("customer_invoice_id", { count: "exact", head: true })
      .in("status", ["sent", "overdue"])
      .limit(1),
    // Storage statistics across all buckets
    Promise.all([
      storage.from("logos").list(),
      storage.from("avatars").list(),
      storage.from("kyc_documents").list(),
      storage.from("product_images").list(),
      storage.from("plan_images").list(),
    ]).then((results) => ({
      logos: results[0].data?.length ?? 0,
      avatars: results[1].data?.length ?? 0,
      kycDocs: results[2].data?.length ?? 0,
      productImages: results[3].data?.length ?? 0,
      planImages: results[4].data?.length ?? 0,
    })),
  ]);

  return {
    // Core metrics
    merchants,
    organizations,
    transactions,
    bankAccounts,
    customers,
    unreadNotifications: notifications,
    activeTeamMembers: merchantLinks,
    
    // Product metrics
    activeProducts: products,
    activePlans: subscriptionPlans,
    activeSubscriptions: subscriptions,
    pendingInvoices: invoices,
    
    // Storage metrics
    storage: {
      logos: storageStats.logos,
      avatars: storageStats.avatars,
      kycDocuments: storageStats.kycDocs,
      productImages: storageStats.productImages,
      planImages: storageStats.planImages,
      total: 
        storageStats.logos +
        storageStats.avatars +
        storageStats.kycDocs +
        storageStats.productImages +
        storageStats.planImages,
    },
  };
}
