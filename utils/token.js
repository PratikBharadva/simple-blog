const JWT = require("jsonwebtoken");

function generateToken(payload) {
  if (!payload) {
    return { success: false, message: "Provide payload to generate token" };
  }
  const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

  if (!token) {
    return { success: false, message: "Error generating token" };
  }

  return { success: true, token };
}

function validateToken(token) {
  const decode = JWT.verify(token, process.env.JWT_SECRET);

  if (!decode) return null;
  return decode;
}

module.exports = { generateToken, validateToken };
