const express = require('express');
const router = express.Router();

const Expense = require('../models/Expense');
const moment = require('moment');

router.get('/newExpense', function (req, res, next) {
  res.render('newExpense');
});

router.post('/addExpense', (req, res, next) => {
  var data = req.body;
  data.budget = 'Expense';
  data.userId = req.user._id;
  data.month = moment(data.date).format('MMMM');
  data.year = moment(data.date).format('YYYY');
  Expense.create(data, (err, expense) => {
    if (err) return next(err);
    res.redirect('/dashboard');
  });
});

router.get('/deleteExpense/:id', (req,res,next)=>{
  var id = req.params.id;
  Expense.findByIdAndDelete(id, (err, expense) => {
    if (err) return next(err);
    res.redirect('/dashboard');
  });
});

router.get('/editExpense/:id', (req,res,next)=>{
  var id = req.params.id;
  Expense.findById(id, (err, expense) => {
    if (err) return next(err);
    res.render('editExpense', {expense, moment});
  });
});


router.post('/editExpense/:id', (req,res,next)=>{
  var id = req.params.id;
  var data = req.body;
  data.userId = req.user._id;
  data.month = moment(data.date).format('MMMM');
  data.year = moment(data.date).format('YYYY');
  data.budget = 'Expense';
  Expense.findByIdAndUpdate(id, data, (err, expense) => {
    if (err) return next(err);
    res.redirect('/dashboard');
  });
});



module.exports = router;
