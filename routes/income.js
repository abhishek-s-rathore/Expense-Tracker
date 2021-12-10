const express = require('express');
const router = express.Router();

const Income = require('../models/Income');
const moment = require('moment');

router.get('/newIncome', function (req, res, next) {
  res.render('newIncome');
});

router.post('/addIncome', (req, res, next) => {
  var data = req.body;
  data.userId = req.user._id;
  data.month = moment(data.date).format('MMMM');
  data.year = moment(data.date).format('YYYY');
  data.budget = 'Income';
  Income.create(data, (err, income) => {
    if (err) return next(err);
    res.redirect('/dashboard');
  });
});

router.get('/deleteIncome/:id', (req,res,next)=>{
  var id = req.params.id;
  Income.findByIdAndDelete(id, (err, income) => {
    if (err) return next(err);
    res.redirect('/dashboard');
  });
});

router.get('/editIncome/:id', (req,res,next)=>{
  var id = req.params.id;
  Income.findById(id, (err, income) => {
    if (err) return next(err);
    res.render('editIncome', {income, moment});
  });
});

router.post('/editIncome/:id', (req,res,next)=>{
  var id = req.params.id;
  var data = req.body;
  data.userId = req.user._id;
  data.month = moment(data.date).format('MMMM');
  data.year = moment(data.date).format('YYYY');
  data.budget = 'Income';
  Income.findByIdAndUpdate(id, data, (err, income) => {
    if (err) return next(err);
    res.redirect('/dashboard');
  });
});

module.exports = router;
