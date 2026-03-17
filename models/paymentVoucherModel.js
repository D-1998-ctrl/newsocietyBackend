const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);


const paymentVoucherSchema = new mongoose.Schema({
  
  date: { type: Date, required: true },
  nameOfCreditor: { type: mongoose.Schema.Types.ObjectId,ref: 'Account', required: true },
  amountPaidDr: { type: Number, required: true },
  bank: { type: String },
  drName: { type: mongoose.Schema.Types.ObjectId, ref: 'Account',required: true },
  amountPaidCr: { type: Number, required: true },
  transactionType: { type: String, required: true },
  instNo: { type: String },
  chequeNo: { type: String },
  instDate: { type: Date },
  narration: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add auto-incrementing voucherNumber
paymentVoucherSchema.plugin(AutoIncrement, {
  inc_field: "PaymentVoucherNumber",
  start_seq: 1000, // optional starting number
});

const PaymentVoucher = mongoose.model('PaymentVoucher', paymentVoucherSchema);

module.exports = PaymentVoucher;