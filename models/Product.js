const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
   {
      ageId: {
         type: Number,
         require: true,
      },
      branchId: {
         type: Number,
         require: true,
      },
      skillId: {
         type: Number,
         require: true,
      },
      productName: {
         type: String,
         require: true,
      },
      price: {
         type: String,
         require: true,
      },
      describes: {
         type: String,
      },
      amount: {
         type: Number,
         require: true,
      },
      rate: {
         type: Number,
         default: 0,
      },
      image1: {
         type: String,
         require: true,
      },
      image2: {
         type: String,
      },
      image3: {
         type: String,
      },
      image4: {
         type: String,
      },
      image5: {
         type: String,
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("product", productSchema);
