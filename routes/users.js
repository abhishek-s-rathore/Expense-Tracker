var express = require('express');
var User = require('../models/User');

const Expense = require('../models/Expense');
const Income = require('../models/Income');
var passport = require('passport');
var router = express.Router();
var auth = require('../middlewares/auth');
var moment = require('moment');
var mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/signup', (req, res, next) => {
  var error = req.flash('error')[0] || null;
  res.render('signup', { error });
});

router.post('/signup', function (req, res, next) {
  var data = req.body;
  // console.log(data);
  var email = data.email;
  var local = {
    email: email,
    providers: ['local'],
    localUser: {
      name: data.name,
      phone: data.phone,
      avatarUrl: '',
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      password: data.password,
    },
  };
  User.create(local, (err, user) => {
    if (err) {
      if (err.code === 11000) {
        req.flash('error', 'This Email is already registered...');
        return res.redirect('/users/signup');
      }
      if (err.name === 'ValidationError') {
        req.flash('error', 'Enter a valid and strong Password...');
        return res.redirect('/users/signup');
      }
    }
    res.redirect('/users/signin');
  });
});

router.get('/signin', (req, res, next) => {
  var error = req.flash('error')[0] || null;
  res.render('signin', { error });
});

router.post('/signin', function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    req.flash('error', 'Email or Password is missing..');
    return res.redirect('/users/signin');
  }

  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'Email does not exist...');
      return res.redirect('/users/signin');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Wrong Password...');
        return res.redirect('/users/signin');
      }
      // Persist Logged In User Information
      req.session.userId = user.id;
      res.redirect('/dashboard');
    });
  });
});

// OAuth Using Github
router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/users/signup' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// OAuth Using Google
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/signup' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Signing Out User
router.get('/signout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/signin');
});

// Exporting User
module.exports = router;
