const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const itemRoutes = require('./routes/itemRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'RESTful API Service is live and running!',
    endpoints: {
      getAllItems: 'GET /api/items',
      getItemById: 'GET /api/items/:id',
      createItem: 'POST /api/items',
      updateItem: 'PUT /api/items/:id',
      deleteItem: 'DELETE /api/items/:id'
    }
  });
});

// Connect to MongoDB & Start Server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rest_api_db';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
