const router = require('express').Router();
const multer = require('multer');
const upload = require('../middleware/lib/upload');
const Response = require('../utils/response');
const auth = require('./auth_routers');
const APIError = require('../utils/errors');

router.use(auth);

router.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      throw new APIError('Resim dosyası yüklenirken bir hata oluştu: ', error);
    } else if (err) {
      throw new APIError('Resim dosyası yüklenirken bir hata oluştu: ', error);
    } else
      return new Response(req.savedImages, 'Resim başarıyla yüklendi').succes(
        res
      );
  });
});

module.exports = router;
