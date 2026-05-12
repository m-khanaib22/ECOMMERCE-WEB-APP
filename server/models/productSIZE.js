const mongoose = require('mongoose');

const productSIZESchema = mongoose.Schema({
    productSIZE: {
        type: String,
        default: null
    }
})

productSIZESchema.virtual('id').get(function () {
    return this._id.toHexString();
});
productSIZESchema.set('toJSON', {
    virtuals: true,
});

exports.ProductSIZE = mongoose.model('ProductSIZE', productSIZESchema);
exports.productSIZESchema = productSIZESchema;  