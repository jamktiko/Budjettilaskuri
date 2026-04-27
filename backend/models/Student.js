//Student-dokumentin skeema
const mongoose = require('mongoose');
const GradeSchema = require('./Grade'); //Alidokumentin skeema

// Skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon
const StudentSchema = new mongoose.Schema({
  studentcode: {
    type: String,
    required: true,
    maxlength: 10,
    unique: true,
    match: /^[a-z]{1}[0-9]{4}$/,
  },
  name: { type: String, required: true, maxlength: 50 },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  studypoints: { type: Number, required: false, min: 0 },
  grades: { type: [GradeSchema], required: true }, //Alidokumentin tyyppinä on sen skeema
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan
// Model on luokka joka sisältää skeeman
const Student = mongoose.model('Student', StudentSchema);
// exportataan model
module.exports = Student;
