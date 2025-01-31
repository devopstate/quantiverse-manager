import { useState, useEffect } from "react";
import { Product } from "@/types/inventory";
import { ProductForm } from "./inventory/ProductForm";
import { ProductTable } from "./inventory/ProductTable";
import { TablePagination } from "./inventory/TablePagination";
import { getAllProducts, addProduct, updateProduct } from "@/services/database";
import { useToast } from "@/hooks/use-toast";

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Product>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();
  
  const itemsPerPage = 5;

  // Load products from database on component mount
  useEffect(() => {
    try {
      const dbProducts = getAllProducts();
      setProducts(dbProducts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products from database",
        variant: "destructive",
      });
    }
  }, []);

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'status' | 'createdAt'>) => {
    try {
      const product = addProduct(newProductData);
      setProducts(prev => [...prev, product]);
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to database",
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: keyof Product) => {
    setSortDirection(current => current === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    try {
      const product = updateProduct(updatedProduct);
      setProducts(prev => 
        prev.map(p => p.id === product.id ? product : p)
      );
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product in database",
        variant: "destructive",
      });
    }
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
      
      <ProductForm onAddProduct={handleAddProduct} />

      <ProductTable
        products={paginatedProducts}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
        onUpdateProduct={handleUpdateProduct}
      />

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Inventory;