const express = require('express');
const router = express.Router();
const { ProductRAMS } = require('../models/productRAMS');

// ================= GET ALL PRODUCT WEIGHTS =================
router.get('/', async (req, res) => {
    try {
        const productRAMSList = await ProductRAMS.find();
        if (!productRAMSList) {
            res.status(500).json({ success: false })
        }
        return res.status(200).json(productRAMSList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ================= GET PRODUCT RAMS BY ID =================
router.get('/:id', async (req, res) => {
    try {
        const productRAMS = await ProductRAMS.findById(req.params.id);
        if (!productRAMS) {
            return res.status(404).json({ message: 'Product RAM not found' });
        }
        res.status(200).json(productRAMS);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ================= CREATE PRODUCT RAMS =================
router.post('/create', async (req, res) => {
    const { productRAM } = req.body;
    if (!productRAM) {
        return res.status(400).json({ message: 'Product RAM is required' });
    }
    try {
        const productRAMS = new ProductRAMS({ productRAM });
        const savedProductRAMS = await productRAMS.save();
        res.status(201).json(savedProductRAMS);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ================= UPDATE PRODUCT RAMS =================
router.put('/:id', async (req, res) => {
    const { productRAM } = req.body;
    if (!productRAM) {
        return res.status(400).json({ message: 'Product RAM name is required' });
    }
    try {
        const productRAMS = await ProductRAMS.findByIdAndUpdate(req.params.id, { productRAM }, { new: true });
        if (!productRAMS) {
            return res.status(404).json({ message: 'Product RAM not found' });
        }
        res.status(200).json(productRAMS);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ================= DELETE PRODUCT RAMS =================
router.delete('/:id', async (req, res) => {
    try {
        const productRAMS = await ProductRAMS.findByIdAndDelete(req.params.id);
        if (!productRAMS) {
            return res.status(404).json({ message: 'Product RAM not found' });
        }
        res.status(200).json({ message: 'Product RAM deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
