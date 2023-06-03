const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router
   .route("/")
   .get(usersController.getAllUser)
   .post(usersController.createUser)
   .patch(usersController.updateUser)
   .delete(usersController.deleteUser);

router.route("/login").post(usersController.loginUser);
router.route("/sort").post(usersController.getSortedData);
router.route("/:id").get(usersController.getUserById);

module.exports = router;
