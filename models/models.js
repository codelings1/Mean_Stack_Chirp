var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	created_by: String,
	text: String,
	created_at: {type: Date, default: Date.now}
});

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	created_at: {type: Date, default: Date.now}
});


//declare models

mongoose.model("User",userSchema);
mongoose.model("Post",postSchema);