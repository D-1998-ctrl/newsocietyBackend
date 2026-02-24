const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const contraVoucherSchema = new mongoose.Schema({
  
  date: { type: Date, required: true },
  amountWithdrawn: { type: Number, required: true },
  previousOSBills: { type: String },
  transactionType: { type: String, required: true },
  instNo: { type: String },
  chequeNo: { type: String },
  instDate: { type: Date },
  bankName: { type: String },
  // branchName: { type: String },
  narration: { type: String },
  crNameOfCreditor: {type: mongoose.Schema.Types.ObjectId, },
  nameOfLedger: {type: mongoose.Schema.Types.ObjectId },
  crAmountWithdraw: { type: Number },
  amount: { type: Number },
  branch: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

contraVoucherSchema.plugin(AutoIncrement, {
  inc_field: "contraVoucherNumber",
  start_seq: 1000, // optional starting number
});

const ContraVoucher = mongoose.model("ContraVoucher", contraVoucherSchema);

module.exports = ContraVoucher;
