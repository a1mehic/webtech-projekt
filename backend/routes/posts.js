// routes für das backend

const express = require("express");
const multer = require("multer");


const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_Type= {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// definieren wo multer die Bilder hinlegen soll die mit dem request kommen
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    const isValid = MIME_Type[file.mimetype];
    let error = new Error("Nicht erlaubter Mime-Type");
    if(isValid){
      error= null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file,cb) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext= MIME_Type[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

// multer-code, versucht ein singlefile vom einkommenden request zu extrahieren und versucht ein
// BildProperty im RequestBody zu finden
router.post(
  "", 
  checkAuth, 
  multer({storage: storage}).single("image"), 
  (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  // neues Objekt
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
    message: 'Nachricht wurde erfolgreich hinzugefügt',
    post: {
      // title: createdPost.title,
      // content: createdPost.content,
     // imagePath: createdPost.imagePath
     // um das zu vereinfachen kann ich folgenden code verwenden
     // dieser erstellt ein objekt mit all den Attributen und, die id gib ich
     //unterhalb an um sie zu überschreiben
     ...createdPost,
     postId: createdPost._id,
    }
    });
  });
  //console.log(post);
});

router.put(
  "/:id", 
  checkAuth, multer({storage: storage}).single("image"), 
  (req, res, next) => {
  let imagePath = req.body.imagePath;
 if(req.file){
  const url = req.protocol + '://' + req.get('host');
  imagePath= url +  "/images/" + req.file.filename;
 }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(post);
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if(result.nModified > 0){
    res.status(200).json({ message: "Update erfolgreich!" });
    }
    else{
      res.status(401).json({ message: "Sie haben die Berechtigung nicht dazu" });
    }
  });
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize; // + um es von einem String in ein numeric umzuwandeln
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Nachricht erfolgreich gefunden",
        posts: fetchedPosts,
        maxPosts: count // Der Wert der vohandenen eintäge in der DB
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then( post => {
    if(post){
      res.status(200).json(post);
    }else{
      res.status(404).json({message: 'Nachricht nicht gefunden'});
    }
  });

});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId}).then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({ message: "Nachricht erfolgreich gelöscht!" });
      }
      else{
        res.status(401).json({ message: "Sie haben die Berechtigung nicht dazu" });
      }
  });
});

module.exports = router;
