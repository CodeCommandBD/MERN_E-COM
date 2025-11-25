import mongoose from 'mongoose'

const productSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    // brand: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Brand',
    //     required: true,
    // },
    mrp: {
        type: Number,
        required: true,
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
    },
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: true,
        }
    ],
    description: {
        type: String,
    },
    


    // stock: {
    //     type: Number,
    //     required: true,
    // },  
    deletedAt:{
        type: Date,
        default: null,
        index: true,
    }


},{timestamps: true})

productSchema.index({category: 1})

const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema, 'products')

export default ProductModel