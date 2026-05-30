const mongoose = require('mongoose');

const InvoiceDetailSchema = new mongoose.Schema({

  invoiceId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to InvoiceHeader's _id
    ref: 'InvoiceHeader',

  },
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society",
    required: true
  },
  // serviceIds: [{type: Number,}],

  serviceIds: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },

  //  amounts: [{type: String,}],
  amounts: {
    type: Number,
    required: true,
  },

}, { timestamps: true });

const InvoiceDetail = mongoose.model('InvoiceDetail', InvoiceDetailSchema);
module.exports = InvoiceDetail;
