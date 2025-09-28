import mongoose from 'mongoose'

const otpSchema =  new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
        trim: true, // Remove whitespace
    },
    expiresAt: {
        type: Date,
        required: true,
        default: ()=>new Date(Date.now() + 5 * 60 * 1000) // 5 minutes instead of 1
    },

},{timestamps: true})

otpSchema.index({expiresAt: 1}, {expireAfterSeconds: 0})

const OTPModel = mongoose.models.OTP || mongoose.model('OTP', otpSchema, 'otps')

export default OTPModel