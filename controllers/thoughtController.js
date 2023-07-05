const Thought = require("../models/Thought");
const User = require("../models/User");

const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOneThought = async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.id });

    if (!thought) {
      return res.status(404).json({ message: "No thought with that ID" });
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

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

const updateThought = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "No thought with that ID" });
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

const createReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "No thought with that ID" });
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "No thought with that ID" });
    }
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