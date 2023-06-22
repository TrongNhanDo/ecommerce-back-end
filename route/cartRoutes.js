const express = require("express");
const router = express.Router();
const cartsController = require("../controllers/cartsController");

router
   .route("/")
   .get(cartsController.getCartList)
   .post(cartsController.handleCart);

module.exports = router;
