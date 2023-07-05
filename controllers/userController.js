const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("friends").populate("thoughts");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
      .populate("friends")
      .populate("thoughts");

    if (!user) {
      return res.status(404).json({ message: "No user with that ID" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user with that ID" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    //Remove a user's associated thoughts when deleted.
    await Thought.deleteMany({ username: user.username });

    if (!user) {
      return res.status(404).json({ message: "No user with that ID" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

const createFriend = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user with that ID" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteFriend = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user with that ID" });
    }

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
