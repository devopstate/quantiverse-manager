import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartLine, Calendar } from "lucide-react";
import { BillingTransaction } from "@/types/billing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Sales = () => {
  const [transactions, setTransactions] = useState<BillingTransaction[]>([]);

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('billingTransactions') || '[]');
    setTransactions(storedTransactions);
  }, []);

  const calculateTotalSales = () => {
    return transactions.reduce((total, transaction) => total + (transaction.total || 0), 0);
  };

  const calculateDailyAverage = () => {
    if (transactions.length === 0) return 0;
    return calculateTotalSales() / transactions.length;
  };

  const calculatePnL = (purchasePrice: number, sellingPrice: number, quantity: number) => {
    if (!purchasePrice || !sellingPrice || !quantity) return 0;
    const totalCost = purchasePrice * quantity;
    const totalRevenue = sellingPrice * quantity;
    return totalRevenue - totalCost;
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return "₹0.00";
    return `₹${value.toFixed(2)}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <ChartLine className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">{formatCurrency(calculateTotalSales())}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Daily Average</p>
              <p className="text-2xl font-bold">{formatCurrency(calculateDailyAverage())}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Product Details</TableHead>
              <TableHead className="text-right">Purchase Price</TableHead>
              <TableHead className="text-right">Selling Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">P&L</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
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
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Sales;