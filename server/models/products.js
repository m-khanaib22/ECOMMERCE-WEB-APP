const { Category } = require('./category');
const mongoose = require('mongoose');



const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
        }
    ],
    brand: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        default: 0,
    },
    oldPrice: {
        type: Number,
        default: 0,
    },
    catName: {
        type: String,
        default: ""
    },
    subCatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    subCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    productRAMS: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductRAMS',
            default: null,
        }
    ],
    productSIZE: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductSIZE',
            default: null,
        }
    ],
    productWEIGHT: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductWEIGHT',
            default: null,
        }
    ],
    location: [
        {
            type: String,
            default: "All",
        }
    ],
    countInStock: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
productSchema.set('toJSON', {
    virtuals: true,
});


exports.Product = mongoose.model('Product', productSchema);
