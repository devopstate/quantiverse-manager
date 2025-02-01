import { Product } from '@/types/inventory';

const STORAGE_KEY = 'inventory_products';

// Helper function to get products from localStorage
const getStoredProducts = (): Product[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  return JSON.parse(storedData).map((product: any) => ({
    ...product,
    createdAt: new Date(product.createdAt)
  }));
};

// Helper function to save products to localStorage
const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const getAllProducts = async (): Promise<Product[]> => {
  console.log("Fetching products from localStorage");
  return getStoredProducts();
};

export const addProduct = async (
  product: Omit<Product, 'id' | 'status' | 'createdAt'>
): Promise<Product> => {
  const products = getStoredProducts();
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    ...product,
    status: product.quantity === 0 ? "Out-of-Stock" : "In-Stock",
    createdAt: new Date()
  };
  
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = async (product: Product): Promise<Product> => {
  const products = getStoredProducts();
  const updatedProduct = {
    ...product,
    status: product.quantity === 0 ? "Out-of-Stock" : "In-Stock"
  };
  
  const index = products.findIndex(p => p.id === product.id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  
  products[index] = updatedProduct;
  saveProducts(products);
  return updatedProduct;
};