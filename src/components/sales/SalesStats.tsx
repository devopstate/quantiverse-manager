import { Card } from "@/components/ui/card";
import { ChartLine, Calendar } from "lucide-react";
import { BillingTransaction } from "@/types/billing";
import { DateRange } from "react-day-picker";

interface SalesStatsProps {
  filteredTransactions: BillingTransaction[];
  dateRange: DateRange | undefined;
}

const SalesStats = ({ filteredTransactions, dateRange }: SalesStatsProps) => {
  const calculateTotalSales = (transactions: BillingTransaction[]) => {
    return transactions.reduce((total, transaction) => total + (transaction.total || 0), 0);
  };

  const calculateDailyAverage = (transactions: BillingTransaction[]) => {
    if (transactions.length === 0) return 0;
    
    if (!dateRange?.from || !dateRange?.to) {
      return calculateTotalSales(transactions) / transactions.length;
    }

    const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return calculateTotalSales(transactions) / daysDiff;
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return "₹0.00";
    return `₹${value.toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <ChartLine className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold">{formatCurrency(calculateTotalSales(filteredTransactions))}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-gray-500">Daily Average</p>
            <p className="text-2xl font-bold">{formatCurrency(calculateDailyAverage(filteredTransactions))}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SalesStats;