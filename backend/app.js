const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const app = express();

// mongodb+srv://andres:<PASSWORD>@cluster0-l1plq.mongodb.net/<DB-NAME>?retryWrites=true
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

// DEVELOPMENT
app.use("/images", express.static(path.join("backend/images")));

// PRODUCTION
// app.use("/images", express.static(path.join(__dirname, "images")));


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



module.exports = app;