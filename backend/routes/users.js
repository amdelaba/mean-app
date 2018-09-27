const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users')

router.post("/signup", UsersController.createUser);

router.post("/login", UsersController.userLogin);

module.exports = router;