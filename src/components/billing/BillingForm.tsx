import { useState } from "react";
import { Product } from "@/types/inventory";
import { BillItem } from "@/types/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

interface BillingFormProps {
  onAddToBill: (item: BillItem) => void;
}

export const BillingForm = ({ onAddToBill }: BillingFormProps) => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  // Get products from localStorage with proper initialization and null check
  const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p?.id.toString() === productId);
    if (!product) return;
    
    setSelectedProduct(product);
    setSellingPrice(product.sellingPrice?.toString() || '');
    setQuantity("");
  };

  const validateInputs = () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return false;
    }

    const qtyNum = parseInt(quantity || '0');
    if (isNaN(qtyNum) || qtyNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return false;
    }

    if (qtyNum > (selectedProduct?.quantity || 0)) {
      toast({
        title: "Error",
        description: "Quantity exceeds available stock",
        variant: "destructive",
      });
      return false;
    }

    const priceNum = parseFloat(sellingPrice || '0');
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleAddToBill = () => {
    if (!validateInputs() || !selectedProduct) return;

    const qtyNum = parseInt(quantity || '0');
    const priceNum = parseFloat(sellingPrice || '0');

    onAddToBill({
      productId: selectedProduct.id,
      productTitle: selectedProduct.title,
      purchasePrice: selectedProduct.purchasePrice,
      sellingPrice: priceNum,
      quantity: qtyNum,
      total: qtyNum * priceNum,
    });

    // Reset form
    setSelectedProduct(null);
    setQuantity("");
    setSellingPrice("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="flex flex-col gap-2">
        <Select
          value={selectedProduct?.id?.toString()}
          onValueChange={handleProductSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select product..." />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem
                key={product?.id}
                value={product?.id?.toString()}
                disabled={product?.status === "Out-of-Stock"}
              >
                {product?.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedProduct && (
          <span className="text-sm text-muted-foreground">
            Available: {selectedProduct?.quantity || 0} units
          </span>
        )}
      </div>

      <Input
        type="text"
        placeholder="Selling Price (₹)"
        value={sellingPrice}
        onChange={(e) => {
          if (!/^\d*\.?\d*$/.test(e.target.value)) return;
          setSellingPrice(e.target.value);
        }}
      />

      <Input
        type="text"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => {
          if (!/^\d*$/.test(e.target.value)) return;
          setQuantity(e.target.value);
        }}
      />

      <Button onClick={handleAddToBill}>
        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Bill
      </Button>
    </div>
  );
};