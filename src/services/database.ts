import Database from 'better-sqlite3';
import { Product } from '@/types/inventory';

const db = new Database('inventory.db');

// Initialize database with required tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    purchasePrice REAL NOT NULL,
    sellingPrice REAL NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

export const getAllProducts = (): Product[] => {
  const products = db.prepare('SELECT * FROM products').all();
  return products.map(product => ({
    ...product,
    createdAt: new Date(product.createdAt)
  }));
};

export const addProduct = (product: Omit<Product, 'id' | 'status' | 'createdAt'>): Product => {
  const status = product.quantity === 0 ? "Out-of-Stock" : "In-Stock";
  const createdAt = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO products (category, title, purchasePrice, sellingPrice, quantity, status, createdAt)
    VALUES (@category, @title, @purchasePrice, @sellingPrice, @quantity, @status, @createdAt)
  `);
  
  const info = stmt.run({
    ...product,
    status,
    createdAt
  });

  return {
    id: info.lastInsertRowid as number,
    ...product,
    status,
    createdAt: new Date(createdAt)
  };
};

export const updateProduct = (product: Product): Product => {
  const status = product.quantity === 0 ? "Out-of-Stock" : "In-Stock";
  
  const stmt = db.prepare(`
    UPDATE products 
    SET category = @category,
        title = @title,
        purchasePrice = @purchasePrice,
        sellingPrice = @sellingPrice,
        quantity = @quantity,
        status = @status
    WHERE id = @id
  `);
  
  stmt.run({
    ...product,
    status
  });

  return {
    ...product,
    status
  };
};