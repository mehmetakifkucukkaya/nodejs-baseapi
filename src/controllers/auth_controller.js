const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const APIError = require('../utils/errors');
const Response = require('../utils/response');
const crypto = require('crypto');
const {
  createToken,
  createTempToken,
  decodeTempToken,
} = require('../middleware/auth');
const sendMail = require('../utils/send_mail');
const moment = require('moment');

const login = async (req, res) => {
  console.log('/login');
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

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const userInfo = await UserModel.findOne({ email }).select(
    'name lastName email'
  );

  if (!userInfo) {
    throw new APIError('Kullanıcı bulunamadı', 400);
  }

  const resetCode = crypto.randomBytes(3).toString('hex');

  await sendMail({
    from: 'mehmet.akif.20021@gmail.com',
    to: userInfo.email,
    subject: 'Şifre Sıfırlama',
    text: `Merhaba ${userInfo.name} ${userInfo.lastName}, şifrenizi sıfırlamak için aşağıdaki kodu kullanabilirsiniz: ${resetCode}`,
  });

  console.log('Reset Code: ', resetCode);

  await UserModel.updateOne(
    { email },
    {
      $set: {
        reset: {
          code: resetCode,
          expire: moment().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    }
  );

  return new Response(
    true,
    'Şifre sıfırlama kodu mail adresinize gönderildi'
  ).succes(res);
};

const resetCodeCheck = async (req, res) => {
  const { email, code } = req.body;

  const userInfo = await UserModel.findOne({ email }).select(
    '_id name lastName email reset'
  );

  if (!userInfo) return new APIError('Geçersiz Kod', 401);

  const dbTime = moment(userInfo.reset.expire);
  const nowTime = moment(new Date());
  const timeDiff = dbTime.diff(nowTime, 'minute'); //* Dakika cinsinden farkı alıyoruz

  console.log('timeDiff: ', timeDiff);
  console.log('UserInfo: ', userInfo);

  if (timeDiff <= 0 || userInfo.reset.code !== code) {
    console.error('Geçersiz Kod veya zaman aşımı:', {
      timeDiff,
      code,
      resetCode: userInfo.reset.code,
    });
    throw new APIError('Geçersiz Kod', 401);
  }

  //* geçici token oluşturuyoruz
  const tempToken = await createTempToken(userInfo._id, userInfo.email);

  return new Response(
    { tempToken },
    'Şifre Sıfırlama işlemini yapabilirsiniz'
  ).succes(res);
};

const resetPassword = async (req, res) => {
  const { password, tempToken } = req.body;

  const decodedToken = await decodeTempToken(tempToken);
  console.log('Decoded Token: ', decodedToken);

  const hashPassword = await bcrypt.hash(password, 10);

  await UserModel.findByIdAndUpdate(
    {
      _id: decodedToken._id,
    },
    {
      reset: {
        code: null,
        expire: null,
      },
      password: hashPassword,
    }
  );

  return new Response(decodedToken, 'Şifre başarıyla değiştirildi').succes(res);
};
module.exports = {
  login,
  register,
  me,
  forgetPassword,
  resetCodeCheck,
  resetPassword,
};
