import { useState } from "react";
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
import { Plus
import { Product } from "@/types/inventory";

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, 'id' | 'status' | 'createdAt'>) => void;
}

export const ProductForm = ({ onAddProduct }: ProductFormProps) => {
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState({
    category: "",
    title: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
  });

  const validateNumber = (value: string, fieldName: string): boolean => {
    const num = Number(value);
    if (isNaN(num)) {
      toast({
        title: "Invalid Input",
        description: `${fieldName} must be a valid number`,
        variant: "destructive",
      });
      return false;
    }
    if (num <= 0) {
      toast({
        title: "Invalid Input",
        description: `${fieldName} must be greater than 0`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    if ((field === 'purchasePrice' || field === 'sellingPrice') && value !== '') {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }
    if (field === 'quantity' && value !== '') {
      if (!/^\d*$/.test(value)) return;
    }
    setNewProduct({ ...newProduct, [field]: value });
  };

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateNumber(newProduct.purchasePrice, "Purchase Price")) return;
    if (!validateNumber(newProduct.sellingPrice, "Selling Price")) return;
    if (!validateNumber(newProduct.quantity, "Quantity")) return;

    onAddProduct({
      category: newProduct.category,
      title: newProduct.title,
      purchasePrice: parseFloat(newProduct.purchasePrice),
      sellingPrice: parseFloat(newProduct.sellingPrice),
      quantity: parseInt(newProduct.quantity),
    });

    setNewProduct({
      category: "",
      title: "",
      purchasePrice: "",
      sellingPrice: "",
      quantity: "",
    });

    toast({
      title: "Success",
      description: "Product added successfully",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Select
        value={newProduct.category}
        onValueChange={(value) =>
          setNewProduct({ ...newProduct, category: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="electronics">Electronics</SelectItem>
          <SelectItem value="clothing">Clothing</SelectItem>
          <SelectItem value="food">Food</SelectItem>
        </SelectContent>
      </Select>
      
      <Input
        placeholder="Product Title"
        value={newProduct.title}
        onChange={(e) =>
          handleInputChange("title", e.target.value)
        }
      />
      
      <Input
        type="text"
        placeholder="Purchase Price (₹)"
        value={newProduct.purchasePrice}
        onChange={(e) =>
          handleInputChange("purchasePrice", e.target.value)
        }
      />
      
      <Input
        type="text"
        placeholder="Selling Price (₹)"
        value={newProduct.sellingPrice}
        onChange={(e) =>
          handleInputChange("sellingPrice", e.target.value)
        }
      />
      
      <Input
        type="text"
        placeholder="Quantity"
        value={newProduct.quantity}
        onChange={(e) =>
          handleInputChange("quantity", e.target.value)
        }
      />

      <Button onClick={handleAddProduct} className="col-span-full lg:col-span-1">
        <Plus className="mr-2 h-4 w-4" /> Add Product
      </Button>
    </div>
  );
};