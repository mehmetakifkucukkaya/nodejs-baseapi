const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const APIError = require('../utils/errors');
const Response = require('../utils/response');
const { createToken } = require('../middleware/auth');

const login = async (req, res) => {
  const { email, password } = req.body;

  //* Db'de email ile eşleşen kullanıcı var mı kontrol ediyorz
  const user = await UserModel.findOne({ email });

  // console.log(user);

  if (!user) {
    throw new APIError('Email ya da şifre hatalı !', 401);
  }

  //* Hashlenmiş şifreyi çözümlüyoruz
  const comparePassword = await bcrypt.compare(password, user.password);
  console.log(comparePassword);

  if (!comparePassword) {
    throw new APIError('Email ya da şifre hatalı !', 401);
  }

  createToken(user, res);
};

//* Kayıt olma işlemi
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

const me = async (req, res) => {
  // console.log('me içerisindeyz');

  return new Response(req.user).succes(res);
};

module.exports = {
  login,
  register,
  me,
};
