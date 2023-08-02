const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

const getOrdersList = asyncHandler(async (req, res) => {
   try {
      const ordersList = await Order.find().sort({ createdAt: 1 }).lean();
      if (ordersList && ordersList.length) {
         return res.json(ordersList);
      }
      return res.json({ message: 'The order list is empty!' });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getOrdersList,
};
