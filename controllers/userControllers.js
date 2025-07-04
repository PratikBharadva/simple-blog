const CryptoJS = require("crypto-js");
const User = require("../modals/userModal");

async function createUser(req, res) {
  const { firstname, lastname, phone, email, gender, password, role } = req.body;

  try {
    let hashedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET
    ).toString();

    const newUser = await User.create({
      firstname,
      lastname,
      phone,
      email,
      gender,
      password: hashedPassword,
      role,
    });

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "Failed to create new user",
      });
    }

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function fetchUsers(req, res) {
  let { page, limit, sortBy } = req.query;
  try {
    let allUsers = await User.find();

    if (!allUsers) {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch users",
      });
    }

    // pagination logic
    if (page && limit) {
      page = parseInt(page);
      limit = parseInt(limit);
      page -= 1;
      var totalPage = Math.ceil(allUsers.length / limit);
      if (Array.isArray(allUsers) && page < totalPage) {
        allUsers = allUsers.slice(page * limit, page * limit + limit);
      }
      page += 1;
    }

    // sort by firstname
    if (sortBy) {
      if (Array.isArray(allUsers) && (sortBy == "asc" || sortBy == "desc")) {
        sortBy === "asc"
          ? allUsers.sort((a, b) => (a.firstname < b.firstname ? -1 : 1))
          : allUsers.sort((a, b) => (a.firstname > b.firstname ? -1 : 1));
      } else {
        return res.json({
          success: false,
          message: "Invalid sortBy query value",
        });
      }
    }

    res.status(200).json({
      success: true,
      users: allUsers,
      page: page,
      totalPage: totalPage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function fetchOneUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch a user",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const dataToUpdate = req.body;

    const check = await User.findOne({ _id: id });
    if (!check) {
      return res.json({
        success: false,
        message: "No such user exists!",
      });
    }

    if (dataToUpdate.password) {
      dataToUpdate.password = CryptoJS.AES.encrypt(
        dataToUpdate.password,
        process.env.SECRET
      ).toString();
    }

    const updatedUser = await User.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Failed to update user",
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const check = await User.findOne({ _id: id });
    if (!check) {
      return res.json({
        success: false,
        message: "No such user exists!",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete a user",
      });
    }

    res.status(200).json({
      success: true,
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

function myDetails(req, res) {
  const mydata = req.user;
  res.json({
    user: mydata,
  });
}

module.exports = {
  createUser,
  fetchUsers,
  fetchOneUser,
  updateUser,
  deleteUser,
  myDetails,
};
