const express = require('express');
const router = express.Router();
const {signup,login,getUserById,topup, useDesign,getCurrentUser, changePassword, sendVerificationCode, resetPassword, getAllEmails, signup_mul, editCount,getUsersWithZeroCount } = require('../controllers/authController');
const authenticateToken = require('../middlewares/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/user/me', authenticateToken, getCurrentUser);
router.get('/user/:id', getUserById);
router.get('/emails', getAllEmails);
router.post('/user/topup', authenticateToken, topup);
router.post('/use-design', authenticateToken, useDesign);
router.post('/change-password', authenticateToken, changePassword);
router.post('/send-code', sendVerificationCode);
router.post('/reset-password', resetPassword);
//
router.post('/signup_mul', signup_mul);
router.post('/edit-count', editCount);
router.get('/users/zero-count', getUsersWithZeroCount);
module.exports = router;
