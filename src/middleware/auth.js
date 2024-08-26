const jwt = require('jsonwebtoken');
const APIError = require('../utils/errors');
const userModel = require('../models/user_model');

const createToken = async (user, res) => {
  const payload = {
    sub: user._id,
    name: user.name,
  };

  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    algorithm: 'HS512',
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return res.status(201).json({
    succres: true,
    token: token,
    message: 'Başarılı',
  });
};

const tokenCheck = async (req, res, next) => {
  try {
    // console.log('Token Check çalıştı');

    const headerToken =
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer');

    if (!headerToken) {
      throw new APIError(
        'Token bulunamadı - Geçersiz Oturum ! Lütfen oturum açın',
        401
      );
    }

    const token = req.headers.authorization.split(' ')[1]; //* Bearer tokenimiz   -> şeklinde gelen tokeni alıyoruz ve boşluktan itibaren iki parçaya bölüp 1. indexi alıyoruz.  0: Baerer 1: Token

    console.log(token);

    //* token çözümleme işlemi
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return next(new APIError('Token geçersiz ! Lütfen oturum açın', 401));
      }

      const userInfo = await userModel
        .findById(decoded.sub)
        .select('_id name lastName email'); //* sadece bu veriler gelecek

      console.log(userInfo);

      if (!userInfo) {
        return next(new APIError('Geçersiz token - Kullanıcı bulunamadı', 401));
      }

      req.user = userInfo; //* kullanıcı varsa req.user'a atıyoruz

      next();
    });
  } catch (err) {
    next(err); // Hataları yakala ve error handling middleware'ine ilet
  }
};

const createTempToken = async (userId, email) => {
  const payload = {
    sub: userId,
    email,
  };

  const token = await jwt.sign(payload, process.env.JWT_TEMP_KEY, {
    algorithm: 'HS512',
    expiresIn: process.env.JWT_TEMP_EXPIRES_IN,
  });

  return 'Bearer ' + token;
};

const decodeTempToken = async (tempToken) => {
  const token = tempToken.split(' ')[1];
  let userInfo;

  await jwt.verify(token, process.env.JWT_TEMP_KEY, async (err, decoded) => {
    if (err) {
      throw new APIError('Geçersiz Token', 401);
    }

    userInfo = await userModel
      .findById(decoded.sub)
      .select('_id name lastName email');

    if (!userInfo) {
      throw new APIError('Geçersiz Token', 401);
    }
  });

  return userInfo;
};

module.exports = {
  createToken,
  tokenCheck,
  createTempToken,
  decodeTempToken,
};
