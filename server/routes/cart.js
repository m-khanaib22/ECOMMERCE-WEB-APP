const { Cart } = require('../models/cart');
const express = require('express');
const router = express.Router();
const pLimit = require('p-limit');
const limit = pLimit(2);


// ================= GET ALL CATEGORIES =================
router.get('/', async (req, res) => {

    try {

        const cartList = await Cart.find(req.query);

        if (!cartList) {
            res.status(500).json({ success: false })
        }

        return res.status(200).json(cartList);
    } catch (error) {
        res.status(500).json({ success: false })
    }
});

// // ================= ADD CART =================
router.post('/add', async (req, res) => {


    const cartItem = await Cart.find({ productId: req.body.productId });

    if (cartItem.length === 0) {
        let cartList = new Cart({
            productTitle: req.body.productTitle,
            image: req.body.image,
            rating: req.body.rating,
            price: req.body.price,
            quantity: req.body.quantity,
            subTotal: req.body.subTotal,
            productId: req.body.productId,
            userId: req.body.userId
        });


        if (!cartList) {
            return res.status(500).json({
                success: false,
                message: "The cart item cannot be created"
            })
        }

        cartList = await cartList.save();
        res.status(201).json(cartList);
    } else {
        res.status(401).json({ status: false, msg: "product already added in cart" })
    }

});

// // ================= DELETE CART =================
router.delete('/:id', async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({
                message: 'cart item given id not found!',
                success: false
            })
        }

        const deletedItem = await Cart.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({
                message: 'Cart item not found!',
                success: false
            })
        }

        res.status(200).json({
            success: true,
            message: 'Cart item deleted successfully!'
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
        const cartList = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                productTitle: req.body.productTitle,
                image: req.body.image,
                rating: req.body.rating,
                price: req.body.price,
                quantity: req.body.quantity,
                subTotal: req.body.subTotal,
                productId: req.body.productId,
                userId: req.body.userId
            },
            { new: true }
        );

        if (!cartList) {
            return res.status(500).json({
                message: 'Cart item could not be updated!',
                success: false
            })
        }

        res.send(cartList);
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
});

module.exports = router;
