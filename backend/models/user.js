const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schema is the blueprint
const userSchema = mongoose.Schema({
    // unique is not a validator (unlike required)
    // does not throw an error if same email insrted twice
    // it just allows mongoDb to do internal optimizations
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// This does validate an throw error if uniqueness is violated
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema); 