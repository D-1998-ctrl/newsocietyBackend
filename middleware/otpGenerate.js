
// utils/randomStringGenerator.js
const randomstring = require("randomstring");

function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
}

module.exports =  generateOTP ;
