import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartLine, Calendar, Search } from "lucide-react";
import { BillingTransaction } from "@/types/billing";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

const Sales = () => {
  const [transactions, setTransactions] = useState<BillingTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Load transactions from localStorage on component mount
  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem('billingTransactions');
      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions).map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date)
        }));
        setTransactions(parsedTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    }
  }, []);

  const calculateTotalSales = (filteredTransactions: BillingTransaction[]) => {
    return filteredTransactions.reduce((total, transaction) => total + (transaction.total || 0), 0);
  };

  const calculateDailyAverage = (filteredTransactions: BillingTransaction[]) => {
    if (filteredTransactions.length === 0) return 0;
    
    if (!dateRange?.from || !dateRange?.to) {
      return calculateTotalSales(filteredTransactions) / filteredTransactions.length;
    }

    // Calculate the number of days in the date range
    const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return calculateTotalSales(filteredTransactions) / daysDiff;
  };

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

  const handlePresetRange = (preset: 'today' | 'week' | 'month' | 'all') => {
    const today = new Date();
    switch (preset) {
      case 'today':
        setDateRange({
          from: startOfDay(today),
          to: endOfDay(today)
        });
        break;
      case 'week':
        setDateRange({
          from: startOfWeek(today),
          to: endOfWeek(today)
        });
        break;
      case 'month':
        setDateRange({
          from: startOfMonth(today),
          to: endOfMonth(today)
        });
        break;
      case 'all':
        setDateRange(undefined);
        break;
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      // Date range filter with null checks
      const transactionDate = transaction?.date ? new Date(transaction.date) : null;
      const isWithinDateRange = 
        !dateRange?.from || !dateRange?.to || !transactionDate ? true :
        (transactionDate >= dateRange.from && transactionDate <= dateRange.to);

      // Search filter with null checks
      const searchLower = (searchTerm || '').toLowerCase();
      const matchesSearch = 
        !searchTerm ? true :
        (transaction?.items || []).some(item =>
          (item?.productTitle || '').toLowerCase().includes(searchLower) ||
          (item?.purchasePrice?.toString() || '').includes(searchLower) ||
          (item?.sellingPrice?.toString() || '').includes(searchLower) ||
          (item?.quantity?.toString() || '').includes(searchLower)
        ) ||
        (transaction?.id || '').toLowerCase().includes(searchLower) ||
        (transactionDate?.toLocaleDateString() || '').includes(searchLower);

      return isWithinDateRange && matchesSearch;
    })
    .sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (sortConfig.key === 'date') {
        return ((new Date(a?.date || 0)).getTime() - (new Date(b?.date || 0)).getTime()) * direction;
      }
      return 0;
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <ChartLine className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">{formatCurrency(calculateTotalSales(filteredAndSortedTransactions))}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Daily Average</p>
              <p className="text-2xl font-bold">{formatCurrency(calculateDailyAverage(filteredAndSortedTransactions))}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Date Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetRange('today')}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetRange('week')}
            >
              This Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetRange('month')}
            >
              This Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetRange('all')}
            >
              All Time
            </Button>
          </div>
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('id')} className="cursor-pointer">
                Transaction ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
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
            {filteredAndSortedTransactions.map((transaction) => (
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
            {filteredAndSortedTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
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
