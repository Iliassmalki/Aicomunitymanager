const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  content:{
type: String,
required: true,

  },

  hashtags:{
    type:String
  },
  imageUrl: { // optional AI-generated image
    type: String,
  },
  start: {
    type: Date,
    default: () => new Date(), // defaults to now
  },
  end: {
    type: Date,
    default: function() {
      return new Date(this.start.getTime() + 60 * 60 * 1000); // 1 hour after start
    }
  },
  posted:{
      type:Boolean,
      default: false
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }
},
{ timestamps: true } // createdAt and updatedAt
);

// Create model
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

module.exports = Post;