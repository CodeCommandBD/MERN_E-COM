import mongoose from 'mongoose'

const couponSchema =  new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        trim: true
    },
    miniShoppingAmount: {
        type: Number,
        required: false,
        trim: true
    },
    validity: {
        type: Date,
        required: true,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    },


},{timestamps: true})



const couponModel = mongoose.models['COUPON'] || mongoose.model('COUPON', couponSchema, 'coupons')

export default couponModel