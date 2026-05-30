const express = require('express');
const router = express.Router();
const {
    // createMember,
    getAllMembers,
    // getMemberById,
    getMembersBySocietyId,
    createMemberBysoceityId,
    updateMemberBySociety,
    deleteMemberBySociety
    // updateMember,
    // deleteMember,
    
} = require('../controllers/MemberController'); 

// Create a new account group
// router.post('/',  createMember);
router.get('/',getAllMembers)
// router.get("/:id",getMemberById)
router.get('/society/:societyId', getMembersBySocietyId);
router.post("/society/:societyId/", createMemberBysoceityId);
router.put("/society/:societyId/members/:memberId", updateMemberBySociety);
router.delete("/society/:societyId/members/:memberId", deleteMemberBySociety);
// router.put("/:id", updateMember);
// router.delete("/:id",deleteMember);

module.exports = router;
