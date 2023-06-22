const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
   {
      userId: {
         type: String,
         require: true,
      },
      productId: {
         type: String,
         require: true,
      },
      price: {
         type: String,
         required: true,
      },
      amount: {
         type: Number,
         require: true,
      },
      total: {
         type: String,
         default: 0,
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("cart", cardSchema);
