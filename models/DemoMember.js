const mongoose = require('mongoose');

const demoMemberSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  Area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true
  },
  CC: {
    type: String,
    trim: true,
  },
  invoices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DemoInvoice'
  }],
  Email:{
    type:String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
demoMemberSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for better performance
demoMemberSchema.index({ cc: 1 });
demoMemberSchema.index({ lastName: 1, firstName: 1 });

const DemoMember = mongoose.model('DemoMember', demoMemberSchema);

module.exports = DemoMember;