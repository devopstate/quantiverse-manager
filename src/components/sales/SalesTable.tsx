import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BillingTransaction } from "@/types/billing";
import { Button } from "@/components/ui/button";

interface SalesTableProps {
  transactions: BillingTransaction[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' };
  onSort: (key: string) => void;
}

const SalesTable = ({
  transactions,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
  sortConfig,
  onSort,
}: SalesTableProps) => {
  const calculatePnL = (purchasePrice: number, sellingPrice: number, quantity: number) => {
    if (!purchasePrice || !sellingPrice || !quantity) return 0;
    const totalCost = purchasePrice * quantity;
    const totalRevenue = sellingPrice * quantity;
    return totalRevenue - totalCost;
  };

  const calculateItemTotal = (sellingPrice: number, quantity: number) => {
    if (!sellingPrice || !quantity) return 0;
    return sellingPrice * quantity;
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return "₹0.00";
    return `₹${value.toFixed(2)}`;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => onSort('id')} className="cursor-pointer">
              Transaction ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => onSort('date')} className="cursor-pointer">
              Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Product Details</TableHead>
            <TableHead className="text-right">Purchase Price</TableHead>
            <TableHead className="text-right">Selling Price</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Item Total</TableHead>
            <TableHead className="text-right">P&L</TableHead>
            <TableHead className="text-right">Total Billed Amt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <>
              {transaction.items.map((item, itemIndex) => (
                <TableRow key={`${transaction.id}-${itemIndex}`}>
                  {itemIndex === 0 && (
                    <TableCell rowSpan={transaction.items.length}>
                      {transaction.id}
                    </TableCell>
                  )}
                  {itemIndex === 0 && (
                    <TableCell rowSpan={transaction.items.length}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                  )}
                  <TableCell>{item.productTitle}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.purchasePrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.sellingPrice)}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(calculateItemTotal(item.sellingPrice, item.quantity))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(calculatePnL(item.purchasePrice, item.sellingPrice, item.quantity))}
                  </TableCell>
                  {itemIndex === 0 && (
                    <TableCell className="text-right" rowSpan={transaction.items.length}>
                      {formatCurrency(transaction.total)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </>
          ))}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default SalesTable;