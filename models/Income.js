const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeSchema = new Schema(
  {
    budget: { type: String, required: true },
    source: { type: String, required: true },
    incomeAmount: { type: Number, default: 0, required: true },
    date: { type: Date, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Income', incomeSchema);
