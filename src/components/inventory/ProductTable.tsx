import { useState } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { ProductTableHeader } from "./table/TableHeader";
import { EditableCell } from "./table/EditableCell";
import { ActionButton } from "./table/ActionButton";
import { Input } from "@/components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditingValues(product);
  };

  const validateEditingValues = () => {
    if (!editingValues.title?.trim()) {
      toast({
        title: "Invalid Input",
        description: "Product title cannot be empty",
        variant: "destructive",
      });
      return false;
    }

    if (!editingValues.category?.trim()) {
      toast({
        title: "Invalid Input",
        description: "Category must be selected",
        variant: "destructive",
      });
      return false;
    }

    if (editingValues.purchasePrice && editingValues.purchasePrice <= 0) {
      toast({
        title: "Invalid Input",
        description: "Purchase price must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    if (editingValues.sellingPrice && editingValues.sellingPrice <= 0) {
      toast({
        title: "Invalid Input",
        description: "Selling price must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    if (editingValues.quantity && editingValues.quantity < 0) {
      toast({
        title: "Invalid Input",
        description: "Quantity cannot be negative",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = (product: Product) => {
    if (!validateEditingValues()) return;

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
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="food">Food</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="In-Stock">In Stock</SelectItem>
            <SelectItem value="Out-of-Stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <ProductTableHeader onSort={onSort} />
        <TableBody>
          {filteredProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{format(product.createdAt, 'dd/MM/yyyy')}</TableCell>
            <TableCell>
              <EditableCell
                isEditing={editingId === product.id}
                type="category"
                value={editingValues.category || product.category}
                onChange={(value) => handleInputChange("category", value)}
              />
            </TableCell>
            <TableCell>
              <EditableCell
                isEditing={editingId === product.id}
                type="text"
                value={editingValues.title || product.title}
                onChange={(value) => handleInputChange("title", value)}
              />
            </TableCell>
            <TableCell>
              <EditableCell
                isEditing={editingId === product.id}
                type="number"
                value={editingValues.purchasePrice || product.purchasePrice}
                onChange={(value) => handleInputChange("purchasePrice", value)}
                className="w-24"
              />
            </TableCell>
            <TableCell>
              <EditableCell
                isEditing={editingId === product.id}
                type="number"
                value={editingValues.sellingPrice || product.sellingPrice}
                onChange={(value) => handleInputChange("sellingPrice", value)}
                className="w-24"
              />
            </TableCell>
            <TableCell>
              <EditableCell
                isEditing={editingId === product.id}
                type="number"
                value={editingValues.quantity || product.quantity}
                onChange={(value) => handleInputChange("quantity", value)}
                className="w-24"
              />
            </TableCell>
            <TableCell>{product.status}</TableCell>
            <TableCell>
              <ActionButton
                isEditing={editingId === product.id}
                onEdit={() => handleEdit(product)}
                onSave={() => handleSave(product)}
              />
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
