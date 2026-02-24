// const mongoose = require('mongoose');

// // Define the schema
// const VoucherDetailSchema = new mongoose.Schema({
//   vdId: {
//     type: Number,
//     required: true
//   },
//   VoucherHeaderId: {
//     type: Number,
//     required: true
//   },
//   SrNo: {
//     type: Number,
//     required: true
//   },
//   AccountId: {
//     type: Number,
//     required: true
//   },
//   Amount: {
//     type: mongoose.Schema.Types.Decimal128,
//     required: true
//   },
//   DebitorCreditor: {
//     type: Number,
//     required: true
//   },
//   Narration: {
//     type: String,
//     required: true
//   },
//   Active: {
//     type: Boolean,
//     required: true
//   },
//   CreatedBy: {
//     type: String,
//     required: true
//   },
//   CreatedOn: {
//     type: Date,
//     default: Date.now
//   },
//   UpdatedBy: {
//     type: String,
//     required: true
//   },
//   UpdatedOn: {
//     type: Date,
//     default: Date.now
//   },
//   UpdateCount: {
//     type: Number,
//     default: 0
//   }
// });

// // Create the model
// const VoucherDetail = mongoose.model('VoucherDetail', VoucherDetailSchema);

// // Export the model
// module.exports = VoucherDetail;


const mongoose = require('mongoose');

// Define the schema
const VoucherDetailSchema = new mongoose.Schema({
  
  VoucherNo: {
     type: Number,
    required: true
  },

  VoucherType: { type: String, required: true },
 
  AmountOfCr: {
     type: Number,
    required: true
  },

    AmountOfDr: {
     type: Number,
    required: true
  },

  DebitorCreditor: {
    type: String,
    required: true
  },
 

 
});

// Create the model
const VoucherDetail = mongoose.model('VoucherDetail', VoucherDetailSchema);

// Export the model
module.exports = VoucherDetail;
