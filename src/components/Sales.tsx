import { useEffect, useState } from "react";
import { BillingTransaction } from "@/types/billing";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import SalesStats from "./sales/SalesStats";
import SalesFilters from "./sales/SalesFilters";
import SalesTable from "./sales/SalesTable";

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

const ITEMS_PER_PAGE = 10;

const Sales = () => {
  const [transactions, setTransactions] = useState<BillingTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      const transactionDate = transaction?.date ? new Date(transaction.date) : null;
      const isWithinDateRange = 
        !dateRange?.from || !dateRange?.to || !transactionDate ? true :
        (transactionDate >= dateRange.from && transactionDate <= dateRange.to);

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

  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Overview</h1>
      
      <SalesStats 
        filteredTransactions={filteredAndSortedTransactions}
        dateRange={dateRange}
      />

      <SalesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dateRange={dateRange}
        onDateChange={setDateRange}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <SalesTable
          transactions={paginatedTransactions}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </div>
    </div>
  );
};

export default Sales;