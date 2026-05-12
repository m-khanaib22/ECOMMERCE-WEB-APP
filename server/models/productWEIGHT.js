const mongoose = require('mongoose');

const productWEIGHTSchema = mongoose.Schema({
    productWEIGHT: {
        type: String,
        default: null
    }
})

productWEIGHTSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
productWEIGHTSchema.set('toJSON', {
    virtuals: true,
});

exports.ProductWEIGHT = mongoose.model('ProductWEIGHT', productWEIGHTSchema);
exports.productWEIGHTSchema = productWEIGHTSchema;  