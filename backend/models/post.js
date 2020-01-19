const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: {type: String, required: true}
});

// fügen die Definition in ein Model. Im ersten Parameter geben wir an wie es heißen soll
// und mit dem 2ten sagen wir welches Schema wir verwenden
// export hägen wir an damit das Model außherhalb dieses Files verwendet werden kann
module.exports = mongoose.model('Post', postSchema);
