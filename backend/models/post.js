const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: {type: String, required: true},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});
// beim Creator sagen wir mongoose, dass die ID vom Creatort  dem des Usermodel entspricht

module.exports = mongoose.model('Post', postSchema);
// fügen die Definition in ein Model. Im ersten Parameter geben wir an wie es heißen soll
// und mit dem 2ten sagen wir welches Schema wir verwenden
// export hägen wir an damit das Model außherhalb dieses Files verwendet werden kann