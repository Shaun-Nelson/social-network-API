const User = require("../models/User");
const Thought = require("../models/Thought");

//Helper function for 404s
const checkUserExists = (user) => {
  if (!user) {
    return res.status(404).json({ message: "No user with that ID" });
  } else {
    return;
  }
};

//Users CRUD

//Read
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-__v")
      .populate("friends")
      .populate("thoughts");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
      .select("-__v")
      .populate("friends")
      .populate("thoughts");

    checkUserExists(user);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Create
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Update
const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    checkUserExists(user);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Delete
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });

    checkUserExists(user);

    //Remove a user's associated thoughts when deleted.
    await Thought.deleteMany({ username: user.username });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Friends CRUD

//Create
const createFriend = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    checkUserExists(user);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Delete
const deleteFriend = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    checkUserExists(user);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  createFriend,
  deleteFriend,
};
