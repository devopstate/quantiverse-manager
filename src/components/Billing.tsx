import { useState, useEffect } from "react";
import { Product } from "@/types/inventory";
import { BillItem, BillingTransaction } from "@/types/billing";
import { BillingForm } from "./billing/BillingForm";
import { BillingTable } from "./billing/BillingTable";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { getAllProducts, updateProduct } from "@/services/database";

const Billing = () => {
  const [currentBill, setCurrentBill] = useState<BillItem[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load any saved current bill from localStorage with null check
  useEffect(() => {
    const savedBill = localStorage.getItem('currentBill');
    if (savedBill) {
      try {
        const parsedBill = JSON.parse(savedBill);
        setCurrentBill(Array.isArray(parsedBill) ? parsedBill : []);
      } catch (error) {
        setCurrentBill([]);
      }
    }
  }, []);

  const handleAddToBill = (billItem: BillItem) => {
    if (!billItem) return;
    
    const updatedBill = [...(currentBill || []), billItem];
    setCurrentBill(updatedBill);
    localStorage.setItem('currentBill', JSON.stringify(updatedBill));
    toast({
      title: "Success",
      description: "Item added to bill",
    });
  };

  const handleRemoveFromBill = (index: number) => {
    if (index < 0 || !currentBill) return;
    
    const updatedBill = currentBill.filter((_, i) => i !== index);
    setCurrentBill(updatedBill);
    localStorage.setItem('currentBill', JSON.stringify(updatedBill));
    toast({
      title: "Success",
      description: "Item removed from bill",
    });
  };

  const calculateTotal = () => {
    if (!currentBill?.length) return 0;
    return currentBill.reduce((total, item) => 
      total + ((item?.quantity || 0) * (item?.sellingPrice || 0)), 0);
  };

  const updateInventory = async () => {
    try {
      const products = await getAllProducts();
      
      for (const billItem of currentBill || []) {
        if (!billItem) continue;
        
        const product = products.find(p => p.id === billItem.productId);
        if (!product) continue;

        const updatedProduct = {
          ...product,
          quantity: Math.max(0, (product.quantity || 0) - (billItem.quantity || 0)),
        };
        
        // Update product status based on new quantity
        updatedProduct.status = updatedProduct.quantity === 0 ? "Out-of-Stock" : "In-Stock";
        
        await updateProduct(updatedProduct);
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      throw new Error("Failed to update inventory");
    }
  };

  const handleCompleteBill = async () => {
    if (!currentBill?.length) {
      toast({
        title: "Error",
        description: "Cannot complete empty bill",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update inventory first
      await updateInventory();

      const transaction: BillingTransaction = {
        id: Date.now().toString(),
        items: [...currentBill],
        total: calculateTotal(),
        date: new Date(),
        status: 'completed'
      };

      // Save transaction
      const existingTransactions = JSON.parse(localStorage.getItem('billingTransactions') || '[]');
      localStorage.setItem('billingTransactions', 
        JSON.stringify([...(existingTransactions || []), transaction]));

      // Clear current bill
      setCurrentBill([]);
      localStorage.removeItem('currentBill');
      
      toast({
        title: "Success",
        description: "Bill completed successfully",
      });
      navigate('/sales');
    } catch (error) {
      console.error("Error completing bill:", error);
      toast({
        title: "Error",
        description: "Failed to complete bill. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>
      
      <BillingForm onAddToBill={handleAddToBill} />
      
      <BillingTable 
        items={currentBill || []}
        onRemoveItem={handleRemoveFromBill}
        total={calculateTotal()}
      />

      <div className="mt-6">
        <Button 
          onClick={handleCompleteBill}
          disabled={!currentBill?.length}
          className="w-full md:w-auto"
        >
          Complete Bill
        </Button>
      </div>
    </div>
  );
};

export default Billing;