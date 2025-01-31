import { Product } from '@/types/inventory';

const API_URL = 'http://localhost:3001/api';

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const products = await response.json();
  return products.map((product: any) => ({
    ...product,
    createdAt: new Date(product.createdAt)
  }));
};

export const addProduct = async (
  product: Omit<Product, 'id' | 'status' | 'createdAt'>
): Promise<Product> => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add product');
  }
  
  const newProduct = await response.json();
  return {
    ...newProduct,
    createdAt: new Date(newProduct.createdAt)
  };
};

export const updateProduct = async (product: Product): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${product.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  
  const updatedProduct = await response.json();
  return {
    ...updatedProduct,
    createdAt: new Date(updatedProduct.createdAt)
  };
};