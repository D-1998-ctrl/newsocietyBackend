
const mongoose = require("mongoose");
const MemberSchema = new mongoose.Schema(
  {
    // Section info
    memberName: { type: String },
    // ledger: { type: String },
    ledger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true
    },

    wingName: { type: String },
    floor: { type: String },
    unitNum: { type: String },
    unitType: { type: String },
    memberType: { type: String },
    unitArea: { type: Number },
    typeOfArea: { type: String, enum: ["Carpet", "Built-up"], },
    // chargesTemp: { type: String },
    chargesTemp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    // supllimentarychargesTemp: { type: String },
    supllimentarychargesTemp:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    parkingDetail: { type: String },
    contactNum: { type: String },
    mobileNum: { type: Number },
    email: { type: String },
    pannumber: { type: String },
    dateOfAdmission: { type: Date },
    dateOfEntranceFeePayment: { type: Date },
    occupation: { type: String },
    age: { type: Number },
    NameOfNominee: { type: String },
    DateOfNomination: { type: Date },
    DateCessationMembership: { type: Date },
    ReasonOfCessation: { type: String },
    Remark: { type: String }
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", MemberSchema);

module.exports = Member;
