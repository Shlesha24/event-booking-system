import express from 'express';
// IMPORTANT: You must add .js to the end of the file path
import { registerUser, loginUser } from '../controllers/authcontroller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;