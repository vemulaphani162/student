// config/config.js

// This is your MongoDB connection URI.
// If you are running MongoDB locally, this is the standard URI.
const MONGODB_URI = 'mongodb://localhost:27017/educa_db';

// If you are using MongoDB Atlas (cloud database), you would replace the above line
// with your specific Atlas connection string, which typically looks like this:
// const MONGODB_URI = 'mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority';

module.exports = {
    MONGODB_URI
};
