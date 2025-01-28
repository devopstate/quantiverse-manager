import { useState } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { ProductTableHeader } from "./table/TableHeader";
import { EditableCell } from "./table/EditableCell";
import { ActionButton } from "./table/ActionButton";

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
  onUpdateProduct,
}: ProductTableProps) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValues, setEditingValues] = useState<Partial<Product>>({});

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
    <Table>
      <ProductTableHeader onSort={onSort} />
      <TableBody>
        {products.map((product) => (
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
  );
};