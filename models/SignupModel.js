const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        
    },

    phoneNumber: {
        type: String,
        required: true,
        min: 1000000000,
        max: 9999999999,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, "Please fill a valid email address"], // Email format validation
    },

    password: {
        type: String,

    },

    cpassword: {
        type: String,
        validate: {
            validator: function (validate) {
                return this.password === validate;
            },
            message: "Passwords do not match",
        },
    },

    financialYear: { type: mongoose.Schema.Types.ObjectId, ref: 'FinancialYear', }

})
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;