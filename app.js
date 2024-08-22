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

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});
