const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String, // storage path of image
    }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;