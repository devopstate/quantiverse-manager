import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Product } from "@/types/inventory";

interface TableHeaderProps {
  onSort: (field: keyof Product) => void;
}

export const ProductTableHeader = ({ onSort }: TableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead onClick={() => onSort("createdAt")} className="cursor-pointer">
          Date <ArrowUpDown className="inline h-4 w-4" />
        </TableHead>
        <TableHead onClick={() => onSort("category")} className="cursor-pointer">
          Category <ArrowUpDown className="inline h-4 w-4" />
        </TableHead>
        <TableHead onClick={() => onSort("title")} className="cursor-pointer">
          Product Title <ArrowUpDown className="inline h-4 w-4" />
        </TableHead>
        <TableHead onClick={() => onSort("purchasePrice")} className="cursor-pointer">
          Purchase Price (₹) <ArrowUpDown className="inline h-4 w-4" />
        </TableHead>
        <TableHead onClick={() => onSort("sellingPrice")} className="cursor-pointer">
          Selling Price (₹) <ArrowUpDown className="inline h-4 w-4" />
        </TableHead>
        <TableHead onClick={() => onSort("quantity")} className="cursor-pointer">
          Quantity <ArrowUpDown className="inline h-4 w-4" />
        </TableHead>
        <TableHead onClick={() => onSort("status")} className="cursor-pointer">
          Status <ArrowUpDown className="inline h-4 w-4" />
        </TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};