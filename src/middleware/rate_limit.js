const rateLimit = require('express-rate-limit');

const allowedList = ['::1'];

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika sınırlama getiriyor
  max: (req, res) => {
    console.log('api url : ', req.url);

    //* Eğer login ya da register url'si gelirse 5 istekten sonra engel koy
    if (req.url == '/login' || req.url == '/register') {
      return 5;
    } else return 100;
  },
  message: {
    succes: false,
    message: 'Çok fazla istekte bulunduzu !',
  },
  //   skip: (req, res) => allowedList.includes(req.ip), //* rate limite dahil olmayan ip'ler
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
