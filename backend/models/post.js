const mongoose = require('mongoose');

// Schema is the blueprint
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});

// name of collection will be 'posts', autogenerated by mongodb
module.exports = mongoose.model('Post', postSchema); 