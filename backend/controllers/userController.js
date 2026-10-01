const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name username email profileImage")
      .sort({ name: 1 });

    res.json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUsers,
};