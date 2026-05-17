const { Category } = require('../models/category.js');
const { Product } = require('../models/products.js');
const { RecentlyViewed } = require('../models/recentlyViewed.js');
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

// ================= GET ALL PRODUCTS =================
router.get('/', async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 8;

    const query = { ...req.query };

    // Remove pagination from query params
    delete query.page;
    delete query.perPage;

    // Remove empty string filter values to avoid CastError
    if (query.subCatId === "") delete query.subCatId;
    if (query.category === "") delete query.category;
    if (query.subCat === "") delete query.subCat;
    if (query.location === "All" || query.location === "" || query.location === "undefined") delete query.location;

    // Handle price filtering using MongoDB operators
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
        query.price = {};
        if (query.minPrice !== undefined && query.minPrice !== "") {
            query.price.$gte = parseInt(query.minPrice);
        }
        if (query.maxPrice !== undefined && query.maxPrice !== "") {
            query.price.$lte = parseInt(query.maxPrice);
        }

        // Remove raw query params
        delete query.minPrice;
        delete query.maxPrice;

        // If price object is empty, remove it
        if (Object.keys(query.price).length === 0) {
            delete query.price;
        }
    }

    try {
        const totalPosts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / perPage) || 1;

        if (totalPosts > 0 && page > totalPages) {
            return res.status(404).json({ message: "Page not found" })
        }

        const productList = await Product.find(query)
            .populate("category subCat")
            .skip((page - 1) * perPage)
            .limit(perPage);

        if (!productList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json({
            "products": productList,
            "totalPages": totalPages,
            "page": page
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }

});

//-----------------------------featured PRODUCTS-----------------
router.get('/featured', async (req, res) => {


    try {
        const products = await Product.find({ isFeatured: true });
        if (!products) {
            return res.status(404).json({ success: false, message: "No featured products found" });
        }
        return res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

//-----------------------------RELATED PRODUCTS-----------------
router.post(`/recentlyViewed`, async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage);
    const totalPosts = await Product.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    let productList = [];
    productList = await RecentlyViewed.find(req.query).populate("category subCat");

    if (!productList) {
        res.status(500).json({ success: false })
    }
    return res.status(200).json({
        "products": productList,
        "totalPages": totalPages,
        "page": page
    })
})
//-----------------------------RELATED PRODUCTS-----------------

router.post('/recentlyViewed', async (req, res) => {

    let findproduct = RecentlyViewed.find({ id: req.body.id })
    var product;

    if (!findproduct) {
        product = new RecentlyViewed({
            name: req.body.name,
            description: req.body.description,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            category: req.body.category,
            catName: req.body.catName,
            subCatId: req.body.subCatId,
            subCat: req.body.subCat,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            discount: req.body.discount,
            productRAMS: req.body.productRAMS,
            productSIZE: req.body.productSIZE,
            productWEIGHT: req.body.productWEIGHT,
            location: req.body.location,
        });

        product = await product.save();
        if (!product) {
            return res.status(500).json({
                error: "Product could not be saved",
                success: false
            })
        }

        res.status(201).json(product);
    }



})


//-----------------------------CREATE PRODUCTS-----------------

router.post('/create', async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(404).send("invalid Category!");
        }

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            category: req.body.category,
            catName: req.body.catName,
            subCatId: req.body.subCatId,
            subCat: req.body.subCat,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            discount: req.body.discount,
            productRAMS: req.body.productRAMS,
            productSIZE: req.body.productSIZE,
            productWEIGHT: req.body.productWEIGHT,
            location: req.body.location,

        });

        product = await product.save();
        if (!product) {
            return res.status(500).json({
                error: "Product could not be saved",
                success: false
            })
        }
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (id === "undefined") {
            return res.status(400).json({ message: "Invalid product ID: undefined" });
        }

        const product = await Product.findById(id).populate("category subCat productWEIGHT productRAMS productSIZE");

        if (!product) {
            return res.status(404).json({ message: 'the product with the given id was not found' })
        }
        return res.status(200).send(product);
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
})

router.post('/get-multiple', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid IDs provided" });
        }

        const products = await Product.find({ _id: { $in: ids } }).populate("category subCat");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

// // ================= DELETE PRODUCT =================
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

// // ================= DELETE PRODUCT =================
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: 'product not found!',
                status: false
            })
        }

        const images = product.images;

        if (images && images.length !== 0) {
            for (let image of images) {
                const publicId = image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
        }

        const deletProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletProduct) {
            return res.status(404).json({
                message: 'product could not be deleted!',
                status: false
            })
        }

        res.status(200).send({
            message: 'product deleted successfully!',
            status: true
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
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                catName: req.body.catName,
                subCatId: req.body.subCatId,
                category: req.body.category,
                subCat: req.body.subCat,
                brand: req.body.brand,
                price: req.body.price,
                oldPrice: req.body.oldPrice,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                isFeatured: req.body.isFeatured,
                images: req.body.images,
                discount: req.body.discount,
                productRAMS: req.body.productRAMS,
                productSIZE: req.body.productSIZE,
                productWEIGHT: req.body.productWEIGHT,
                location: req.body.location,
            },
            { new: true }
        );

        if (!product) {
            return res.status(500).json({
                message: 'Product could not be updated!',
                success: false
            })
        }

        res.send(product);
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
});


router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments()

    if (productCount === undefined) {
        res.status(500).json({ success: false })
    }
    res.send({
        productCount: productCount
    });
});

module.exports = router;
