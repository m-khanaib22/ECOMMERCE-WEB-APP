const { MyList } = require('../models/myList');
const express = require('express');
const router = express.Router();
const pLimit = require('p-limit');
const limit = pLimit(2);


// ================= GET ALL item =================
router.get('/', async (req, res) => {

    try {

        const myList = await MyList.find(req.query);

        if (!myList) {
            res.status(500).json({ success: false })
        }

        return res.status(200).json(myList);
    } catch (error) {
        res.status(500).json({ success: false })
    }
});

// // ================= ADD item =================
router.post('/add', async (req, res) => {


    const item = await MyList.find({ productId: req.body.productId, userId: req.body.userId });

    if (item.length === 0) {
        let list = new MyList({
            productTitle: req.body.productTitle,
            image: req.body.image,
            rating: req.body.rating,
            price: req.body.price,
            productId: req.body.productId,
            userId: req.body.userId
        });


        if (!list) {
            return res.status(500).json({
                success: false,
                message: "The cart item cannot be created"
            })
        }

        list = await list.save();
        res.status(201).json(list);
    } else {
        res.status(401).json({ status: false, msg: "product already added in My List" })
    }

});

// // ================= DELETE item =================
router.delete('/:id', async (req, res) => {
    try {
        const item = await MyList.findById(req.params.id);
        if (!item) {
            return res.status(404).json({
                message: 'The item given id not found!',
                success: false
            })
        }

        const deletedItem = await MyList.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({
                message: 'item not found!',
                success: false
            })
        }

        res.status(200).json({
            success: true,
            message: 'item deleted successfully!'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
});
// // ================= get  item =================
router.get('/:id', async (req, res) => {
    const item = await MyList.findById(req.params.id);

    if (!item) {
        res.status(500).json({ message: 'The item with the given id was not found' })
    }
    return res.status(200).send(item)
})


module.exports = router;
