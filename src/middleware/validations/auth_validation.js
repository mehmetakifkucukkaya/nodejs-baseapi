const joi = require('joi');
const APIError = require('../../utils/errors');

class AuthValidation {
  constructor() {}

  //* Kayıt olma işlemi için validation işlemleri
  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          name: joi.string().trim().min(3).max(26).required().messages({
            'string.base': 'İsim alanı metin tipinde olmalıdır',
            'string.empty': 'İsim alanı boş bırakılamaz',
            'string.min': 'İsim alanı en az 3 karakter olmalıdır',
            'string.max': 'İsim alanı en fazla 26 karakter olmalıdır',
            'string.required': 'İsim alanı zorunludur',
          }),
          lastName: joi.string().trim().min(3).max(26).required().messages({
            'string.base': 'Soyisim alanı metin tipinde olmalıdır',
            'string.empty': 'Soyisim alanı boş bırakılamaz',
            'string.min': 'Soyisim alanı en az 3 karakter olmalıdır',
            'string.max': 'Soyisim alanı en fazla 26 karakter olmalıdır',
            'string.required': 'Soyisim alanı zorunludur',
          }),
          email: joi
            .string()
            .trim()
            .email()
            .min(3)
            .max(26)
            .required()
            .messages({
              'string.base': 'Email alanı metin tipinde olmalıdır',
              'string.empty': 'Email alanı boş bırakılamaz',
              'string.min': 'Email alanı en az 3 karakter olmalıdır',
              'string.max': 'Email alanı en fazla 26 karakter olmalıdır',
              'string.email': 'Geçerli bir email adresi giriniz',
              'string.required': 'Email alanı zorunludur',
            }),
          password: joi.string().trim().min(6).max(26).required().messages({
            'string.base': 'Şifre alanı metin tipinde olmalıdır',
            'string.empty': 'Şifre alanı boş bırakılamaz',
            'string.min': 'Şifre alanı en az 6 karakter olmalıdır',
            'string.max': 'Şifre alanı en fazla 20 karakter olmalıdır',
            'string.required': 'Şifre alanı zorunludur',
          }),
        })
        .validateAsync(req.body);
    } catch (error) {
      throw new APIError(error.details[0].message);
    }
    next(); //* ara katman olduğu için işlem bitince devam etmesini sağlar
  };
}

module.exports = AuthValidation;
