const users = require('../models/SignupModel')
const FinancialYear = require("../models/FinantialyearModel");
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
//get all user 
const getUser = async (req, res) => {
    try {
        const getalluser = await users
            .find({})
            .populate("financialYear", "label ") 
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Users retrieved successfully",
            getalluser
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//get users by id
const getUsersById = async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid User ID" });
    }

    try {
        const userById = await users.findById(id);

        if (!userById) {
            return res.status(404).json({ error: "No such User" });
        }

        res.status(200).json({
            message: "User retrieved successfully",
            user: userById
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//create new user 

const CreateUser = async (req, res) => {
  try {
    const {
      userName,
       phoneNumber,
      email,
      password,
      cpassword,
      financialYear
    } = req.body;

    // 1️⃣ Basic validation
    if (!userName || !phoneNumber || !email || !password || !cpassword || !financialYear) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // 2️⃣ Password match check
    if (password !== cpassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    // 3️⃣ Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    // 4️⃣ Validate Financial Year (IMPORTANT FIX)
    const existingFY = await FinancialYear.findById(financialYear);
    if (!existingFY) {
      return res.status(400).json({
        message: "Invalid Financial Year selected"
      });
    }

    // 5️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6️⃣ Create new user
    const newUser = new users({
      userName,
      phoneNumber,
      email,
      password: hashedPassword,
      financialYear: existingFY._id // 👈 save ObjectId only
    });

    await newUser.save();

    // 7️⃣ Generate JWT
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        financialYear: newUser.financialYear
      },
      process.env.TOKEN_KEY,
      { expiresIn: "24h" }
    );

    // 8️⃣ Populate financial year before sending response
    const populatedUser = await users
      .findById(newUser._id)
      .populate("financialYear");

    // 9️⃣ Response
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: populatedUser._id,
        userName: populatedUser.userName,
        email: populatedUser.email,
        phoneNumber: populatedUser.phoneNumber,
        financialYear: populatedUser.financialYear
      }
    });

  } catch (error) {
    console.error("CreateUser Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

//update user
const UpdateUser = async (req, res) => {
    try {
        const { id } = req.params;   // user id from URL
        const { userName, phoneNumber, email, password, cpassword,financialYear} = req.body;

        // Check if user exists
        const existingUser = await users.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }


        // Prepare update object
        let updatedData = {
            userName: userName || existingUser.userName,
            phoneNumber: phoneNumber || existingUser.phoneNumber,
            email: email || existingUser.email,
            financialYear:financialYear || existingUser.financialYear
        };

        // If password is provided → validate and hash
        if (password) {
            if (!cpassword) {
                return res.status(400).json({ message: "Please confirm password" });
            }

            if (password !== cpassword) {
                return res.status(400).json({ message: "Passwords do not match" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updatedData.password = hashedPassword;
        }

        // Update user
        const updatedUser = await users.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: updatedUser._id,
                userName: updatedUser.userName,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber,
                financialYear:updatedUser.financialYear
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//delete user

const deleteUser = async (req, res) => {
    const { id } = req.params;

    // Validate Mongo ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }

    try {
        const deletedUser = await users.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: "No such User" });
        }

        res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//update password
const updatePassword = async (req, res) => {
    const { email, oldPassword, password, cpassword } = req.body;

    try {
        if (!email || !oldPassword || !password || !cpassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== cpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Find admin
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // Hash new password
        user.password = await bcrypt.hash(password, 10);

        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//login 
// const loginUser = async (req, res) => {
//     try {
//         const { email, password, financialYear } = req.body;

//         // 1️⃣ Validation
//         if (!email || !password || !financialYear) {
//             return res.status(400).json({
//                 message: "Email, Password and Financial Year are required"
//             });
//         }

//         // 2️⃣ Find User by Email
//         const user = await users.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: "Invalid Email" });
//         }

//         // 3️⃣ Check Password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid Password" });
//         }

//         // 4️⃣ Find Financial Year by ID
//         const existingFY = await FinancialYear.findById(financialYear);
//         if (!existingFY) {
//             return res.status(400).json({ message: "Invalid Financial Year" });
//         }

//         // 5️⃣ Save FinancialYear ObjectId in User
//         user.financialYear = existingFY._id;
//         await user.save();

//         // 6️⃣ Populate Financial Year
//         const populatedUser = await users
//             .findById(user._id)
//             .populate("financialYear", "label");

//         // 7️⃣ Generate Token
//         const token = jwt.sign(
//             {
//                 userId: populatedUser._id,
//                 email: populatedUser.email,
//                 financialYear: populatedUser.financialYear._id
//             },
//             process.env.TOKEN_KEY,
//             { expiresIn: "24h" }
//         );

//         res.status(200).json({
//             message: "Login successful",
//             token,
//             user: populatedUser
//         });

//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json({
//             message: "Server Error",
//             error: error.message
//         });
//     }
// };
const loginUser = async (req, res) => {
    try {
        const { email, password, financialYear } = req.body;

        // 1️⃣ Validation
        if (!email || !password || !financialYear) {
            return res.status(400).json({
                message: "Email, Password and Financial Year are required"
            });
        }

        // 2️⃣ Find User by Email
        const user = await users.findOne({ email }).populate("financialYear");

        if (!user) {
            return res.status(400).json({
                message: "Invalid Email"
            });
        }

        // 3️⃣ Check Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        // 4️⃣ Check Financial Year Exists
        const existingFY = await FinancialYear.findById(financialYear);

        if (!existingFY) {
            return res.status(400).json({
                message: "Financial Year not found"
            });
        }

        // 5️⃣ Check Financial Year Match with User
        if (!user.financialYear || user.financialYear._id.toString() !== financialYear) {
            return res.status(400).json({
                message: "Invalid Financial Year for this user"
            });
        }

        // 6️⃣ Generate JWT Token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                financialYear: user.financialYear._id
            },
            process.env.TOKEN_KEY,
            { expiresIn: "24h" }
        );

        // 7️⃣ Response
        res.status(200).json({
            message: "Login successful",
            token,
            user: user
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};



module.exports = {
    getUser,
    getUsersById,
    CreateUser,
    UpdateUser,
    deleteUser,
    updatePassword,
    loginUser,

}