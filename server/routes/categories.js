const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require("fs");
const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');

const limit = pLimit(2);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
})

const upload = multer({ storage: storage });

// ================= UPLOAD IMAGES ===================

router.post('/upload', upload.array('images'), async (req, res) => {
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    try {
        const uploadStatus = await Promise.all(files.map((file) => {
            return limit(async () => {
                const result = await cloudinary.uploader.upload(file.path);
                // Remove local file after upload
                fs.unlinkSync(file.path);
                return result.secure_url;
            });
        }));

        res.send(uploadStatus);
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).send("Error uploading to Cloudinary");
    }
});
// ================= GET ALL CATEGORIES =================
router.get('/', async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const totalPosts = await Category.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (totalPosts > 0 && page > totalPages) {
            return res.status(404).json({ message: "Data not found" })
        }

        const categoryList = await Category.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!categoryList) {
            res.status(500).json({ success: false })
        }

        return res.status(200).json({
            "categoryList": categoryList,
            "totalPages": totalPages,
            "page": page
        });
    } catch (error) {
        res.status(500).json({ success: false })
    }
});

// // ================= GET CATEGORY BY ID =================
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(500).json({ message: 'The category with the given ID was not found.' })
    }

    return res.status(200).send(category);
});

// // ================= CREATE CATEGORY =================
router.post('/create', async (req, res) => {


    let category = new Category({
        name: req.body.name,
        images: req.body.images,
        color: req.body.color
    });

    try {
        category = await category.save();

        if (!category) {
            return res.status(500).json({
                error: "Category could not be saved",
                success: false
            })
        }

        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        })
    }
});

// // ================= DELETE CATEGORY =================
router.delete('/delete-image', async (req, res) => {
    const img = req.query.img;
    if (!img) {
        return res.status(400).send({ msg: 'Image id is required' });
    }
    try {
        await cloudinary.uploader.destroy(img);
        res.status(200).send({ msg: 'Image deleted from Cloudinary' });
    } catch (err) {
        res.status(500).send({ msg: 'Error deleting image', error: err });
    }
});

// // ================= DELETE CATEGORY =================
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found!',
                success: false
            })
        }

        const images = category.images;

        if (images && images.length !== 0) {
            for (let image of images) {
                const publicId = image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
        }

        const deletedUser = await Category.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                message: 'Category could not be deleted!',
                success: false
            })
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully!'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
});

// // ================= UPDATE CATEGORY =================
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                images: req.body.images,
                color: req.body.color
            },
            { new: true }
        );

        if (!category) {
            return res.status(500).json({
                message: 'Category could not be updated!',
                success: false
            })
        }

        res.send(category);
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
});

module.exports = router;
