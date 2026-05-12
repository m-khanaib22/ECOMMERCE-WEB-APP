const express = require('express');
const router = express.Router();
const { ProductWEIGHT } = require('../models/productWEIGHT');

// ================= GET ALL PRODUCT WEIGHTS =================
router.get('/', async (req, res) => {
    try {
        const productWEIGHTList = await ProductWEIGHT.find();
        if (!productWEIGHTList) {
            res.status(500).json({ success: false })
        }
        return res.status(200).json(productWEIGHTList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ================= GET PRODUCT WEIGHT BY ID =================
router.get('/:id', async (req, res) => {
    try {
        const productWEIGHT = await ProductWEIGHT.findById(req.params.id);
        if (!productWEIGHT) {
            return res.status(404).json({ message: 'Product WEIGHT not found' });
        }
        res.status(200).json(productWEIGHT);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ================= CREATE PRODUCT WEIGHT =================
router.post('/create', async (req, res) => {
    const { productWEIGHT } = req.body;
    if (!productWEIGHT) {
        return res.status(400).json({ message: 'Product WEIGHT name is required' });
    }
    try {
        const newProductWEIGHT = new ProductWEIGHT({ productWEIGHT });
        const savedProductWEIGHT = await newProductWEIGHT.save();
        res.status(201).json(savedProductWEIGHT);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ================= UPDATE PRODUCT WEIGHT =================
router.put('/:id', async (req, res) => {
    const { productWEIGHT } = req.body;
    if (!productWEIGHT) {
        return res.status(400).json({ message: 'Product WEIGHT name is required' });
    }
    try {
        const updatedProductWEIGHT = await ProductWEIGHT.findByIdAndUpdate(req.params.id, { productWEIGHT }, { new: true });
        if (!updatedProductWEIGHT) {
            return res.status(404).json({ message: 'Product WEIGHT not found' });
        }
        res.status(200).json(updatedProductWEIGHT);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ================= DELETE PRODUCT WEIGHT =================
router.delete('/:id', async (req, res) => {
    try {
        const productWEIGHT = await ProductWEIGHT.findByIdAndDelete(req.params.id);
        if (!productWEIGHT) {
            return res.status(404).json({ message: 'Product WEIGHT not found' });
        }
        res.status(200).json({ message: 'Product WEIGHT deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
