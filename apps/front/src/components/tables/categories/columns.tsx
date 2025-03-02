import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export type Category = {
  id: string;
  name: string;
  system: boolean;
  vat?: string;
  color: string;
};

export const columns: ColumnDef<Category>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex space-x-2 items-center">
        <div
          className="size-3"
          style={{ backgroundColor: row.original.color }}
        />
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">{row.getValue("name")}</span>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>

        {row.original.system && (
          <div className="pl-2">
            <span className="border border-border rounded-full py-1.5 px-3 text-xs text-[#878787] font-mono">
              System
            </span>
          </div>
        )}
      </div>
    ),
  },
  {
    header: "VAT",
    accessorKey: "vat",
    cell: ({ row }) => (row.getValue("vat") ? `${row.getValue("vat")}%` : "-"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Edit
              </DropdownMenuItem>
              {!row.original.system && (
                <DropdownMenuItem
                  onClick={() => {
                    console.log("delete");
                  }}
                >
                  Remove
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
