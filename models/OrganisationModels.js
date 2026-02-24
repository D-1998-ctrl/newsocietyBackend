const mongoose = require("mongoose");

const OrganisationSchema = new mongoose.Schema(
  {
    SocietyName: { type: String, required: true },
    AddressLine1: { type: String, required: true },
    AddressLine2: { type: String },
    AddressLine3: { type: String },
    State: { type: String, required: true },
    Pin: { type: String, required: true },
    Mobile: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Registration: { type: String, required: true, unique: true },
    RegisteredDate: { type: Date, required: true },
    RegisteringAuthority: { type: String, required: true },
    AddressofRegisteringAuthority: { type: String, required: true },
    Auditor:{type: String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Society", OrganisationSchema);
