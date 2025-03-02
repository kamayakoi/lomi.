import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTableSkeleton } from "./loading";
import { type Transaction } from "./columns";

interface TableProps {
  data: Transaction[];
  isLoading?: boolean;
  pageSize?: number;
  hasFilters?: boolean;
  query?: string;
}

export function Table({
  data = [],
  isLoading = false,
  pageSize = 50,
  hasFilters = false,
  query,
}: TableProps) {
  if (isLoading) {
    return <TransactionsTableSkeleton />;
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {query?.length
                ? "No transactions found matching your search criteria."
                : hasFilters
                  ? "No transactions found matching your filters."
                  : "No transactions found. Start processing payments to see them here."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      pageSize={pageSize}
      hasFilters={hasFilters}
      query={query}
    />
  );
}
