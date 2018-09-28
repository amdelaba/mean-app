const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const app = express();

mongoose
    .connect(
        "mongodb+srv://andres:" + 
        process.env.MONGO_ATLAS_PASSWORD + 
        "@cluster0-l1plq.mongodb.net/node-angular?retryWrites=true"
    )
    .then(() =>{
        console.log('Connected to Database!');
    })
    .catch(() => {
        console.log('Connection failed!!!!');
    });

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded( { extended: false }));

// Allows requests to access to /images and forwarded to /backend/images
app.use("/images", express.static(path.join(__dirname, "images")));

// Allow static access to angular folder
app.use("/", express.static(path.join(__dirname, "angular-dist")));


// Headers added to prevent CORS issues
app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*' );
    res.setHeader('Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS' );
    next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

// Non-api requests should be handled by Angular
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'angular-dist', 'index.html'));
});

module.exports = app;