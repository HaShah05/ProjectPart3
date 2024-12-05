let express = require('express');
let router = express.Router();
let passport = require('passport');
let userModel= require('../model/user')
let User = userModel.User;




module.exports.displayLoginPage = (req, res, next) => {
    res.render('auth/login', {
        title: 'Login',
        message: req.flash('loginMessage'),
        displayName: req.user ? req.user.displayName : '', // Pass displayName if logged in
        isLoggedIn: !!req.user // Pass true if user is logged in, false otherwise
    });
};

  module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Login error:', err);
            return next(err);
        }
        if (!user) {
            req.flash('loginMessage', 'Authentication Failed');
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            if (err) {
                console.error('Login failed:', err);
                return next(err);
            }
            console.log('Login successful, redirecting...');
            return res.redirect('/tournamentslist');
        });
    })(req, res, next);
};

  
  module.exports.displayRegisterPage = (req,res,next)=>{
      //check if user is logged in
      if(!req.user)
      {
        res.render('auth/register', 
          {
          title: "Register",
          message: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName: '',
          isLoggedIn: !!req.user

  
        })
      }
      else
      {
          return res.redirect('/')
      }
  }
  //proces register
  module.exports.processRegisterPage = (req, res, next) => {
    console.log('Processing registration...');
    console.log('Request body:', req.body);

    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        displayName: req.body.displayName,
    });

    User.register(newUser, req.body.password, (err) => {
        if (err) {
            console.error('Registration error:', err);
            if (err.name === "UserExistsError") {
                req.flash('registerMessage', 'User already exists');
            }
            return res.render('auth/register', {
                title: 'Register',
                message: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : '',
            });
        }

        console.log('User registered successfully!');
        req.login(newUser, (err) => {
            if (err) {
                console.error('Login failed after registration:', err);
                return next(err);
            }
            console.log('Login successful after registration, redirecting...');
            res.redirect('tournamentslist');
        });
    });
};


  module.exports.peformLogout = (req,res,next)=>
  {

    req.logout(function(err){
        if(err){
            return next(err);
        }
    })
    res.redirect('/');

    
        
  }

