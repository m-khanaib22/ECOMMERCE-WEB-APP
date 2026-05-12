const { HomeBanner } = require('../models/homeBanner');
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

// ================= GET ALL BANNERS =================
router.get('/', async (req, res) => {
    try {
        const bannerList = await HomeBanner.find();

        if (!bannerList) {
            return res.status(500).json({ success: false })
        }

        return res.status(200).json(bannerList);
    } catch (error) {
        res.status(500).json({ success: false })
    }
});

// ================= GET BANNER BY ID =================
router.get('/:id', async (req, res) => {
    try {
        const banner = await HomeBanner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({ message: 'The banner with the given ID was not found.' })
        }

        return res.status(200).send(banner);
    } catch (error) {
        res.status(500).json({ success: false })
    }
});

// ================= CREATE BANNER =================
router.post('/create', async (req, res) => {
    let newEntry = new HomeBanner({
        image: req.body.image,
    });

    try {
        newEntry = await newEntry.save();

        if (!newEntry) {
            return res.status(500).json({
                error: "newEntry could not be saved",
                success: false
            })
        }

        res.status(201).json(newEntry);
    } catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        })
    }
});

// ================= DELETE IMAGE FROM CLOUDINARY ===================
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

// ================= DELETE BANNER =================
router.delete('/:id', async (req, res) => {
    try {
        const banner = await HomeBanner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                message: 'Banner not found!',
                success: false
            })
        }

        const image = banner.image;

        if (image) {
            const publicId = image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        const deletedBanner = await HomeBanner.findByIdAndDelete(req.params.id);

        if (!deletedBanner) {
            return res.status(404).json({
                message: 'Banner could not be deleted!',
                success: false
            })
        }

        res.status(200).json({
            success: true,
            message: 'Banner deleted successfully!'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
});

// ================= UPDATE BANNER =================
router.put('/:id', async (req, res) => {
    try {
        const banner = await HomeBanner.findByIdAndUpdate(
            req.params.id,
            {
                image: req.body.image,
            },
            { new: true }
        );

        if (!banner) {
            return res.status(500).json({
                message: 'Banner could not be updated!',
                success: false
            })
        }

        res.send(banner);
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
});

module.exports = router;
