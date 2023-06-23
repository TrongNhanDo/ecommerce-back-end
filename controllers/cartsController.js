const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");

const getCartList = asyncHandler(async (req, res) => {
   try {
      const cartList = await Cart.find()
         .populate(["product", "user"])
         .sort({ createdAt: 1 })
         .lean();
      if (!cartList || !cartList.length) {
         return res.status(400).json({ message: "No cart found" });
      }
      return res.json(cartList);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getCartListByUserId = asyncHandler(async (req, res) => {
   try {
      const { userId } = req.body;
      const cartList = await Cart.find({ userId: userId })
         .populate([
            {
               path: "product",
               populate: [
                  { path: "branch" },
                  { path: "age" },
                  { path: "skill" },
               ],
            },
            {
               path: "user",
               populate: { path: "role" },
            },
         ])
         .sort({ createdAt: 1 })
         .lean();

      console.log({ cartList });
      if (!cartList || !cartList.length) {
         return res.status(400).json({ message: "No cart found" });
      }
      return res.json(cartList);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const handleCart = asyncHandler(async (req, res) => {
   try {
      const { userId, productId, price, amount } = req.body;
      // confirm data
      if (!userId || !productId || !price || !amount) {
         return res.status(404).json({ message: "All fields are required" });
      }
      // check for duplicate
      const duplicate = await Cart.findOne({
         userId: userId,
         productId: productId,
      })
         .lean()
         .exec();
      if (duplicate) {
         const newAmount = parseFloat(duplicate.amount) + parseFloat(amount);
         const updateCart = await Cart.updateOne(
            {
               userId: userId,
               productId: productId,
            },
            {
               amount: newAmount,
               price: price,
               total: newAmount * price,
               updatedAt: new Date(),
            }
         );
         if (updateCart) {
            return res.json({ message: `Cart has been updated` });
         }
         return res.json({ message: "Update Cart fail" });
      } else {
         const cartObject = {
            userId: userId,
            productId: productId,
            amount: amount,
            price: price,
            total: amount * price,
            createdAt: new Date(),
            updatedAt: new Date(),
         };
         const result = await Cart.create(cartObject);
         if (result) {
            return res.status(201).json({
               message: `New product has been added`,
            });
         }
         return res.status(400).json({
            message: "Invalid data received",
         });
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getCartList,
   handleCart,
   getCartListByUserId,
};
