const mongoose = require("mongoose");
// const Counter = require("./Counter"); 
const AutoIncrement = require("mongoose-sequence")(mongoose);

const InvoiceHeaderSchema = new mongoose.Schema(
  {
  
    invoiceDate: { type: Date},
    memberId:
    { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    //  { type: String, required: true },
    period: { type: String,  maxlength: 50 },
    dueDate: { type: Date},
    // amtInWords: { type: String },
     amtInWords: { type: String },
    narration: { type: String,  maxlength: 200 }
  },
  { timestamps: true }
);


InvoiceHeaderSchema.plugin(AutoIncrement, {
  inc_field: "billinvoiceNumber",
  start_seq: 1000, // optional starting number
});


const Invoice = mongoose.model("InvoiceHeader", InvoiceHeaderSchema);

module.exports = Invoice;



