const mongoose = require('mongoose');

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { collection: 'users', timestamps: true }
);

//* user modeli oluşturuldu ve users collection'ı ile eşleştirildi
const user = mongoose.model('users', userScheme);

module.exports = user;
