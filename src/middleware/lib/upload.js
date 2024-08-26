const multer = require('multer');
const path = require('path');
const fs = require('fs');

//* Dosya türünün doğru olup olmadığını kontrol eden methodumuz
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error('Dosya türü desteklenmiyor'), false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDir = path.dirname(require.main.filename); //* Projenin ana dizini

    fs.mkdirSync(path.join(rootDir, '/public/uploads'), { recursive: true }); //* uploads klasörünü oluşturuyoruz

    cb(null, path.join(rootDir, '/public/uploads')); //* Dosyanın yükleneceği klasör
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split('/')[1]; //* Dosya uzantısını alıyoruz (jpg , gif , jpeg, png ...)

    if (!req.savedImages) req.savedImages = []; //* Eğer req.savedImages yoksa boş bir array oluşturuyoruz

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    let fileName = `image_${uniqueSuffix}.${extension}`; //* Dosya adını oluşturuyoruz

    req.savedImages = [...req.savedImages, fileName]; //* Oluşturduğumuz dosya adını req.savedImages array'ine ekliyoruz

    cb(null, fileName);
  },
});

const upload = multer({ storage, fileFilter }).array('images');

module.exports = upload;
