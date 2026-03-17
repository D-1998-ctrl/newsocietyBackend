const express = require('express')
const router = express.Router()

const { getUser, getUsersById, CreateUser,UpdateUser,deleteUser,updatePassword,loginUser,} = require('../controllers/SignupController')


router.get('/signup', getUser)
router.get('/signup/:id', getUsersById)
router.post('/signup', CreateUser)
router.patch('/signup/:id', UpdateUser)
///login
router.post("/login", loginUser);

router.patch('/signup/updatepassword', updatePassword)
router.delete('/signup/:id', deleteUser)

module.exports = router