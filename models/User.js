const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, match: /@/, unique: true },

    localUser: {
      name: { type: String },
      phone: { type: String },
      password: { type: String },
      dateOfBirth: { type: String },
      address: { type: String },
      avatarUrl: { type: String },
    },

    githubUser: {
      name: { type: String },
      githubUserName: { type: String },
      avatarUrl: { type: String },
    },

    googleUser: {
      name: { type: String },
      googleUserId: { type: String },
      avatarUrl: { type: String },
    },

    providers: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (this.localUser.password) {
    console.log('hey');
    bcrypt.hash(this.localUser.password, 10, (err, hashedPwd) => {
      if (err) return next(err);
      console.log(hashedPwd);
      this.localUser.password = hashedPwd;
      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.localUser.password, (err, result) => {
    return cb(err, result);
  });
};

module.exports = mongoose.model('User', userSchema);
