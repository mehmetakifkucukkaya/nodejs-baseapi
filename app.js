require('express-async-errors');
require('dotenv').config(); //* .env klasörüne erişebilmesi için gerekli
require('./src/db/db_connection');
const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const errorHandlerMiddleware = require('./src/middleware/error_handler');
const cors = require('cors');
const corsOptions = require('./src/helpers/cors_options');
const router = require('./src/routers');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

app.get('/', (req, res) => {
  res.json({
    message: 'Ana Sayfaya Hoşgeldiniz',
  });
});

//* Middlweware
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(__dirname));

//* Cors
app.use(cors(corsOptions));

//* MongoDb Injection
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);

app.use('/api', router);

//* Hata Yakalama
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});
