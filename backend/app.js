const path = require('path');
const express= require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://anesa:WebtechDB@cluster0-sbblp.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(()=>{

    console.log('Verbunden mit der Datenbank');
  })
  .catch(()=>{
    console.log('Verbindung mit der Datenbank fehlgeschlagen');
  });


app.use(bodyParser.json());

// allen requests mit /images ist es erlaubt fortzusetzten und die Bilder von hier zu holen
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  // unabhängig von der Domain, auf der die App, die den Request sendet, ausgeführt wird, darf auf
  // unsere Ressourcen zugreifen

  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept");
  // beschränkt auf Domains die neben dem default Header bestimmte Gruppen von Headers senden

  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PUT, PATCH ,DELETE , OPTIONS");
  next();
});

app.use('/posts',postsRoutes);
app.use('/user',userRoutes);

module.exports = app;
