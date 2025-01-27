import { Card } from "@/components/ui/card";
import { ChartLine, Calendar } from "lucide-react";

const Sales = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <ChartLine className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Monthly Sales</p>
              <p className="text-2xl font-bold">₹150,000</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Daily Average</p>
              <p className="text-2xl font-bold">₹5,000</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sales;