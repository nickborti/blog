const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        min: 3,
        max: 160,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    body: {
        type: {}, // any data can be added
        required: true,
        min: 200,
        max: 2000000, // 2mb
    },
    excerpt: { // first few words from blog
        type: String,
        max: 1000,
    },
    mtitle: { // meta title
        type: String,
    },
    mdesc: { // meta description
        type: {},
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    categories: 
    [
        { 
            type: ObjectId,  // array of objects
            ref:'Category', // reference the category model
            required: true
        }
    ],
    tags: [{ type: ObjectId, ref:'Tag', required: true}], 
    postedBy: {
        type: ObjectId,
        ref: 'User'
    }
}, {timestamps: true})


module.exports = mongoose.model('Blog', blogSchema)