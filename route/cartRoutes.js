const express = require("express");
const router = express.Router();
const cartsController = require("../controllers/cartsController");

router
   .route("/")
   .get(cartsController.getCartList)
   .post(cartsController.handleCart)
   .delete(cartsController.deleteCart);

router.route("/get-by-userId/").post(cartsController.getCartListByUserId);

module.exports = router;
