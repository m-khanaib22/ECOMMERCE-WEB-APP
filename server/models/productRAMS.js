const mongoose = require('mongoose');

const productRAMSSchema = mongoose.Schema({
    productRAM: {
        type: String,
        default: null
    }
})

productRAMSSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
productRAMSSchema.set('toJSON', {
    virtuals: true,
});

exports.ProductRAMS = mongoose.model('ProductRAMS', productRAMSSchema);
exports.productRAMSSchema = productRAMSSchema;  