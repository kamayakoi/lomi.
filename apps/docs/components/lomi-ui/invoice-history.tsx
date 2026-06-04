import * as React from 'react';
import { Download, ReceiptText } from 'lucide-react';

export interface InvoiceHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'refunded' | 'void';
  invoiceUrl?: string;
}

export interface InvoiceHistoryProps {
  invoices: InvoiceHistoryItem[];
  title?: string;
  description?: string;
  onDownload?: (invoiceId: string) => void;
  className?: string;
}

const statusClasses: Record<InvoiceHistoryItem['status'], string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  open: 'bg-sky-50 text-[#2478d4] border-sky-100',
  refunded: 'bg-amber-50 text-amber-700 border-amber-100',
  void: 'bg-gray-50 text-gray-500 border-gray-200',
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function InvoiceHistory({
  invoices,
  title = 'Invoice history',
  description = 'Past invoices and payment receipts.',
  onDownload,
  className,
}: InvoiceHistoryProps) {
  return (
    <section
      className={cn(
        'w-full overflow-hidden rounded-sm border border-gray-200 bg-white text-gray-950 shadow-sm',
        className,
      )}
    >
      <div className="border-b border-gray-100 p-5">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <ReceiptText className="h-4 w-4 text-[#56A5F9]" />
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Description</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 text-right font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No invoices yet
                </td>
              </tr>
            ) : null}
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                  {invoice.date}
                </td>
                <td className="px-5 py-4 font-medium">{invoice.description}</td>
                <td className="whitespace-nowrap px-5 py-4 text-right font-medium">
                  {formatMoney(invoice.amount, invoice.currency)}
                </td>
                <td className="px-5 py-4 text-right">
                  <span
                    className={cn(
                      'inline-flex rounded-sm border px-2 py-1 text-xs font-medium capitalize',
                      statusClasses[invoice.status],
                    )}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      invoice.invoiceUrl
                        ? window.open(
                            invoice.invoiceUrl,
                            '_blank',
                            'noopener,noreferrer',
                          )
                        : onDownload?.(invoice.id)
                    }
                    className="inline-flex h-8 items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#56A5F9] focus-visible:ring-offset-2"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
