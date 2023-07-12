const Thought = require("../models/Thought");
const User = require("../models/User");

//Helper function for 404s
const checkThoughtExists = (thought) => {
  if (!thought) {
    return res.status(404).json({ message: "No thought with that ID" });
  } else {
    return;
  }
};

//Thoughts CRUD

//Read
const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find().select("-__v");

    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOneThought = async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.id });

    checkThoughtExists(thought);

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Create
const createThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body);

    //Add created thought to user's thoughts array field
    await User.findOneAndUpdate(
      { username: thought.username },
      { $push: { thoughts: thought._id } },
      { runValidators: true, new: true }
    );

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Update
const updateThought = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    checkThoughtExists(thought);

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Delete
const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.id });

    checkThoughtExists(thought);

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Reactions CRUD

//Create
const createReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    checkThoughtExists(thought);

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Delete
const deleteReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );

    checkThoughtExists(thought);

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getThoughts,
  getOneThought,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
};
