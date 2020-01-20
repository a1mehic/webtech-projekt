const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_webTechnologien_gruppeC");
    // benötigen hier unser secret-Passwort damit der token verifiziert werden kann
    next();                 // wenn kein error geworfen wird, wird somit die Ausführung fortgesetzt
    } catch (error) {
        res.status(401).json({ message: "Authentifizierung fehlgeschlagen!"});
    }
};
