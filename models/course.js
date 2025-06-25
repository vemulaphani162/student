// models/Course.js

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true
    },
    thumbnail: { // Path to the course thumbnail image (e.g., /images/thumb-1.png)
        type: String,
        default: ''
    },
    tutor: { // Reference to the User (teacher) who created the course
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    videos: [{ // Array of video details (can be expanded into a separate Video model if needed)
        title: String,
        url: String, // URL or path to the video file
        duration: String // e.g., "10:30"
    }],
    category: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically sets the creation timestamp
    }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
