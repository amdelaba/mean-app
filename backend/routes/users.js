const express = require('express');
const router = express.Router();
const jwt =  require('jsonwebtoken');

// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

router.post("/signup", (req, res, next) => {

  bcrypt.hash(req.body.password, 10)
    .then( hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then( result => {
          res.status(201).json({
            message: 'Use Created',
            result: result
          });
        })
        .catch(error => {
          res.status(500).json({
            error: error
          });
        });
    });

});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then( user => {
    if (!user) {
      return res.status(401).json({
        message: 'Auth failed. User not found'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then( result => {
    if (!result) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    
    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id }, 
      'secret_this_should_be_longer',
      { expiresIn: "1h" }
    );
    
    res.status(200).json({
      token: token,
      expiresIn: 3600   // 3600sec = 1h
    });


  })
  .catch(err => {
    console.log(err);
    return res.status(401).json({
      message: 'Auth failed. Couldn not sign token'
    });
  });

});

module.exports = router;