import mongoose from 'mongoose'

const mediaSchema =  new mongoose.Schema({
    asset_id: {
        type: String,
        required: true,
        trim: true
    },
    public_id: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: false,
        trim: true
    },
    thumbnail_url: {
        type: String,
        required: false,
        trim: true
    },
    alt: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    },


},{timestamps: true})



const MediaModel = mongoose.models['MEDIA'] || mongoose.model('MEDIA', mediaSchema, 'medias')

export default MediaModel