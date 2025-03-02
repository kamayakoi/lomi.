import { startOfMonth } from "date-fns";
import { z } from "zod";
import { SupabaseClient } from '@supabase/supabase-js';

interface FeeBreakdown {
  fee_type: 'platform' | 'processing' | 'conversion' | 'payout' | 'refund';
  total_fees: number;
  total_transactions: bigint;
  currency_code: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

async function getMerchantFeeBreakdown(
  supabase: SupabaseClient,
  params: {
    merchantId: string;
    startDate: string;
    endDate: string;
    currencyCode?: string;
  }
): Promise<FeeBreakdown[]> {
  const { data, error } = await supabase
    .rpc('get_merchant_fee_breakdown', {
      p_merchant_id: params.merchantId,
      p_start_date: params.startDate,
      p_end_date: params.endDate,
      p_currency_code: params.currencyCode
    });

  if (error) {
    console.error('Error fetching merchant fee breakdown:', error);
    throw new Error('Failed to fetch fee breakdown');
  }

  return data || [];
}

export function getFeesTool({
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
    description: "Get detailed fee breakdown by type and status",
    parameters: z.object({
      startDate: z.coerce
        .date()
        .describe("The start date for fee analysis (ISO-8601 format)")
        .default(new Date(defaultValues.from)),
      endDate: z.coerce
        .date()
        .describe("The end date for fee analysis (ISO-8601 format)")
        .default(new Date(defaultValues.to)),
      currency: z.string()
        .describe("The currency code for fee analysis (e.g., XOF)")
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
      const fees = await getMerchantFeeBreakdown(supabase, {
        merchantId,
        startDate: startOfMonth(startDate).toISOString(),
        endDate: endDate.toISOString(),
        currencyCode: currency,
      });

      if (!fees.length) {
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

      // Group by currency and fee type
      const byCurrency = fees.reduce((acc, fee) => {
        const key = fee.currency_code;
        if (!acc[key]) {
          acc[key] = {
            totalFees: 0,
            totalTransactions: 0n,
            byType: {} as Record<FeeBreakdown['fee_type'], {
              fees: number;
              transactions: bigint;
              byStatus: Record<FeeBreakdown['status'], {
                count: bigint;
                fees: number;
              }>;
            }>,
          };
        }

        if (!acc[key].byType[fee.fee_type]) {
          acc[key].byType[fee.fee_type] = {
            fees: 0,
            transactions: 0n,
            byStatus: {
              completed: { count: 0n, fees: 0 },
              pending: { count: 0n, fees: 0 },
              failed: { count: 0n, fees: 0 },
              refunded: { count: 0n, fees: 0 },
            },
          };
        }

        const typeStats = acc[key].byType[fee.fee_type];
        acc[key].totalFees += fee.total_fees;
        acc[key].totalTransactions += fee.total_transactions;
        typeStats.fees += fee.total_fees;
        typeStats.transactions += fee.total_transactions;
        typeStats.byStatus[fee.status].count += fee.total_transactions;
        typeStats.byStatus[fee.status].fees += fee.total_fees;

        return acc;
      }, {} as Record<string, {
        totalFees: number;
        totalTransactions: bigint;
        byType: Record<FeeBreakdown['fee_type'], {
          fees: number;
          transactions: bigint;
          byStatus: Record<FeeBreakdown['status'], {
            count: bigint;
            fees: number;
          }>;
        }>;
      }>);

      return {
        data: Object.entries(byCurrency).map(([currency, data]) => ({
          currency,
          total: {
            fees: data.totalFees,
            transactions: Number(data.totalTransactions),
          },
          byType: Object.entries(data.byType).map(([type, typeData]) => ({
            type,
            total: {
              fees: typeData.fees,
              transactions: Number(typeData.transactions),
              averageFee: typeData.fees / Number(typeData.transactions),
            },
            byStatus: {
              completed: {
                count: Number(typeData.byStatus.completed.count),
                fees: typeData.byStatus.completed.fees,
              },
              pending: {
                count: Number(typeData.byStatus.pending.count),
                fees: typeData.byStatus.pending.fees,
              },
              failed: {
                count: Number(typeData.byStatus.failed.count),
                fees: typeData.byStatus.failed.fees,
              },
              refunded: {
                count: Number(typeData.byStatus.refunded.count),
                fees: typeData.byStatus.refunded.fees,
              },
            },
          })),
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
