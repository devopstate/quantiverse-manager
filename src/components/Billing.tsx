import { useState, useEffect } from "react";
import { Product } from "@/types/inventory";
import { BillItem, BillingTransaction } from "@/types/billing";
import { BillingForm } from "./billing/BillingForm";
import { BillingTable } from "./billing/BillingTable";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Billing = () => {
  const [currentBill, setCurrentBill] = useState<BillItem[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load any saved current bill from localStorage
  useEffect(() => {
    const savedBill = localStorage.getItem('currentBill');
    if (savedBill) {
      setCurrentBill(JSON.parse(savedBill));
    }
  }, []);

  const handleAddToBill = (billItem: BillItem) => {
    const updatedBill = [...currentBill, billItem];
    setCurrentBill(updatedBill);
    localStorage.setItem('currentBill', JSON.stringify(updatedBill));
    toast({
      title: "Success",
      description: "Item added to bill",
    });
  };

  const handleRemoveFromBill = (index: number) => {
    const updatedBill = currentBill.filter((_, i) => i !== index);
    setCurrentBill(updatedBill);
    localStorage.setItem('currentBill', JSON.stringify(updatedBill));
    toast({
      title: "Success",
      description: "Item removed from bill",
    });
  };

  const calculateTotal = () => {
    return currentBill.reduce((total, item) => total + (item.quantity * item.sellingPrice), 0);
  };

  const updateInventory = () => {
    const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    
    currentBill.forEach(billItem => {
      const productIndex = products.findIndex(p => p.id === billItem.productId);
      if (productIndex !== -1) {
        products[productIndex].quantity -= billItem.quantity;
        products[productIndex].status = products[productIndex].quantity === 0 ? "Out-of-Stock" : "In-Stock";
      }
    });

    localStorage.setItem('products', JSON.stringify(products));
  };

  const handleCompleteBill = () => {
    if (currentBill.length === 0) {
      toast({
        title: "Error",
        description: "Cannot complete empty bill",
        variant: "destructive",
      });
      return;
    }

    const transaction: BillingTransaction = {
      id: Date.now().toString(),
      items: [...currentBill],
      total: calculateTotal(),
      date: new Date(),
      status: 'completed'
    };

    // Update inventory
    updateInventory();

    // Save transaction
    const existingTransactions = JSON.parse(localStorage.getItem('billingTransactions') || '[]');
    localStorage.setItem('billingTransactions', JSON.stringify([...existingTransactions, transaction]));

    // Clear current bill
    setCurrentBill([]);
    localStorage.removeItem('currentBill');
    
    toast({
      title: "Success",
      description: "Bill completed successfully",
    });
    navigate('/sales');
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

      <div className="mt-6">
        <Button 
          onClick={handleCompleteBill}
          disabled={currentBill.length === 0}
          className="w-full md:w-auto"
        >
          Complete Bill
        </Button>
      </div>
    </div>
  );
};

export default Billing;