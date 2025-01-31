import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

interface SalesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

const SalesFilters = ({ searchTerm, onSearchChange, dateRange, onDateChange }: SalesFiltersProps) => {
  const handlePresetRange = (preset: 'today' | 'week' | 'month' | 'all') => {
    const today = new Date();
    switch (preset) {
      case 'today':
        onDateChange({
          from: startOfDay(today),
          to: endOfDay(today)
        });
        break;
      case 'week':
        onDateChange({
          from: startOfWeek(today),
          to: endOfWeek(today)
        });
        break;
      case 'month':
        onDateChange({
          from: startOfMonth(today),
          to: endOfMonth(today)
        });
        break;
      case 'all':
        onDateChange(undefined);
        break;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
          onDateChange={onDateChange}
        />
      </div>
    </div>
  );
};

export default SalesFilters;