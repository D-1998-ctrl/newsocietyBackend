const express = require('express');

const { createBoardMember,
  getAllBoardMembers,
  getBoardMemberById,
  updateBoardMember,
  deleteBoardMember,
 } = require('../controllers/BoardMembersController');


const router = express.Router();

router.post('/', createBoardMember);
router.get('/', getAllBoardMembers);
router.get('/:id', getBoardMemberById);
router.patch('/:id', updateBoardMember);
router.delete('/:id', deleteBoardMember);

module.exports = router;


