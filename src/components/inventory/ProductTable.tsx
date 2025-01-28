import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Save } from "lucide-react";
import { Product } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductTableProps {
  products: Product[];
  onSort: (field: keyof Product) => void;
  sortField: keyof Product;
  sortDirection: "asc" | "desc";
  onUpdateProduct: (product: Product) => void;
}

export const ProductTable = ({
  products,
  onSort,
  sortField,
  sortDirection,
  onUpdateProduct,
}: ProductTableProps) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValues, setEditingValues] = useState<Partial<Product>>({});

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditingValues(product);
  };

  const handleSave = (product: Product) => {
    if (!editingValues.title?.trim()) {
      toast({
        title: "Invalid Input",
        description: "Product title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!editingValues.category?.trim()) {
      toast({
        title: "Invalid Input",
        description: "Category must be selected",
        variant: "destructive",
      });
      return;
    }

    if (editingValues.purchasePrice && editingValues.purchasePrice <= 0) {
      toast({
        title: "Invalid Input",
        description: "Purchase price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (editingValues.sellingPrice && editingValues.sellingPrice <= 0) {
      toast({
        title: "Invalid Input",
        description: "Selling price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (editingValues.quantity && editingValues.quantity < 0) {
      toast({
        title: "Invalid Input",
        description: "Quantity cannot be negative",
        variant: "destructive",
      });
      return;
    }

    const updatedProduct = {
      ...product,
      ...editingValues,
      status: editingValues.quantity === 0 ? "Out-of-Stock" : "In-Stock",
    };

    onUpdateProduct(updatedProduct);
    setEditingId(null);
    setEditingValues({});
    
    toast({
      title: "Success",
      description: "Product updated successfully",
    });
  };

  const handleInputChange = (field: keyof Product, value: string) => {
    if ((field === 'purchasePrice' || field === 'sellingPrice') && value !== '') {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }
    if (field === 'quantity' && value !== '') {
      if (!/^\d*$/.test(value)) return;
    }
    setEditingValues({ 
      ...editingValues, 
      [field]: field === 'quantity' ? parseInt(value) : 
               (field === 'purchasePrice' || field === 'sellingPrice') ? parseFloat(value) : 
               value 
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => onSort("createdAt")} className="cursor-pointer">
            Date <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => onSort("category")} className="cursor-pointer">
            Category <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => onSort("title")} className="cursor-pointer">
            Product Title <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => onSort("purchasePrice")} className="cursor-pointer">
            Purchase Price (₹) <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => onSort("sellingPrice")} className="cursor-pointer">
            Selling Price (₹) <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => onSort("quantity")} className="cursor-pointer">
            Quantity <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => onSort("status")} className="cursor-pointer">
            Status <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{format(product.createdAt, 'dd/MM/yyyy')}</TableCell>
            <TableCell>
              {editingId === product.id ? (
                <Select
                  value={editingValues.category || product.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="capitalize">{product.category}</span>
              )}
            </TableCell>
            <TableCell>
              {editingId === product.id ? (
                <Input
                  value={editingValues.title || product.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              ) : (
                product.title
              )}
            </TableCell>
            <TableCell>
              {editingId === product.id ? (
                <Input
                  type="text"
                  value={editingValues.purchasePrice || product.purchasePrice}
                  onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                  className="w-24"
                />
              ) : (
                `₹${product.purchasePrice}`
              )}
            </TableCell>
            <TableCell>
              {editingId === product.id ? (
                <Input
                  type="text"
                  value={editingValues.sellingPrice || product.sellingPrice}
                  onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
                  className="w-24"
                />
              ) : (
                `₹${product.sellingPrice}`
              )}
            </TableCell>
            <TableCell>
              {editingId === product.id ? (
                <Input
                  type="text"
                  value={editingValues.quantity || product.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  className="w-24"
                />
              ) : (
                product.quantity
              )}
            </TableCell>
            <TableCell>{product.status}</TableCell>
            <TableCell>
              {editingId === product.id ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave(product)}
                >
                  <Save className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};