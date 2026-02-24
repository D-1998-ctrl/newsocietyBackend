const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const purchaseVoucherSchema = new mongoose.Schema(
   {
  //   voucherNumber: {
  //     type: Number,
  //     // Don't set unique here if you're using custom sequences; handled by plugin
  //   },
    date: {
      type: Date,
      required: true
    },
    refBillNo: {
      type: Number,
      required: true
    },
    drNameOfLedger: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    crTdsPayable: {
      type: Number,
      required: true
    },
    sgst: {
      type: Number,
      required: true
    },
    billDate: {
      type: Date,
      required: true
    },
    crNameOfCreditor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    amountOfBill: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    cgst: {
      type: Number,
      required: true
    },
    billPeriod: {
      type: String,
      required: true
    },
    narration: {
      type: String
    },
    customerNo: {
      type: String
    },
    
    isregisterd:{type:Boolean},

  },
  {
    timestamps: true // Auto-adds createdAt and updatedAt
  }
);

// ✅ Auto-increment voucherNumber using a custom counter ID
purchaseVoucherSchema.plugin(AutoIncrement, {
  inc_field: 'purchasevoucherNumber',
  start_seq: 1000, // MUST exist in `counters` collection or will throw error
});

const PurchaseVoucher = mongoose.model('PurchaseVoucher', purchaseVoucherSchema);

module.exports = PurchaseVoucher;
