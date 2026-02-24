const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema({

  VoucherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReceiptVoucher',
  },
  
  VoucherType: { type: String, required: true },

  LedgerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },

  // VoucherAmount: { type: Number, required: true },
  CrAmount: { type: Number, },
  DrAmount: { type: Number, },
  VoucherNumber: { type: Number, required: true },

EntryType: {
  type: String,
  enum: ['Credit', 'Debit'],
 
},

},
  { timestamps: true });

const Voucher = mongoose.model('Voucher', VoucherSchema);

module.exports = Voucher;
