const express = require('express');
const connectDB = require('./config/db'); // require the db file
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init MIddleware - should allow us to get data in request.body
app.use(express.json({ extended: false }));


// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Serve static assets in production
if(process.env.NODE_ENV === 'production') {
    // Set the static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// look for an env variable called PORT to use; locally will run on port 5000
const PORT = process.env.PORT || 5000;

// listen on a port; console log is in a callback --> happens after listening
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
