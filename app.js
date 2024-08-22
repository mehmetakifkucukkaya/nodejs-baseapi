const express = require('express');
const app = express();
require('dotenv').config(); //* .env klasörüne erişebilmesi için gerekli
require('./src/db/db_connection');
const port = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.json({
    message: 'Ana Sayfaya Hoşgeldiniz',
  });
});

const router = require('./src/routers');

//* Middlweware
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});
