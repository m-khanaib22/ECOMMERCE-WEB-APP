const { Orders } = require('../models/orders');
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get(`/`, async (req, res) => {
    try {
        let ordersList;
        if (req.query.limit && req.query.sort) {
            ordersList = await Orders.find().sort({ [req.query.sort]: -1 }).limit(parseInt(req.query.limit));
        } else {
            ordersList = await Orders.find(req.query);
        }

        if (!ordersList) {
            return res.status(500).json({ success: false })
        }
        res.status(200).send(ordersList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);

        if (!order) {
            res.status(500).json({ message: 'The order with the given ID was not found.' })
        }
        res.status(200).send(order);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects amount in cents
            currency: 'pkr', // You can change this to your preferred currency
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/create', async (req, res) => {
    let order = new Orders({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        pincode: req.body.pincode,
        amount: req.body.amount,
        paymentId: req.body.paymentId,
        email: req.body.email,
        userId: req.body.userId,
        products: req.body.products,
    });

    try {
        order = await order.save();

        if (!order) {
            return res.status(400).send('the order cannot be created!')
        }

        res.send(order);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }

});

router.delete('/:id', (req, res) => {
    Orders.findByIdAndDelete(req.params.id).then(order => {
        if (order) {
            return res.status(200).json({ success: true, message: 'the order is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "order not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
});

router.get(`/get/count`, async (req, res) => {
    const orderCount = await Orders.countDocuments()

    if (orderCount === undefined) {
        res.status(500).json({ success: false })
    }
    res.send({
        orderCount: orderCount
    });
});

router.put('/:id', async (req, res) => {
    try {
        const order = await Orders.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            { new: true }
        );

        if (!order) {
            return res.status(500).json({ message: 'the order cannot be updated!' })
        }

        res.send(order);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
