const { Product } = require("../models/products.js");
const { SubCategory } = require("../models/subCat.js");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get('/', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ msg: 'Query is required' });
        }

        const subCats = await SubCategory.find({
            subCat: { $regex: query, $options: 'i' }
        });
        const subCatIds = subCats.map(sc => sc._id);

        const filterQuery = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { catName: { $regex: query, $options: 'i' } },
                { subCatId: { $in: subCatIds } },
            ]
        };

        if (req.query.rating) {
            filterQuery.rating = parseInt(req.query.rating);
        }

        if (req.query.subCatId && req.query.subCatId !== "" && req.query.subCatId !== "undefined") {
            filterQuery.subCatId = req.query.subCatId;
        }

        if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
            filterQuery.price = {};
            if (req.query.minPrice !== undefined && req.query.minPrice !== "") {
                filterQuery.price.$gte = parseInt(req.query.minPrice);
            }
            if (req.query.maxPrice !== undefined && req.query.maxPrice !== "") {
                filterQuery.price.$lte = parseInt(req.query.maxPrice);
            }
        }

        const items = await Product.find(filterQuery).populate("category").populate("subCat");
        res.json(items);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
})

module.exports = router;