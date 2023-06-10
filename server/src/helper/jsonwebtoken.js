const jwt = require("jsonwebtoken");

const createJsonWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("payload must be a non-empty object");
  }

  if (typeof secretKey !== "string" || secretKey == "") {
    throw new Error("Secrectkey must be a non-empty object");
  }

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.error("Failed to sign the JWT:", error);
    throw error;
  }
};

module.exports = { createJsonWebToken };
