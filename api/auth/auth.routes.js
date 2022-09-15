const { createUser, checkEmailExistance, loginUser, getAllUsers, forget, checkValidToken, resetPassword, myCredentials, logout } = require('./auth.controller');
const { checkToken } = require('./token.validation');

const router = require('express').Router();

router.post('/register' , createUser);

router.get('/check-email-exist/:email', checkEmailExistance);

router.get('/users', checkToken, getAllUsers);

router.post('/login', loginUser);

router.post('/forget/:email', forget);

router.post('/reset-password/:token',resetPassword);

router.get('/check-token-valid/:token', checkValidToken);

router.get('/me', checkToken, myCredentials);

router.post('/logout', checkToken, logout);

module.exports = router;