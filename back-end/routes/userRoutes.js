const express = require('express');
const { body } = require('express-validator');
const userController = require('../controller/userController');
const multer = require('multer');
const authenticateUser = require('../middleware/auth'); // JWT authentication middleware

// Multer configuration for license uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Make sure the directory exists or provide an absolute path
        cb(null, './uploads/licenses/');
    },
    filename: function (req, file, cb) {
        // Ensure unique file names to avoid conflicts
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const router = express.Router();

// Route for user signup
router.post('/signup', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.signup);

// Route for user login
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.login);

// Route to add or update user details (protected route)
router.put('/user/details', authenticateUser, upload.single('license'), userController.addOrUpdateUserDetails);
router.post('/logout', authenticateUser,userController.logout);
module.exports = router;
