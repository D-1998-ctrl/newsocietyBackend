const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);


const JournalVoucherSchema = new mongoose.Schema(
  {
   
    date: { type: String, required: true },
    debitLedger: { type: mongoose.Schema.Types.ObjectId, ref: 'Account',},
    creditLedger: { type: mongoose.Schema.Types.ObjectId, ref: 'Account',},
    debitAmount: { type: Number },
    creditAmount: { type: Number },
    narration: { type: String },
  },
  { timestamps: true }
);

// Add auto-incrementing voucherNumber
JournalVoucherSchema.plugin(AutoIncrement, {
  inc_field: "JournalVoucherNumber",
  start_seq: 1000, // optional starting number
});



 const JournalVoucher = mongoose.model("JournalVoucher", JournalVoucherSchema);
module.exports = JournalVoucher;
