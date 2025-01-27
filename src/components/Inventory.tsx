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
import { useToast } from "@/hooks/use-toast";
import { Plus, ArrowUpDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Product {
  id: number;
  category: string;
  title: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  status: string;
  createdAt: Date;
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting state
  const [sortField, setSortField] = useState<keyof Product>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

    const product: Product = {
      id: products.length + 1,
      category: newProduct.category,
      title: newProduct.title,
      purchasePrice: parseFloat(newProduct.purchasePrice),
      sellingPrice: parseFloat(newProduct.sellingPrice),
      quantity: parseInt(newProduct.quantity),
      status: parseInt(newProduct.quantity) > 0 ? "In-Stock" : "Out-of-Stock",
      createdAt: new Date(),
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

  const handleSort = (field: keyof Product) => {
    setSortDirection(current => current === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  // Sort and paginate products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    }
    return a[sortField] < b[sortField] ? 1 : -1;
  });

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      </div>

      <Button onClick={handleAddProduct} className="mb-6">
        <Plus className="mr-2 h-4 w-4" /> Add Product
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
              Category <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead onClick={() => handleSort("title")} className="cursor-pointer">
              Product Title <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead onClick={() => handleSort("purchasePrice")} className="cursor-pointer">
              Purchase Price (₹) <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead onClick={() => handleSort("sellingPrice")} className="cursor-pointer">
              Selling Price (₹) <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead onClick={() => handleSort("quantity")} className="cursor-pointer">
              Quantity <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
              Status <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
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

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Inventory;