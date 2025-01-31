import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { Product } from '../src/types/inventory';

const app = express();
const port = 3001;

// Initialize database
const db = new Database('inventory.db');

// Create products table if it doesn't exist
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

app.use(cors());
app.use(express.json());

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products.map(product => ({
      ...product,
      createdAt: new Date(product.createdAt)
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add new product
app.post('/api/products', (req, res) => {
  try {
    const product = req.body as Omit<Product, 'id' | 'status' | 'createdAt'>;
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

    res.json({
      id: Number(info.lastInsertRowid),
      ...product,
      status,
      createdAt: new Date(createdAt)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const product = req.body as Product;
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

    res.json({
      ...product,
      status
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});