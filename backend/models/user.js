const mongoose = require('mongoose');
const uniqueValidator= require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  passwort: { type: String, required: true }
});

// wir verwenden ein Plugin um eine Fehlermeldung zu erhalten
// falls ein User mit einer bereits vorhandenen Email sich versucht erneut anzumelden
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
