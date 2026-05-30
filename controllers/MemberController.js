const Member = require("../models/MemberModels");
const mongoose = require('mongoose');

// Get members by society ID
const getMembersBySocietyId = async (req, res) => {
  try {
    const { societyId } = req.params;

    const members = await Member.find({ societyId });

    res.status(200).json(members); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create members by soceity Id
const createMemberBysoceityId = async (req, res) => {
  try {
    const { societyId } = req.params;

    const member = await Member.create({
      ...req.body,
      societyId,
    });

    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//updateMemberBySociety
const updateMemberBySociety = async (req, res) => {
  try {
    const { societyId, memberId } = req.params;
     // 1. ID Validation ✅
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updated = await Member.findOneAndUpdate(
      { _id: memberId, societyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Member not found in this society" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//deleteMemberBySociety
const deleteMemberBySociety = async (req, res) => {
  try {
    const { societyId, memberId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }


    const deletedMember = await Member.findOneAndDelete(
      { _id: memberId, societyId: societyId }
    );

    if (!deletedMember) {
      return res.status(404).json({ error: 'Member not found in this society' });
    }

    res.status(200).json({ message: 'Member deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
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
// const getMemberById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: 'Invalid ID format' });
//     }

//     const member = await Member.findById(req.params.id);
//     if (!member) return res.status(404).json({ error: 'Member not found' });
//     res.status(200).json(member);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// update
// const updateMember = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ error: 'Invalid ID format' });
//         }

//          const updatedmember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedmember) return res.status(404).json({ error: 'Audit report not found' });

//         res.status(200).json(updatedmember);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
//for post 
// const createMember = async (req, res) => {
//   try {
//     const newMember = new Member(req.body);
//     const savedMember = await newMember.save();
//     res.status(201).json(savedMember);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };
//Delete
// const deleteMember = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ error: 'Invalid ID format' });
//         }

//         const deletedMember = await Member.findByIdAndDelete(req.params.id);

//         if (!deletedMember) {
//             return res.status(404).json({ error: 'Member not found' });
//         }

//         res.status(200).json({ message: 'Member deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


module.exports = {
  // createMember,
  getAllMembers,
  // getMemberById,
  getMembersBySocietyId,
  createMemberBysoceityId,
  updateMemberBySociety,
  deleteMemberBySociety
  // updateMember,
  // deleteMember,
}