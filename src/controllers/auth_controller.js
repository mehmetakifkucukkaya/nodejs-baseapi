const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const APIError = require('../utils/errors');

const login = async (req, res) => {
  console.log(req.body);
  return res.json(req.body);
};

const register = async (req, res) => {
  const { email } = req.body;

  const userCheck = await UserModel.findOne({ email: email });

  if (userCheck) {
    throw new APIError('Mail adresi kullanılmaktadır !', 401);
  }

  //* Şifre hashleme
  req.body.password = await bcrypt.hash(req.body.password, 10);

  console.log(req.body);
  console.log('Hashlenmiş şifre: ', req.body.password);

  try {
    const newUser = new UserModel(req.body);

    await newUser
      .save()
      .then((response) => {
        return res.status(201).json({
          success: true,
          data: response,
          message: 'Kullanıcı başarıyla oluşturuldu',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  login,
  register,
};
