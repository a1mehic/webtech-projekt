const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_webTechnologien_gruppeC");
    // benötigen hier unser secret-Passwort damit der token verifiziert werden kann
    
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    // hinzufügen neuer Daten die dann in unserer routes/posts verwendt werden können

    next();                 // wenn kein error geworfen wird, wird somit die Ausführung fortgesetzt
    } catch (error) {
        res.status(401).json({ message: "Authentifizierung fehlgeschlagen!"});
    }
};

// decodedToken ruft das Token für uns ab und dekodiert es, sodass wir tatsächlich ein Ergebnis erhalten
// das beudeutet wir können auf diese Daten zugreifen die sich im Token befinden