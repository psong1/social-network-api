const { User, Thought } = require("../models");

module.exports = {
  // Gets all users
  getAllUsers(req, res) {
    User.find({})
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single user
  getOneUser(req, res) {
    User.findOne({ _id: req.params.id })
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
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, body, {
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
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
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
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
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
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
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
