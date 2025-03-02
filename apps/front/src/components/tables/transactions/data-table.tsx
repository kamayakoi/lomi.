import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { type Transaction } from "./columns";
import { DataTableHeader } from "./data-table-header";
import { DataTablePagination } from "./data-table-pagination";
import { BottomBar } from "./bottom-bar";
import { ExportBar } from "./export-bar";
import { ReloadIcon } from "@radix-ui/react-icons";

interface DataTableProps {
  columns: ColumnDef<Transaction, unknown>[];
  data: Transaction[];
  pageSize?: number;
  hasFilters?: boolean;
  query?: string;
}

export function DataTable({
  columns,
  data,
  pageSize = 50,
  hasFilters = false,
  query,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoading, setIsLoading] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize,
      },
    },
    state: {
      rowSelection,
      columnVisibility,
    },
  });

  const selectedRows = Object.keys(rowSelection).length;
  const showBottomBar = Boolean((hasFilters && !selectedRows) || (query && !selectedRows));

  return (
    <div className="space-y-4">
      <DataTableHeader table={table} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      {isLoading && (
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center space-x-2 px-6 py-5">
            <ReloadIcon className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading more...</span>
          </div>
        </div>
      )}

      <BottomBar
        show={showBottomBar}
        count={data.length}
        totalAmount={[
          {
            amount: data.reduce((sum, item) => sum + (item.amount || 0), 0),
            currency: data[0]?.currency || "USD",
          },
        ]}
      />

      <ExportBar
        selected={selectedRows}
        onDeselect={() => setRowSelection({})}
        onExport={() => {
          setIsLoading(true);
          // Simulate export
          setTimeout(() => setIsLoading(false), 2000);
        }}
        isExporting={isLoading}
      />
    </div>
  );
}
