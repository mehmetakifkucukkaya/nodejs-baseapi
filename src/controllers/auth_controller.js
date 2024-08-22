const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const APIError = require('../utils/errors');
const Response = require('../utils/response');

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

  const newUser = new UserModel(req.body);

  await newUser
    .save()
    .then((data) => {
      return new Response(data, 'Kullanıcı başarıyla oluşturuldu').created(res);
    })
    .catch((err) => {
      throw new APIError('Kullanıcı oluşturulurken bir hata oluştu !', 400);
    });
};

module.exports = {
  login,
  register,
};
