import express from 'express';
import Auth from '../controllers/authController.js';

const router = express.Router();

router
    .post('/signup', Auth.signup)
    .post('/login', Auth.login)
    .post('/logout', Auth.logout)
    .post('/isauthenticated', Auth.isAuthenticated);

export default router;
