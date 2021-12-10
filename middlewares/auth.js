const passport = require('passport');
const User = require('../models/User');

module.exports = {
  loggedInUser: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else if (
      req.session &&
      req.session.passport &&
      req.session.passport.user
    ) {
      next();
    } else {
      req.flash('error', 'To use this feature, you have to signin first...');
      res.redirect('/users/signin');
    }
  },

  userInfo: (req, res, next) => {
    var userId =
      (req.session && req.session.userId) ||
      (req.session && req.session.passport && req.session.passport.user) ||
      null;
    if (userId) {
      User.findById(userId, (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
};
