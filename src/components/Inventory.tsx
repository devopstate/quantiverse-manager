import { useState } from "react";
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

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'status' | 'createdAt'>) => {
    const product: Product = {
      id: products.length + 1,
      ...newProductData,
      status: newProductData.quantity > 0 ? "In-Stock" : "Out-of-Stock",
      createdAt: new Date(),
    };

    setProducts([...products, product]);
  };

  const handleSort = (field: keyof Product) => {
    setSortDirection(current => current === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
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