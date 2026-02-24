const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for Board Members
const boardMemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  position: {
    type: String,
    enum: ['President', 'Vice President', 'Secretary', 'Treasurer', 'Member'],
    required: true, 
  },

  contactNumber: {
    type: String,
    required: true, 
  },

  email: {
    type: String,
    required: true,
    unique: true, 
  },

  address: {
    type: String,
    required: true, 
  },

  wingId: {
    type: Schema.Types.ObjectId,
    ref: 'Wing', // Reference to the Wings table
    required: true,
  },

  //  wingId: {
  //   type: Number,
  // },

  // flatId: {
  //   type: Number,
  // },


  flatId: {
    type: Schema.Types.ObjectId,
    ref: 'UnitType', // Reference to the UnitTypes table
    required: true,
  },
  startDate: {
    type: Date,
    required: true, 
  },

  endDate: {
    type: Date, 
  },

  isActive: {
    type: Boolean,
    default: true, 
  },
});

// Create the model from the schema
const BoardMember = mongoose.model('BoardMember', boardMemberSchema);
module.exports = BoardMember;
