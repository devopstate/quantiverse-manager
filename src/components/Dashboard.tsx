import { Card } from "@/components/ui/card";
import { ChartBar, Database, DollarSign, Box } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <DollarSign className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">₹50,000</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <Box className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Products</p>
              <p className="text-2xl font-bold">124</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <Database className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <ChartBar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold">₹25,000</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;