const mongoose = require('mongoose');

const AuditTempSchema = new mongoose.Schema({

    tempName: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
       
      },
      tempBody: {
        type: String,
        required: true,
      },
      
})

const AuditTempModel = mongoose.model('audittemplate', AuditTempSchema);
module.exports = AuditTempModel;