import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { BillItem } from "@/types/billing";

interface BillingTableProps {
  items: BillItem[];
  onRemoveItem: (index: number) => void;
  total: number;
}

export const BillingTable = ({ items = [], onRemoveItem, total = 0 }: BillingTableProps) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Price (₹)</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Total (₹)</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item?.productTitle}</TableCell>
              <TableCell className="text-right">{(item?.sellingPrice || 0).toFixed(2)}</TableCell>
              <TableCell className="text-right">{item?.quantity}</TableCell>
              <TableCell className="text-right">{(item?.total || 0).toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveItem?.(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {(!items || items.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No items in bill
              </TableCell>
            </TableRow>
          )}
          {items?.length > 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-right font-bold">
                Total:
              </TableCell>
              <TableCell className="text-right font-bold">
                ₹{(total || 0).toFixed(2)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};