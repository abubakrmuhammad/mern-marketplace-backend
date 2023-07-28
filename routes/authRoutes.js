const router = require('express').Router();
const {
  registerUser,
  loginUser,
  verifyUser,
  forgotPass,
  resetPass,
} = require('../controllers/authController');

router.post('/register', registerUser); //Register
router.post('/login', loginUser); //Login

router.get('/confirm/:verificationToken', verifyUser); //Verify
router.post('/forgot-pass', forgotPass);
router.post('/reset-pass', resetPass); //
module.exports = router;
