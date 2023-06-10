const jwt = require("jsonwebtoken");

const createJsonWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("payload must be a non-empty object");
  }
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
};

module.exports = { createJsonWebToken };
