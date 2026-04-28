// Grades-alidokumentin skeema
const mongoose = require('mongoose');

// Skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon
const GradeSchema = new mongoose.Schema({
  coursecode: { type: String, required: true, maxlength: 10 },
  grade: { type: Number, required: false, min: 0, max: 5 },
});

// Skeema exportataan sellaisenaan ja model luodaan Student.js-tiedostossa
module.exports = GradeSchema;
