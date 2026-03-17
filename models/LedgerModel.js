const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);

const accountSchema = new mongoose.Schema(
  {
    // accountId: { type: Number, unique: true, },
    accountName: { type: String, },

    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'accountGroup', },
    subGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'accountSubgroup',  },

    opening: { type: Number, default: 0 },
    drOrCr: { type: String, enum: ['DR', 'CR'],  },
    typeCode: {
      type: String,
      enum: ['Balance Sheet', 'Profit and Loss Account', 'Trading Account'],
      
    },
  },
  { timestamps: true }
);
accountSchema.plugin(AutoIncrement, {
  inc_field: "accountId",
  start_seq: 1000, 
});
const Account = mongoose.model('Account', accountSchema);
module.exports = Account;