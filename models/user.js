// models/User.js

const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email addresses are unique
        trim: true,
        lowercase: true, // Stores emails in lowercase for consistency
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Example: Minimum password length
    },
    profileImagePath: {
        type: String,
        default: '' // Store the path to the uploaded profile image
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'], // Example roles
        default: 'student'
    },
    enrolledCourses: [{ // Array of ObjectIds referencing Course model for enrollment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' // This tells Mongoose to link to the 'Course' model
    }],
    createdAt: {
        type: Date,
        default: Date.now // Automatically sets the creation timestamp
    }
});

// Create the User Model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
