const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// register user

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.json({
        error: { message: "Email Already in use.", status: 500 },
      });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const saveUser = await newUser.save();
    const userData = {
      name: saveUser?.name,
      email: saveUser?.email,
      picture: saveUser?.picture,
      _id: saveUser?._id,
    };
    return res.json({ user: userData, status: 200 });
  } catch (error) {
    return res.json({ error: { message: error.message, status: 500 } });
  }
};

// login user

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: { message: "User Does not exist.", status: 401 },
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({
        error: { message: "Invalid credentials", status: 401 },
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const userData = {
      name: user?.name,
      email: user?.email,
      picture: user?.picture,
      _id: user?._id,
      picture: user?.picture,
      address: user?.address,
      state: user?.state,
      isAdmin: user?.isAdmin,
      isActive: user?.isActive,
    };
    return res.json({ token, userData, status: 200 });
  } catch (error) {
    return res.json({ error: { message: error.message, status: 500 } });
  }
};
// update user

exports.update = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Iterate through keys in updateData and update corresponding fields in user
    Object.keys(updateData).forEach((key) => {
      if (user[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    // Save the updated user
    await user.save();

    res.json({ message: "User updated successfully", user, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// get user by id

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId, "-password -createdAt -updatedAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all  user

exports.getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find({}, "-password -createdAt -updatedAt");

    const usersData = allUsers.map((user) => ({
      name: user?.name,
      email: user?.email,
      picture: user?.picture,
      _id: user?._id,
      picture: user?.picture,
      address: user?.address,
      state: user?.state,
      isAdmin: user?.isAdmin,
      isActive: user?.isActive,
    }));

    return res.json({ users: usersData, status: 200 });
  } catch (error) {
    return res.json({ error: { message: error.message, status: 500 } });
  }
};
