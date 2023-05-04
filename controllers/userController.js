const { User, Thought } = require("../models");

module.exports = {
  // Gets all users
  getAllUsers(req, res) {
    User.find({})
      .select("-__v")
      .sort({ _id: -1 })
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single user
  getOneUser(req, res) {
    User.findOne({ _id: req.params.id })
      .populate({ path: "thoughts", select: "-__v" })
      .populate({ path: "friends", select: "-__v" })
      .then((userData) => {
        if (!userData) {
          return res
            .status(404)
            .json({ message: "User with this id not found." });
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Create a user
  createUser(req, res) {
    User.create(req.body)
      .then((userData) => res.json(userData))
      .catch((err) => res.json(err));
  },

  // Update user
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      runValidators: true,
      new: true,
    })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "No user found with this id." });
          return;
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((userData) => {
        if (!userData) {
          return res
            .status(404)
            .json({ message: "No user found with this id." });
        }
        return Thought.deleteMany({ _id: { $in: userData.thoughts } });
      })
      .then(() => {
        res.json({ message: "All user data successfully deleted." });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Add friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { runValidators: true, new: true }
    )
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "No user with this id found." });
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Remove friend
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          return req
            .status(404)
            .json({ message: "No user with this id found." });
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },
};
