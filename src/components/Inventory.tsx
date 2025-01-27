import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

interface Product {
  id: number;
  category: string;
  title: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  status: string;
}

const Inventory = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    category: "",
    title: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
  });

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const product: Product = {
      id: products.length + 1,
      category: newProduct.category,
      title: newProduct.title,
      purchasePrice: parseFloat(newProduct.purchasePrice),
      sellingPrice: parseFloat(newProduct.sellingPrice),
      quantity: parseInt(newProduct.quantity),
      status: parseInt(newProduct.quantity) > 0 ? "In-Stock" : "Out-of-Stock",
    };

    setProducts([...products, product]);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      
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
            setNewProduct({ ...newProduct, title: e.target.value })
          }
        />
        
        <Input
          type="number"
          placeholder="Purchase Price (₹)"
          value={newProduct.purchasePrice}
          onChange={(e) =>
            setNewProduct({ ...newProduct, purchasePrice: e.target.value })
          }
        />
        
        <Input
          type="number"
          placeholder="Selling Price (₹)"
          value={newProduct.sellingPrice}
          onChange={(e) =>
            setNewProduct({ ...newProduct, sellingPrice: e.target.value })
          }
        />
        
        <Input
          type="number"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={(e) =>
            setNewProduct({ ...newProduct, quantity: e.target.value })
          }
        />
      </div>

      <Button onClick={handleAddProduct} className="mb-6">
        <Plus className="mr-2 h-4 w-4" /> Add Product
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Product Title</TableHead>
            <TableHead>Purchase Price (₹)</TableHead>
            <TableHead>Selling Price (₹)</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="capitalize">{product.category}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>₹{product.purchasePrice}</TableCell>
              <TableCell>₹{product.sellingPrice}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Inventory;