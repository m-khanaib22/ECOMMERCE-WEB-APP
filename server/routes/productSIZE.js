const express = require('express');
const router = express.Router();
const { ProductSIZE } = require('../models/productSIZE');

// ================= GET ALL PRODUCT WEIGHTS =================
router.get('/', async (req, res) => {
    try {
        const productSIZEList = await ProductSIZE.find();
        if (!productSIZEList) {
            res.status(500).json({ success: false })
        }
        return res.status(200).json(productSIZEList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ================= GET PRODUCT RAMS BY ID =================
router.get('/:id', async (req, res) => {
    try {
        const productSIZE = await ProductSIZE.findById(req.params.id);
        if (!productSIZE) {
            return res.status(404).json({ message: 'Product SIZE not found' });
        }
        res.status(200).json(productSIZE);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ================= CREATE PRODUCT RAMS =================
router.post('/create', async (req, res) => {
    const { productSIZE } = req.body;
    if (!productSIZE) {
        return res.status(400).json({ message: 'Product SIZE is required' });
    }
    try {
        const newProductSIZE = new ProductSIZE({ productSIZE });
        const savedProductSIZE = await newProductSIZE.save();
        res.status(201).json(savedProductSIZE);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ================= UPDATE PRODUCT RAMS =================
router.put('/:id', async (req, res) => {
    const { productSIZE } = req.body;
    if (!productSIZE) {
        return res.status(400).json({ message: 'Product SIZE name is required' });
    }
    try {
        const updatedProductSIZE = await ProductSIZE.findByIdAndUpdate(req.params.id, { productSIZE }, { new: true });
        if (!updatedProductSIZE) {
            return res.status(404).json({ message: 'Product SIZE not found' });
        }
        res.status(200).json(updatedProductSIZE);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ================= DELETE PRODUCT RAMS =================
router.delete('/:id', async (req, res) => {
    try {
        const productSIZE = await ProductSIZE.findByIdAndDelete(req.params.id);
        if (!productSIZE) {
            return res.status(404).json({ message: 'Product SIZE not found' });
        }
        res.status(200).json({ message: 'Product SIZE deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
