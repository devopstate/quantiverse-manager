import { useState, useEffect } from "react";
import { Product } from "@/types/inventory";
import { ProductForm } from "./inventory/ProductForm";
import { ProductTable } from "./inventory/ProductTable";
import { TablePagination } from "./inventory/TablePagination";

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Product>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const itemsPerPage = 5;

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts).map((product: any) => ({
        ...product,
        createdAt: new Date(product.createdAt)
      }));
      setProducts(parsedProducts);
    }
  }, []);

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'status' | 'createdAt'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const product: Product = {
      id: newId,
      ...newProductData,
      status: newProductData.quantity === 0 ? "Out-of-Stock" : "In-Stock",
      createdAt: new Date(),
    };

    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleSort = (field: keyof Product) => {
    setSortDirection(current => current === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const productWithStatus = {
      ...updatedProduct,
      status: updatedProduct.quantity === 0 ? "Out-of-Stock" : "In-Stock"
    };
    const updatedProducts = products.map(p => 
      p.id === productWithStatus.id ? productWithStatus : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
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