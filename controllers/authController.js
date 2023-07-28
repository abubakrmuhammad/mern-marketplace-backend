const router = require('express').Router();
const User = require('../models/userModel');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const {
  transporter,
  sendConfirmationEmail,
  sendPassResetEmail,
} = require('../services/mailer');

//register user
const registerUser = async (req, res) => {
  const { userName, email, password, userRole } = req.body;

  const uniqueToken = uuidv4();

  const newUser = new User({
    userName,
    email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET,
    ).toString(),
    verificationToken: uniqueToken,
  });

  try {
    const savedUser = await newUser.save();

    const accessToken = jwt.sign(
      {
        id: savedUser._id,
      },
      process.env.jwtSecret,
      { expiresIn: '3d' },
    );

    sendConfirmationEmail(userName, email, uniqueToken);
    const { password, ...others } = savedUser._doc;
    res.status(200).json({ ...others, accessToken });
    console.log(`Successfully registered user`);
  } catch (err) {
    res.status(500).json(err);
    console.log({ err });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json('Wrong credentials');
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET,
    );

    const passwordOriginal = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (passwordOriginal !== req.body.password) {
      return res.status(401).json('Wrong credentials');
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.jwtSecret,
      { expiresIn: '3d' },
    );

    const { password, ...others } = user._doc;
    console.log(`Successfully logged in`);
    res.status(200).json({ ...others, accessToken });
  } catch (err) {}
};

const verifyUser = (req, res, next) => {
  console.log('verifying');
  User.findOne({
    verificationToken: req.params.verificationToken,
  })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User Not found.' });
      }

      user.verified = true;
      user.save(err => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        } else {
          res
            .status(200)
            .json({ message: 'Successfully verified', success: true });
        }
      });
    })
    .catch(e => console.log('error', e));
};

const forgotPass = (req, res) => {
  const { email } = req.body;

  const uniqueToken = uuidv4();

  User.findOne({ email }).then(result => {
    if (!result) {
      return res
        .status(403)
        .json({ message: 'No user found w.r.t given email', success: false });
    } else {
      console.log(result);
      result.passwordToken = uniqueToken;
      result.save(err => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        } else {
          res
            .status(200)
            .json({ message: 'Successfully saved token', success: true });
        }
      });

      sendPassResetEmail(result.userName, email, uniqueToken);
    }
  });
};

const resetPass = (req, res) => {
  const { pass, passwordToken } = req.body;

  console.log('verifying token');
  User.findOne({
    passwordToken,
  })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: 'Token expired, resend password change request',
          success: false,
        });
      }

      user.password = CryptoJS.AES.encrypt(
        pass,
        process.env.PASS_SECRET,
      ).toString();
      user.passwordToken = null;
      user.save(err => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        } else {
          res
            .status(200)
            .json({ message: 'Successfully changed password', success: true });
        }
      });
    })
    .catch(e => console.log('error', e));
};

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  forgotPass,
  resetPass,
};
