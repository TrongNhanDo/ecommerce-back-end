const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

router
  .route("/")
  .get(productsController.getAllProduct)
  .post(productsController.insertNewProduct)
  .patch(productsController.updateProduct)
  .delete(productsController.deleteProduct);

router.route("/search-by-age").get(productsController.getProductByAgeId);
router.route("/search-by-branch").get(productsController.getProductByBranchId);
router.route("/search-by-skill").get(productsController.getProductBySkillId);
router.route("/:productId").get(productsController.getProductById);

module.exports = router;
