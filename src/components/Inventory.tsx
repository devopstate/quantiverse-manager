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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const itemsPerPage = 5;

  // Load products from database on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      console.log("Attempting to fetch products...");
      setIsLoading(true);
      try {
        const dbProducts = await getAllProducts();
        console.log("Products fetched successfully:", dbProducts);
        setProducts(dbProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products from database",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (newProductData: Omit<Product, 'id' | 'status' | 'createdAt'>) => {
    console.log("Attempting to add product:", newProductData);
    try {
      const product = await addProduct(newProductData);
      console.log("Product added successfully:", product);
      setProducts(prev => [...prev, product]);
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      console.error("Error adding product:", error);
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

  const handleUpdateProduct = async (updatedProduct: Product) => {
    console.log("Attempting to update product:", updatedProduct);
    try {
      const product = await updateProduct(updatedProduct);
      console.log("Product updated successfully:", product);
      setProducts(prev => 
        prev.map(p => p.id === product.id ? product : p)
      );
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      console.error("Error updating product:", error);
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

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

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