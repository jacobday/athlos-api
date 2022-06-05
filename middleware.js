let jwt = require("jsonwebtoken");
const config = process.env.JWT_SECRET;

let checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: "Auth token is not supplied",
    });
  }
};

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.email = data.email;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

// set up rate limiter: maximum of 20 requests per minute
const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 20
});

module.exports = {
  checkToken: checkToken,
  authorization: authorization,
  limiter: limiter,
};
