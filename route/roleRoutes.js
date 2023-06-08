const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/rolesController");

router
   .route("/")
   .get(rolesController.getAllRoles)
   .post(rolesController.createRole)
   .patch(rolesController.updateRole)
   .delete(rolesController.deleteRole);

router.route("/paginate").post(rolesController.getRolePaginate);
router.route("/:id").get(rolesController.getRoleById);

module.exports = router;
