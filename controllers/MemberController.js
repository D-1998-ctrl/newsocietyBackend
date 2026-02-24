const Member = require("../models/MemberModels");
const mongoose = require('mongoose');

// exports.getMemberAutocomplete = async (req, res) => {
//   console.log("🔹 Autocomplete Function HIT");

//   try {
//     const query = req.query.query || ""; // Default to empty string if no query
//     console.log("🔹 Received query:", query);

//     // Validate if query is not empty
//     if (query.trim() === "") {
//       return res.status(400).json({ error: "Query parameter is required" });
//     }

//     // Use regular expressions to search for matches on unitNumber, firstName, and surname
//     const members = await Member.find({
//       $or: [
//         { unitNumber: { $regex: query, $options: "i" } }, // Case-insensitive regex for unitNumber
//         { firstName: { $regex: query, $options: "i" } }, // Case-insensitive regex for firstName
//         { surname: { $regex: query, $options: "i" } }, // Case-insensitive regex for surname
//       ],
//     }).select("unitNumber firstName surname "); // Only return necessary fields for autocomplete

//     console.log("🔹 Members found:", members.length);

//     // If no members found, send a suitable response
//     if (members.length === 0) {
//       return res
//         .status(200)
//         .json({ message: "No members found matching your query" });
//     }

//     // Format and send response
//     const results = members.map((member) => ({
//       label: `${member.firstName} ${member.surname} - ${member.unitNumber}`,
//       value: member.unitNumber,
//     }));

//     res.json(results); // Send formatted data back to frontend
//   } catch (err) {
//     console.error("🔴 Error fetching members:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Create a new member
// // exports.createMember = async (req, res) => {
// //   try {
// //     const member = new Member(req.body);
// //     await member.save();
// //     res.status(201).json(member);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // };

// exports.createMember = async (req, res) => {
//   try {
//      const incomingMembers = Array.isArray(req.body) ? req.body : [req.body];
//     const newMembers = [];

//     for (const member of incomingMembers) {
//       const exists = await Member.findOne({
//         firstName: member.firstName,
//         middleName: member.middleName,
//         surname: member.surname,
//         dateOfBirth: member.dateOfBirth,
//         gender: member.gender,
//         occupation: member.occupation,
//         annual: member.annual,
//         email: member.email,
//         mobile: member.mobile,
//         adharCardNo: member.adharCardNo,
//         panCardNo: member.panCardNo,
//         addressType: member.addressType,
//         addressLine1: member.addressLine1,
//         addressLine2: member.addressLine2,
//         city: member.city,
//         state: member.state,
//         zipCode: member.zipCode,
//         country: member.country,
//         propertyType: member.propertyType,
//         unitNumber: member.unitNumber,
//         wingName: member.wingName,
//         floor: member.floor,
//         unitType: member.unitType,
//         fourWheelerParking: member.fourWheelerParking,
//         twoWheelerParking: member.twoWheelerParking,
//         contactFirstName: member.contactFirstName,
//         contactMiddleName: member.contactMiddleName,
//         contactSurname: member.contactSurname,
//         contactEmail: member.contactEmail,
//         contactMobile: member.contactMobile,
//         nominationFirstName: member.nominationFirstName,
//         nominationMiddleName: member.nominationMiddleName,
//         nominationSurname: member.nominationSurname,
//         nominationEmail: member.nominationEmail,
//         nominationMobile: member.nominationMobile,
//         dateOfNomination: member.dateOfNomination,
//         dateOfAdmission: member.dateOfAdmission,
//         dateOfEntranceFeePayment: member.dateOfEntranceFeePayment,
//         dateOfCessationOfMembership: member.dateOfCessationOfMembership,
//         reasonOfCessation: member.reasonOfCessation,
//         ageOfAccount: member.ageOfAccount,
//         remark: member.remark,

//       });

//       if (!exists) {
//         newMembers.push(member);
//       }
//     }

//     if (newMembers.length > 0) {
//       const saved = await Member.insertMany(newMembers);
//       res.status(201).json({
//         message: `${saved.length} new member(s) saved.`,
//         data: saved,
//       });
//     } else {
//       res.status(200).json({ message: "No new members to save." });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "Error saving members", error: err });
//   }
// };

// // Get all members
// exports.getAllMembers = async (req, res) => {
//   try {
//     const members = await Member.find();
//     res.json(members);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.getMemberById = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id);
//     if (!member) return res.status(404).json({ error: "Member not found" });
//     res.json(member);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update a member
// exports.updateMember = async (req, res) => {
//   try {
//     const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!member) return res.status(404).json({ error: "Member not found" });
//     res.json(member);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Delete a member
// exports.deleteMember = async (req, res) => {
//   try {
//     const member = await Member.findByIdAndDelete(req.params.id);
//     if (!member) return res.status(404).json({ error: "Member not found" });
//     res.json({ message: "Member deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


//for post 

const createMember = async (req, res) => {
  try {
    const newMember = new Member(req.body);
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//for get all members
const getAllMembers = async (req, res) => {
  try {
    const member = await Member.find();
    res.status(200).json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get BY ID
const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

         const updatedmember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedmember) return res.status(404).json({ error: 'Audit report not found' });

        res.status(200).json(updatedmember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Delete
const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const deletedMember = await Member.findByIdAndDelete(req.params.id);

        if (!deletedMember) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
}