const express = require("express");
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");

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

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email }).then(user => {
    if (!user) {                                          // wenn kein User mit angegebener Email existiert
      return res.status(401).json({
        message: "Authentifizierung fehlgeschlagen!"      // wird folgende Nachricht ausgegeben
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.passwort, user.passwort);  //Funktion vergleicht die Passwörter ohne sie zu entschlüsseln
  })
  .then(result => {
    if (!result) {                                            // wenn Passwörter nich übereinstimmmen
      return res.status(401).json({
        message: "Authentifizierung fehlgeschlagen!"          // wird wieder folgende Nachricht ausgegeben
      });
    }
    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      'secret_webTechnologien_gruppeC',
      { expiresIn: "1h" });
    // secret_web... ist ein Passwort, welches zum Erstellen der Hashes verwendet wird
    // es wir nur am Server gespeichert und wird verwendet um die Hashes zu validieren
    // nach 1 stunde erfolgt automatisch ein Logout

    res.status(200).json({
      token: token,
      expiresIn: 3600    // 1 Stunde in Sekunden
    });
  })
  .catch(err => { 
    // für den Fall das andere Fehler auftauchen
    return res.status(401).json({
      message: "Authentifizierung fehlgeschlagen!"
    });
  });
});


module.exports= router;
