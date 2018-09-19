const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }));


// Headers added to prevent CORS issues
app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*' );
    res.setHeader('Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-type, Accept');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS' );

    next();
});

app.post('/api/posts' , (req, res, next) => {
    // body property added by bodyParser middleware
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully'
    });
});

app.get('/api/posts' , (req, res, next) => {
    const posts = [
        {
            id: '12345',
            title: 'First server side post',
            content : 'First server side post content'
        },
        {
            id: '25795',
            title: 'Second server side post',
            content : 'Second server side post content'
        }
    ];

    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    });
});

module.exports = app;