export type RefundFeeConfig = {
  full: { percentage: number; fixed_amount: number };
  partial: { percentage: number; fixed_amount: number };
};

export function calculateRefundProcessingFee(
  refundFeeConfig: RefundFeeConfig | null,
  amount: number,
  isFullRefund: boolean,
): number {
  const config = isFullRefund
    ? refundFeeConfig?.full
    : refundFeeConfig?.partial;

  if (!config) return 0;

  const percentageFee = (amount * (config.percentage ?? 0)) / 100;
  const fixedFee = config.fixed_amount ?? 0;

  return Math.round((percentageFee + fixedFee) * 100) / 100;
}

/** Effective percentage passed to update_organization_balance_for_refund (incl. fixed fee as % of amount). */
export function refundFeePercentageForBalanceRpc(
  refundFeeConfig: RefundFeeConfig | null,
  amount: number,
  isFullRefund: boolean,
): number {
  const config = isFullRefund
    ? refundFeeConfig?.full
    : refundFeeConfig?.partial;

  if (!config || amount <= 0) return 0;

  return (
    (config.percentage ?? 0) + ((config.fixed_amount ?? 0) / amount) * 100
  );
}
