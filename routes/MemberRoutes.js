// const express = require("express");
// const router = express.Router();
// const memberController = require("../controllers/MemberController");

// // Route to create a new member
// router.post("/", memberController.createMember);

// // Route to get all members
// router.get("/", memberController.getAllMembers);

// // Route to get a single member by ID
// router.get("/:id", memberController.getMemberById);

// // Route to update a member by ID
// router.put("/:id", memberController.updateMember);

// // Route to delete a member by ID
// router.delete("/:id", memberController.deleteMember);

// // Define the GET route for autocomplete
// router.get("/autocomplete/:id", memberController.getMemberAutocomplete);

// // Test route (for checking server or as a simple example)
// router.get("/api/a", (req, res) => {
//   res.send("Hello World!");
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
    createMember,
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember,
    
} = require('../controllers/MemberController'); 

// Create a new account group
router.post('/',  createMember);
router.get('/',getAllMembers)
router.get("/:id",getMemberById)
router.put("/:id", updateMember);
router.delete("/:id",deleteMember);

module.exports = router;
