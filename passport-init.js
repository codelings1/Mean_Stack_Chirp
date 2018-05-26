var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){
	
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
	console.log('serializing user:',user._id);
	//return the unique id for the user
	return done(null, user._id);
	});

	//Desieralize user will call with the unique id provided by serializeuser
	passport.deserializeUser(function(id, done) {
	User.findById(id,function(err,user){
		console.log('deserializing user:',user.username);
		done(err,user);
	});
	
	});
	passport.use('login', new LocalStrategy({
		passReqToCallback: true
	},
	function(request, username, password, done){
		console.log("I am here");
		User.findOne({'username':username}, function(err,user){
				if(err){
					return done(err, false);
				}
				if(!user){
					return done("Username "+ username + " not present", false);
				}
				if(!isValidPassword(user, password)){
					return done('incorrect password', false);
				}
				return done(null, user);
				
			});
	}
	));
	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {
			User.findOne({username:username}, function(err,user){
				if(err){
					console.log("Here1");
					return done(err, false);
				}
				if(user){
					console.log("Here2");
					return done("Username already taken", false);
				}
				console.log("Here3");
					
				var user = new User();
				user.username = username;
				user.password = createHash(password);
				user.save(function(err, user){
					if(err){
						return done(err, false);
					}
					console.log("Successfully signed up user " + username);
					return done(null, user);
				});
			});
			

		})
	);
}

var isValidPassword = function(user, password){
	return bCrypt.compareSync(password, user.password);
};			
// Generates hash using bCrypt
var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};