import { useState } from "react";
import { Product } from "@/types/inventory";
import { BillItem } from "@/types/billing";
import { BillingForm } from "./billing/BillingForm";
import { BillingTable } from "./billing/BillingTable";
import { useToast } from "@/hooks/use-toast";

const Billing = () => {
  const [currentBill, setCurrentBill] = useState<BillItem[]>([]);
  const { toast } = useToast();

  const handleAddToBill = (billItem: BillItem) => {
    setCurrentBill([...currentBill, billItem]);
    toast({
      title: "Success",
      description: "Item added to bill",
    });
  };

  const handleRemoveFromBill = (index: number) => {
    setCurrentBill(currentBill.filter((_, i) => i !== index));
    toast({
      title: "Success",
      description: "Item removed from bill",
    });
  };

  const calculateTotal = () => {
    return currentBill.reduce((total, item) => total + (item.quantity * item.sellingPrice), 0);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>
      
      <BillingForm onAddToBill={handleAddToBill} />
      
      <BillingTable 
        items={currentBill} 
        onRemoveItem={handleRemoveFromBill}
        total={calculateTotal()}
      />
    </div>
  );
};

export default Billing;