const express = require("express");
const router = express.Router();
const cartsController = require("../controllers/cartsController");

router
   .route("/")
   .get(cartsController.getCartList)
   .post(cartsController.handleCart);

router.route("/get-by-userId/").post(cartsController.getCartListByUserId);

module.exports = router;
