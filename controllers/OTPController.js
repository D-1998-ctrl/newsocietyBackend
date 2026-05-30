
const express = require("express");
const generateOTP = require("../middleware/otpGenerate");
const OTP = require("../models/OTPModel");
const User = require("../models/SignupModel");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/request-otp", async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    // 1️⃣ CHECK IF EMAIL ALREADY EXISTS
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "This email is already registered"
      });
    }

    // 2️⃣ GENERATE OTP
    const otp = generateOTP();

    // 3️⃣ SAVE OTP IN DB
    const otpRecord = new OTP({
      email,
      otp
    });

    await otpRecord.save();

    // 4️⃣ SEND EMAIL
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

 

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message
    });
  }
});
// router.post("/verify-otp", async (req, res) => {
//   const email = req.body.email;
//   const otpAttempt = req.body.otp;

//   try {
//     const otpDocument = await OTP.findOne({ email });
//     if (!otpDocument) {
//       return res.status(404).json({ error: "Email not found" });
//     }

//     if (otpAttempt !== otpDocument.otp) {
//       return res.status(401).json({ error: "Invalid OTP" });
//     }

//     // await OTP.deleteOne({ email });
//     console.log("Email verified successfully for:", email);
//     res.status(200).json({ msg: "Email verified successfully" });
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     res.status(500).json({ error: "Error verifying OTP" });
//   }
// });
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpDocument = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpDocument) {
      return res.status(404).json({ error: "Email not found" });
    }

    if (String(otp) !== String(otpDocument.otp)) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    await OTP.deleteOne({ email });

    res.status(200).json({ msg: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ error: "Error verifying OTP" });
  }
});

module.exports = router;
