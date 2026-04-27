const mongoose = require('mongoose');
require('dotenv').config(); //dotenv-moduuli tarvitaan jos aiotaan käyttää .env-filua

/*************************YHTEYS KANTAAN******************************/

// yhteydenotto Docker-kontissa sijaitsevaan kantaan, MONGODB_URL on .env-tiedostossa:
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error: ' + err);
  });

module.exports = mongoose; //viedään mongoose-olio muiden tiedostojen käyttöön
