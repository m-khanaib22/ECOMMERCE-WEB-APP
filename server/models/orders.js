const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            productId: { type: String },
            productTitle: { type: String },
            quantity: { type: Number },
            price: { type: Number },
            image: { type: String },
            subTotal: { type: Number }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "pending",
        required: true
    }
});

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

exports.Orders = mongoose.model('Orders', orderSchema);
