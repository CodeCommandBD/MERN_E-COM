import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URI;

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {
        conn : null,
        promise: null,
    }
}

export const connectDB = async () => {
    if (!MONGODB_URL) {
        const missingUriError = new Error('MONGODB_URI is not set in environment');
        missingUriError.status = 500;
        throw missingUriError;
    }

    if (cached.conn) return cached.conn
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URL,{
            dbName:'Next-E-Com',
            bufferCommands: false
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}