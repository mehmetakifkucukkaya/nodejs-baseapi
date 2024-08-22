const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Veritabanına bağlanıldı');
  })
  .catch((err) => {
    console.log('Veritabanına bağlanırken bir sorun çıktı: ', err);
  });
