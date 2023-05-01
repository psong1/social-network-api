// localhost:PORT/api/(route)
const router = require("express").Router();
const {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/userController");

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getOneUser).put(updateUser).delete(deleteUser);

router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;
