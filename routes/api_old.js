var express = require("express");
var router = express.Router();

router.use(function(req,res,next){
	if(req.method === "GET")
	{
		return next();
	}
	if(!req.isAuthenticated()){
		return res.redirect('/#login');
	}
	return next();
});
router.route('/posts')
	.get(function(req,res){
		res.send({message: 'TODO: return all posts'});
	})
	.post(function(req,res){
		res.send({message: 'TODO: Create a new post'});
	});

router.route('/posts/:id')
	.get(function(req,res){
		res.send({message: 'TODO: Return post with id ' + req.params.id});
	})
	.put(function(req,res){
		res.send({message: 'TODO: Update post with id ' + req.params.id});
	})
	.delete(function(req,res){
		res.send({message: 'TODO: Delete post with id ' + req.params.id});
	});


//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/posts', isAuthenticated);


module.exports = router;