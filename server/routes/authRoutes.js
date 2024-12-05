const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const { registerUser, loginUser, googleAuth } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);

module.exports = router;
