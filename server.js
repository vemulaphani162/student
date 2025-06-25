const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Import database configuration and models
const { MONGODB_URI } = require('./config/config'); // Path to your config/config.js
const User = require('./models/User');             // Path to your models/User.js
const Course = require('./models/Course');         // Path to your models/Course.js

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database Connection ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Session Middleware ---
app.use(session({
    secret: 'your_secret_key_here', // IMPORTANT: CHANGE THIS IN PRODUCTION!
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if your site is served over HTTPS
        maxAge: 1000 * 60 * 60 * 24 // Session will last for 24 hours
    }
}));

// --- Body Parsing Middleware ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// --- Static Files Middleware ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Multer Configuration for File Uploads ---
const uploadDir = path.join(__dirname, 'public', 'images', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created uploads directory at: ${uploadDir}`);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- Custom Authentication Middleware ---
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: 'User not authenticated. Please log in.' });
    }
}

// --- Data Seeding (for initial courses and a dummy teacher) ---
async function seedData() {
    try {
        let teacher = await User.findOne({ email: 'teacher@example.com', role: 'teacher' });
        if (!teacher) {
            console.log('Seeding a dummy teacher...');
            const hashedPassword = await bcrypt.hash('password123', await bcrypt.genSalt(10));
            teacher = new User({
                name: 'John Deo',
                email: 'teacher@example.com',
                password: hashedPassword,
                role: 'teacher',
                profileImagePath: 'images/pic-2.jpg'
            });
            await teacher.save();
            console.log('Dummy teacher seeded.');
        } else {
            console.log('Teacher already exists, skipping teacher seeding.');
        }

        const courseCount = await Course.countDocuments();
        if (courseCount === 0) {
            console.log('Seeding initial courses...');
            await Course.insertMany([
                {
                    title: 'complete HTML tutorial',
                    description: 'Master the fundamentals of HTML for web development, creating structured and semantic web pages.',
                    thumbnail: '/images/thumb-1.png',
                    tutor: teacher._id,
                    videos: [
                        { title: 'HTML Part 01 - Basics', url: 'html_video1.mp4', duration: '10:00' },
                        { title: 'HTML Part 02 - Forms & Tables', url: 'html_video2.mp4', duration: '12:30' }
                    ],
                    category: 'Development'
                },
                {
                    title: 'complete CSS tutorial',
                    description: 'Learn CSS to style your web pages beautifully, making them responsive and visually appealing.',
                    thumbnail: '/images/thumb-2.png',
                    tutor: teacher._id,
                    videos: [
                        { title: 'CSS Part 01 - Selectors & Properties', url: 'css_video1.mp4', duration: '15:00' },
                        { title: 'CSS Part 02 - Flexbox & Grid', url: 'css_video2.mp4', duration: '18:00' }
                    ],
                    category: 'Design'
                },
                {
                    title: 'complete JS tutorial',
                    description: 'Dive into JavaScript for interactive web experiences, DOM manipulation, and asynchronous programming.',
                    thumbnail: '/images/thumb-3.png',
                    tutor: teacher._id,
                    videos: [
                        { title: 'JS Part 01 - Fundamentals', url: 'js_video1.mp4', duration: '20:00' },
                        { title: 'JS Part 02 - Async JS', url: 'js_video2.mp4', duration: '22:00' }
                    ],
                    category: 'Development'
                },
                {
                    title: 'complete Boostrap tutorial',
                    description: 'Build responsive websites quickly with Bootstrap, a popular CSS framework.',
                    thumbnail: '/images/thumb-4.png',
                    tutor: teacher._id,
                    videos: [
                        { title: 'Bootstrap Part 01 - Grid System', url: 'bs_video1.mp4', duration: '14:00' },
                        { title: 'Bootstrap Part 02 - Components', url: 'bs_video2.mp4', duration: '16:00' }
                    ],
                    category: 'Frameworks'
                },
                {
                    title: 'complete JQuery tutorial',
                    description: 'Simplify client-side scripting with JQuery, making JavaScript easier to use.',
                    thumbnail: '/images/thumb-5.png',
                    tutor: teacher._id,
                    videos: [
                        { title: 'JQuery Part 01 - Selectors', url: 'jq_video1.mp4', duration: '10:00' },
                        { title: 'JQuery Part 02 - Events & Effects', url: 'jq_video2.mp4', duration: '12:00' }
                    ],
                    category: 'Development'
                },
                {
                    title: 'complete SASS tutorial',
                    description: 'Enhance your CSS workflow with SASS, a powerful CSS preprocessor.',
                    thumbnail: '/images/thumb-6.png',
                    tutor: teacher._id,
                    videos: [
                        { title: 'SASS Part 01 - Variables & Nesting', url: 'sass_video1.mp4', duration: '11:00' },
                        { title: 'SASS Part 02 - Mixins & Functions', url: 'sass_video2.mp4', duration: '13:00' }
                    ],
                    category: 'Design'
                },
                {
                    title: 'complete PHP tutorial',
                    description: 'Learn server-side programming with PHP for dynamic web applications.',
                    thumbnail: '/images/thumb-7.png',
                    tutor: teacher._id,
                    videos: [
                        { title: 'PHP Part 01 - Basics', url: 'php_video1.mp4', duration: '18:00' },
                        { title: 'PHP Part 02 - Forms & Databases', url: 'php_video2.mp4', duration: '20:00' }
                    ],
                    category: 'Backend'
                },
                {
                    title: 'complete MySQL tutorial',
                    description: 'Master database management with MySQL, the popular open-source relational database.',
                    thumbnail: '/images/thumb-8.png',
                    tutor: teacher._id,
                    videos: [
                        { title: 'MySQL Part 01 - Queries', url: 'mysql_video1.mp4', duration: '16:00' },
                        { title: 'MySQL Part 02 - Joins & Indexes', url: 'mysql_video2.mp4', duration: '18:00' }
                    ],
                    category: 'Database'
                },
                {
                    title: 'complete React tutorial',
                    description: 'Build modern user interfaces with React, a JavaScript library for building web applications.',
                    thumbnail: '/images/thumb-9.png',
                    tutor: teacher._id,
                    videos: [
                        { title: 'React Part 01 - Components', url: 'react_video1.mp4', duration: '25:00' },
                        { title: 'React Part 02 - State & Props', url: 'react_video2.mp4', duration: '28:00' }
                    ],
                    category: 'Frameworks'
                }
            ]);
            console.log('Courses seeded.');
        } else {
            console.log('Courses already exist, skipping course seeding.');
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

mongoose.connection.on('connected', seedData);


// --- Routes ---

app.post('/contact', (req, res) => {
    const { name, email, number, msg } = req.body;
    console.log('Contact Form Submission Received:');
    console.log(`  Name: ${name}\n  Email: ${email}\n  Number: ${number}\n  Message: ${msg}`);
    res.redirect('/contact.html?message=sent');
});

app.post('/login', async (req, res) => {
    const { email, pass } = req.body;
    console.log('Login Attempt for Email:', email);

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('Login Failed: User not found for email:', email);
            return res.redirect('/login.html?error=invalid_credentials');
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            console.log('Login Failed: Incorrect password for email:', email);
            return res.redirect('/login.html?error=invalid_credentials');
        }
        req.session.userId = user._id;
        console.log(`Login Successful for user: ${user.email}. Session ID: ${req.session.userId}`);
        res.redirect('/home.html?login=success');
    } catch (error) {
        console.error('Server error during login:', error);
        res.redirect('/login.html?error=server_error');
    }
});

app.post('/register', upload.single('file'), async (req, res) => {
    const { name, email, pass, c_pass } = req.body;
    const profileImage = req.file;

    console.log('Registration Attempt for Email:', email);

    if (pass !== c_pass) {
        console.log('Registration Failed: Passwords do not match.');
        if (profileImage) {
            fs.unlink(profileImage.path, (err) => {
                if (err) console.error('Error deleting uploaded file after password mismatch:', err);
            });
        }
        return res.redirect('/register.html?error=passwords_mismatch');
    }

    try {
        let user = await User.findOne({ email: email });
        if (user) {
            console.log('Registration Failed: Email already registered:', email);
            if (profileImage) {
                fs.unlink(profileImage.path, (err) => {
                    if (err) console.error('Error deleting uploaded file after existing email:', err);
                });
            }
            return res.redirect('/register.html?error=email_exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            profileImagePath: profileImage ? `/images/uploads/${profileImage.filename}` : ''
        });
        await user.save();

        console.log('Registration successful! User saved to DB.');
        res.redirect('/login.html?registered=true');

    } catch (error) {
        console.error('Server error during registration:', error);
        if (profileImage) {
            fs.unlink(profileImage.path, (err) => {
                if (err) console.error('Error deleting uploaded file after server error:', err);
            });
        }
        res.redirect('/register.html?error=server_error');
    }
});

app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find({}).populate('tutor', 'name profileImagePath');
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses' });
    }
});

app.get('/api/current-user-enrollments', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('enrolledCourses');
        if (!user) {
            req.session.destroy();
            return res.status(404).json({ message: 'User not found or session stale.' });
        }
        res.json({
            _id: user._id,
            enrolledCourses: user.enrolledCourses.map(id => ({ _id: id.toString() }))
        });
    } catch (error) {
        console.error('Error fetching current user enrollments:', error);
        res.status(500).json({ message: 'Server error fetching enrollments.' });
    }
});

app.post('/enroll-course', isAuthenticated, async (req, res) => {
    const { courseId } = req.body;
    const userId = req.session.userId;

    if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required.' });
    }

    try {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: 'You are already enrolled in this course.' });
        }

        user.enrolledCourses.push(courseId);
        await user.save();

        console.log(`User ${user.email} successfully enrolled in course: ${course.title}`);
        res.status(200).json({ message: 'Enrolled successfully!', courseId: courseId });

    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ message: 'Server error during enrollment.' });
    }
});

app.get('/api/playlist/:courseId', isAuthenticated, async (req, res) => {
    const { courseId } = req.params;
    const userId = req.session.userId;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Playlist/Course not found.' });
        }

        const user = await User.findById(userId);
        const isEnrolled = user && user.enrolledCourses.includes(courseId);

        if (isEnrolled) {
            res.json({
                course: course,
                isEnrolled: true,
                videos: course.videos
            });
        } else {
            res.status(403).json({
                message: 'You are not enrolled in this course. Please enroll to view content.',
                course: {
                    _id: course._id,
                    title: course.title,
                    description: course.description,
                    thumbnail: course.thumbnail,
                    tutor: course.tutor,
                    category: course.category
                },
                isEnrolled: false
            });
        }
    } catch (error) {
        console.error('Error fetching playlist data:', error);
        res.status(500).json({ message: 'Server error fetching playlist.' });
    }
});

// New API Route: Get User Profile Details
app.get('/api/user-profile', isAuthenticated, async (req, res) => {
    try {
        // Fetch user data, but exclude the password for security
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            // This might happen if session is valid but user deleted from DB
            req.session.destroy(); // Clear potentially stale session
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user); // Send user object (excluding password)
    } catch (error) {
        console.error('Error fetching user profile details:', error);
        res.status(500).json({ message: 'Server error fetching profile details.' });
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/home.html?logout=error');
        }
        res.redirect('/login.html?logout=success');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'public', `${page}.html`), (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
