# RESTful CRUD API

A Node.js & Express RESTful API with MongoDB and Mongoose supporting full CRUD operations.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Endpoints

- `GET /` - API Status
- `GET /api/items` - Fetch all items
- `GET /api/items/:id` - Fetch item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item by ID
- `DELETE /api/items/:id` - Delete item by ID
