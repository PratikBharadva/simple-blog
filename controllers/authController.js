const CryptoJS = require("crypto-js");
const User = require("../modals/userModal");
const { generateToken } = require("../utils/token");

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email or Password is not provided",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    let bytes = CryptoJS.AES.decrypt(user?.password, process.env.SECRET);
    let originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (password !== originalPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = generateToken({
      _id: user?._id,
      firstname: user?.firstname,
      lastname: user?.lastname,
      phone: user?.phone,
      email,
      role: user?.role,
    });

    if(!token?.success){
        return res.json({
            success: token.success,
            message: token.message
        })
    }

    res.status(201).json({
      success: true,
      user,
      token: token.token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = { loginUser };
