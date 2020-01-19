const express = require("express");
const bcrypt= require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.post('/signup', (req,res,next)=>{
  bcrypt.hash(req.body.passwort, 10)
  .then(hash =>{
    const user = new User({
      email: req.body.email,
      passwort: hash
      // passwort: req.body.passwort so würden wir das Passwort ohne Verschlüsselung
      // übergeben und könnten es von jedem in der DB auslesen um dies zu
      // umgehen importieren wir bcrypt für die Verschlüsselung
      // so speichern wir den Hashwert und nicht das Passwort
    });
    user.save()
    .then(result => {
      res.status(201).json({
        message: 'User erstellt',
        result: result
      });
    })
    .catch( err => {
      res.status(500).json({
        error: err
      });
    })
  });
});


module.exports= router;
