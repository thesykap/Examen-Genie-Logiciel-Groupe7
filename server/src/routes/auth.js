const express = require('express');
const router = express.Router();
const { login, getMe, changePassword, register } = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/change-password', auth, changePassword);
router.post('/register', register);

module.exports = router;