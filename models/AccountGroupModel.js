const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({

    groupCode: {
        type: Number,
        required: true,
      },
      groupName: {
        type: String,
        required: true,
      },
      typeCode: {
        type: String,
        required: true,
      },
      
})

const AccountGroupModel = mongoose.model('accountGroup', GroupSchema);
module.exports = AccountGroupModel;