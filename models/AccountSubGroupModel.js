const mongoose = require('mongoose');

const SubgroupSchema = new mongoose.Schema({

    subgroupCode: {
        type: String,
        required: true,
      },
      subgroupName: {
        type: String,
        required: true,
      },
      
})

const AccountSubGroupModel = mongoose.model('accountSubGroup', SubgroupSchema);
module.exports = AccountSubGroupModel;