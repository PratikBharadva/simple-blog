const { validateToken } = require("../utils/token");

const checkUserLogin = (req, res, next) => {
  let authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1]; // authHeader = "Bearer ${token}"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided!",
    });
  }

  try {
    const decode = validateToken(token);

    if (!decode) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token!",
      });
    }
    req.user = decode;
    next();
  } catch (error) {
    return res.status(498).json({
      success: false,
      message: error.message,
    });
  }
};

function authorize(role) {
  return (req, res, next) => {
    if (req.user && role.includes(req.user.role)) {
      next();
    } else {
      return res.json({
        success: false,
        message: `Only ${role} are allowed`,
      });
    }
  };
}
module.exports = { checkUserLogin, authorize };
