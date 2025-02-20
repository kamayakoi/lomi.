import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Table } from "@tanstack/react-table";
import { type Category } from "./columns";

interface Props {
  table?: Table<Category>;
  onOpenChange?: (isOpen: boolean) => void;
}

export function Header({ table, onOpenChange }: Props) {
  return (
    <div className="flex items-center py-4 justify-between">
      <Input
        placeholder="Search..."
        value={(table?.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          table?.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      <Button onClick={() => onOpenChange?.(true)}>Create</Button>
    </div>
  );
}
