var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models/User');

//  Github Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/users/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      var email = profile._json.email;
      var github = {
        email: email,
        providers: [profile.provider],
        githubUser: {
          name: profile.displayName,
          username: profile.username,
          avatarUrl: profile._json.avatar_url,
        },
      };
      User.findOne({ email: profile._json.email }, (err, user) => {
        // console.log(err, user);
        if (err) return done(err);
        if (!user) {
          User.create(github, (err, addedUser) => {
            if (err) return done(err);
            return done(null, addedUser);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);

//  Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/users/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      var email = profile._json.email;
      var google = {
        email: email,
        providers: [profile.provider],
        googleUser: {
          name: profile.displayName,
          googleUserId: profile.id,
          avatarUrl: profile._json.picture,
        },
      };

      User.findOne({ email }, (err, user) => {
        // console.log(err, user);
        if (err) return done(err);
        if (!user) {
          User.create(google, (err, addedUser) => {
            if (err) return done(err, false);
            return done(null, addedUser);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, 'name email username', (err, user) => {
    done(err, user);
  });
});
