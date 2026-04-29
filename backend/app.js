const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// Reittitiedostot
const indexRouter = require('./routes/index');
const transactionsRouter = require('./routes/transactions');
const usersRouter = require('./routes/users');

const app = express();

// 1. CORS-asetukset (CloudFrontia varten)
app.use(cors());

// 2. MongoDB-yhteys (Pidetään auki koko sovelluksen elinkaaren ajan)
// Käytetään MONGO_URI, jonka sanoit asettaneesi Beanstalkiin
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB Atlas yhteys päällä!'))
    .catch((err) => console.error('MongoDB yhteysvirhe:', err));
} else {
  console.warn('VAROITUS: MONGO_URI puuttuu ympäristömuuttujista.');
}

// Perusmiddlewaret
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 3. REITIT

// Health check (Beanstalkin kuormantasaajalle ja sinulle)
app.get('/', (req, res) => {
  res.status(200).send('Backend on pystyssä!');
});

// Testireitti tietokannalle (Nyt ilman connect/close säätöä)
app.get('/api/test-db', (req, res) => {
  const status = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (status === 1) {
    res.json({
      message: 'Yhteys MongoDB Atlakseen on kunnossa!',
      status: 'Connected',
    });
  } else {
    res.status(500).json({
      error: 'Tietokantayhteys ei ole aktiivinen.',
      code: status,
    });
  }
});

app.use('/', indexRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/users', usersRouter);

// 4. VIRHEIDEN KÄSITTELY
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

module.exports = app;
