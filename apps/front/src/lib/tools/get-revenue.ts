import { startOfMonth } from "date-fns";
import { z } from "zod";
import { SupabaseClient } from '@supabase/supabase-js';

interface TransactionStats {
  total_transactions: bigint;
  total_amount: number;
  total_fees: number;
  net_amount: number;
  currency_code: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

async function getMerchantTransactionStats(
  supabase: SupabaseClient,
  params: {
    merchantId: string;
    startDate: string;
    endDate: string;
    currencyCode?: string;
  }
): Promise<TransactionStats[]> {
  const { data, error } = await supabase
    .rpc('get_merchant_transaction_stats', {
      p_merchant_id: params.merchantId,
      p_start_date: params.startDate,
      p_end_date: params.endDate,
      p_currency_code: params.currencyCode
    });

  if (error) {
    console.error('Error fetching merchant transaction stats:', error);
    throw new Error('Failed to fetch transaction stats');
  }

  return data || [];
}

export function getRevenueTool({
  defaultValues,
  supabase,
  merchantId,
}: {
  defaultValues: {
    from: string;
    to: string;
  };
  supabase: SupabaseClient;
  merchantId: string;
}) {
  return {
    description: "Get detailed revenue statistics including transaction counts, amounts, and fees",
    parameters: z.object({
      startDate: z.coerce
        .date()
        .describe("The start date for revenue analysis (ISO-8601 format)")
        .default(new Date(defaultValues.from)),
      endDate: z.coerce
        .date()
        .describe("The end date for revenue analysis (ISO-8601 format)")
        .default(new Date(defaultValues.to)),
      currency: z.string()
        .describe("The currency code for revenue analysis (e.g., XOF)")
        .optional(),
    }),
    execute: async ({
      currency,
      startDate,
      endDate,
    }: {
      currency?: string;
      startDate: Date;
      endDate: Date;
    }) => {
      const stats = await getMerchantTransactionStats(supabase, {
        merchantId,
        startDate: startOfMonth(startDate).toISOString(),
        endDate: endDate.toISOString(),
        currencyCode: currency,
      });

      if (!stats.length) {
        return {
          data: null,
          metadata: {
            period: {
              from: startDate.toISOString(),
              to: endDate.toISOString()
            }
          }
        };
      }

      // Group by currency and calculate totals
      const byCurrency = stats.reduce((acc, stat) => {
        const key = stat.currency_code;
        if (!acc[key]) {
          acc[key] = {
            totalTransactions: 0n,
            totalAmount: 0,
            totalFees: 0,
            netAmount: 0,
            byStatus: {
              completed: { count: 0n, amount: 0 },
              pending: { count: 0n, amount: 0 },
              failed: { count: 0n, amount: 0 },
              refunded: { count: 0n, amount: 0 },
            }
          };
        }

        acc[key].totalTransactions += stat.total_transactions;
        acc[key].totalAmount += stat.total_amount;
        acc[key].totalFees += stat.total_fees;
        acc[key].netAmount += stat.net_amount;
        acc[key].byStatus[stat.status].count += stat.total_transactions;
        acc[key].byStatus[stat.status].amount += stat.total_amount;

        return acc;
      }, {} as Record<string, {
        totalTransactions: bigint;
        totalAmount: number;
        totalFees: number;
        netAmount: number;
        byStatus: Record<'completed' | 'pending' | 'failed' | 'refunded', {
          count: bigint;
          amount: number;
        }>;
      }>);

      return {
        data: Object.entries(byCurrency).map(([currency, data]) => ({
          currency,
          transactions: {
            total: Number(data.totalTransactions),
            completed: Number(data.byStatus.completed.count),
            pending: Number(data.byStatus.pending.count),
            failed: Number(data.byStatus.failed.count),
            refunded: Number(data.byStatus.refunded.count),
          },
          amounts: {
            gross: data.totalAmount,
            fees: data.totalFees,
            net: data.netAmount,
          },
          byStatus: {
            completed: {
              count: Number(data.byStatus.completed.count),
              amount: data.byStatus.completed.amount,
            },
            pending: {
              count: Number(data.byStatus.pending.count),
              amount: data.byStatus.pending.amount,
            },
            failed: {
              count: Number(data.byStatus.failed.count),
              amount: data.byStatus.failed.amount,
            },
            refunded: {
              count: Number(data.byStatus.refunded.count),
              amount: data.byStatus.refunded.amount,
            },
          }
        })),
        metadata: {
          period: {
            from: startDate.toISOString(),
            to: endDate.toISOString()
          }
        }
      };
    },
  };
}
