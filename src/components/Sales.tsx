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
    return transactions.reduce((total, transaction) => total + transaction.total, 0);
  };

  const calculateDailyAverage = () => {
    if (transactions.length === 0) return 0;
    return calculateTotalSales() / transactions.length;
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
              <p className="text-2xl font-bold">₹{calculateTotalSales().toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Daily Average</p>
              <p className="text-2xl font-bold">₹{calculateDailyAverage().toFixed(2)}</p>
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
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.items.length} items</TableCell>
                <TableCell className="text-right">₹{transaction.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
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