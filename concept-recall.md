# Project Concept Recall

## Create projects

### Backend (create & install)
```powershell
cd "c:\Users\Harshal PC\Desktop\Placement Project\E-commerce\backend"
npm init -y
npm i express mongoose dotenv
```

### Frontend (create & install)
```powershell
cd "c:\Users\Harshal PC\Desktop\Placement Project\E-commerce\frontend"
npm create vite@latest .
npm install
```

## Backend (run)
```powershell
cd "c:\Users\Harshal PC\Desktop\Placement Project\E-commerce\backend"
npm start
```

## Frontend (run)
```powershell
cd "c:\Users\Harshal PC\Desktop\Placement Project\E-commerce\frontend"
npm run dev
```

## Backend Files
```text
backend/
├─ .env
├─ index.js
├─ package.json
└─ src/
```

## DB

### `lib/db.js`
```js
const mongoose = require('mongoose');
const ENV = require('./env');

const connectDB = async () => {
  return mongoose.connect(ENV.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};

module.exports = connectDB;
```

### `index.js` (db note)
```text
index.js calls `connectDB()` (from `lib/db.js`) before starting the server.
```

## Env

### `.env`
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### `lib/env.js`
```js
require('dotenv').config();

const ENV = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};

module.exports = ENV;
```

Use this file in the backend by importing `ENV` wherever config values are needed.

## index.js
```js
const express = require('express');
const ENV = require('./lib/env');
const connectDB = require('./lib/db');

const app = express();

app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API');
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();

```

## Modules (CommonJS vs ESM)

- **When to use `module.exports` / `require` (CommonJS):** default for many Node projects; simple, widely supported. Keep using it if your `package.json` has no `type` field or uses `"type": "commonjs"`.
- **When to use `export default` / `import` (ESM):** use for modern codebases or when sharing code with frontend tooling that uses ES modules.
- **How to convert to ESM (simple):** add `"type": "module"` to `backend/package.json`, then replace `const x = require('x')` with `import x from 'x'` and `module.exports = value` with `export default value`. Alternatively, rename CommonJS files to `.cjs` and ESM files to `.mjs` to mix formats.
- **Tip:** In small projects, pick one module system and keep it consistent across `lib/` and `index.js` to avoid interop issues.

### User model (backend/src/model/user.model.js)
```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 100 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+@.+\..+/,
  },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ["customer", "admin", "editor"],
    default: "customer",
  },
  addresses: [
    {
    label: String,
    line1: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    isDefault: Boolean,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
```

### Product model (backend/src/model/product.model.js)
```js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, unique: true, sparse: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  featured: { type: Boolean, default: false },
  attributes: { type: Object, default: {} },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
```

- `slug` is used in URLs and should be auto-generated from the product name, but admin can override it if needed.
- `sku` is used for inventory and order tracking; it can be auto-generated or entered by the admin.
- `featured` is used to show priority products on the homepage or in special sections.
- `attributes` stores extra product details like color, size, material, brand, or any custom filter data.

### Category model (backend/src/model/category.model.js)
```js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  level: { type: Number, required: true, min: 1 },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
```

- Category is used to group products into main and sub categories.
- `level` is used to identify category depth. Example: `1` for main category, `2` for subcategory, `3` for sub-subcategory.
- `parentId` is used when a category has a parent category.
- Product pages and filters can use `level` and `parentId` together for easy category access and retrieval.

Example:
```js
{
  name: "Men",
  slug: "men",
  level: 1,
  parentId: null
}

{
  name: "Shirts",
  slug: "shirts",
  level: 2,
  parentId: "Men category id"
}
```
 
