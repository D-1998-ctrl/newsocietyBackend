const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);

const accountSchema = new mongoose.Schema(
  {
    accountId: { type: Number, unique: true, },
    accountName: { type: String, required: true },
  
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'accountGroup', required: true },
    subGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'accountSubgroup', default: null  },
    
    opening: { type: Number, default: 0},
    drOrCr: { type: String, enum: ['DR', 'CR'] ,required: false },
    typeCode: {
      type: String,
      enum: ['Balance Sheet', 'Profit and Loss Account', 'Trading Account'],
      required: false
    },
  },
  { timestamps: true }
);
accountSchema.plugin(AutoIncrement, {
  inc_field: "accountId",
  start_seq: 1000, // optional starting number
});
const Account = mongoose.model('Account', accountSchema);
module.exports = Account;