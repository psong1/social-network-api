const { Thought, User } = require("../models");

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find({})
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.id })
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
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({
            message: "Thought created but user not found with this id.",
          });
        }
        res.json({ message: "Thought successfully created." });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Update thought by id
  updateThought(req, res) {
    Thought.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
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
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.id })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No thought found with this id." });
        }
        User.findOneAndUpdate(
          { thoughts: req.params.id },
          { $pull: { thoughts: req.params.id } },
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
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { reactions: body } },
      { runValidators: true, new: true }
    )
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
  removeReaction(req, res) {
    Thought.findByIdAndRemove(
      { _id: req.params.id },
      { $pull: { reaction: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.json(err));
  },
};
