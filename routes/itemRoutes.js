const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// 1. CREATE: Add new item (POST /api/items)
router.post('/', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 2. READ: Get all items (GET /api/items)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. READ: Get single item by ID (GET /api/items/:id)
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid Item ID' });
  }
});

// 4. UPDATE: Modify existing item (PUT /api/items/:id)
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 5. DELETE: Remove item (DELETE /api/items/:id)
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid Item ID' });
  }
});

module.exports = router;
