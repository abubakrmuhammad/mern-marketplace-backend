const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationToken: {
      type: String,
      unique: true,
    },
    passwordToken: {
      type: String,
      unique: true,
    },
    verified: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('user', userSchema);
