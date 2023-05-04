const { Thought, User } = require("../models");
const { rawListeners } = require("../models/User");

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this id." });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Create a thought
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({
            message: "Thought created but user not found with this id.",
          });
          return;
        }
        res.json({ message: "Thought successfully created." });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Update thought by id
  updateThought({ params, body }, res) {
    Thought.findByIdAndUpdate(
      { _id: params.id },
      { $set: body },
      { runValidators: true, new: true }
    )
      .then((thoughtData) => {
        if (!thoughtData) {
          return res
            .status(404)
            .json({ message: "Thought with this id not found." });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Delete thought by id
  deleteThought({ params }, res) {
    Thought.findOneAndRemove({ _id: params.id })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No thought found with this id." });
        }
        User.findOneAndUpdate(
          { _id: params.id },
          { $pull: { thoughts: params.id } },
          { new: true }
        );
      })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({
            message: "Thought deleted but no user found with this id.",
          });
        }
        res.json({ message: "Thought successfully deleted." });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Add a reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { runValidators: true, new: true }
    )
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No thought with this id." });
          return;
        }
        res.json(thoughtData);
      })
      .catch((err) => res.json(err));
  },

  // Delete a reaction
  removeReaction({ params }, res) {
    Thought.findByIdAndRemove(
      { _id: params.thoughtId },
      { $pull: { reaction: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.json(err));
  },
};
