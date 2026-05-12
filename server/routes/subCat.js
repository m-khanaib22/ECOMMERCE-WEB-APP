const { SubCategory } = require('../models/subCat');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const totalPosts = await SubCategory.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (totalPages > 0 && page > totalPages) {
            return res.status(404).json({ message: "Data not found" })
        }

        let subCategoryList = [];
        if (req.query.page !== undefined){
            subCategoryList = await SubCategory.find().populate('category')
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();
        }else{
            subCategoryList = await SubCategory.find().populate("category");
        }

        
        if (!subCategoryList) {
            res.status(500).json({ success: false })
        }

        return res.status(200).json({
            "subCategoryList": subCategoryList,
            "totalPages": totalPages,
            "page": page
        });
    } catch (error) {
        res.status(500).json({ success: false })
    }
});


router.get('/:id', async (req, res) => {
    try {
        const subCat = await SubCategory.findById(req.params.id).populate('category');

        if (!subCat) {
            return res.status(500).json({ message: 'The subCategory with the given ID was not found.' })
        }

        return res.status(200).send(subCat);
    } catch (error) {
        return res.status(500).json({ success: false })
    }
});

router.post('/create', async (req, res) => {
    try {
        let subCat = new SubCategory({
            category: req.body.category,
            subCat: req.body.subCat,
        });

        subCat = await subCat.save();

        if (!subCat) {
            return res.status(500).json({
                message: 'Subcategory could not be created!',
                success: false
            })
        }

        res.status(201).json(subCat);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedSubCat = await SubCategory.findByIdAndDelete(req.params.id);

        if (!deletedSubCat) {
            return res.status(404).json({
                message: 'Sub Category not found!',
                success: false
            })
        }

        res.status(200).json({
            success: true,
            message: 'Sub Category deleted successfully!'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
});

router.put('/:id', async (req, res) => {
    try {
        const subCat = await SubCategory.findByIdAndUpdate(
            req.params.id,
            {
                category: req.body.category,
                subCat: req.body.subCat,
            },
            { new: true }
        );

        if (!subCat) {
            return res.status(500).json({
                message: 'Sub Category not be updated!',
                success: false
            })
        }

        res.send(subCat);
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
});

module.exports = router;