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
         require: true,
      },
      image3: {
         type: String,
         require: true,
      },
      image4: {
         type: String,
         require: true,
      },
      image5: {
         type: String,
         require: true,
      },
   },
   {
      timestamps: true,
   }
);

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

// age Model
productSchema.virtual("age", {
   ref: "age",
   localField: "ageId",
   foreignField: "ageId",
   justOne: true,
});
// branch Model
productSchema.virtual("branch", {
   ref: "branch",
   localField: "branchId",
   foreignField: "branchId",
   justOne: true,
});
// skill Model
productSchema.virtual("skill", {
   ref: "skill",
   localField: "skillId",
   foreignField: "skillId",
   justOne: true,
});

module.exports = mongoose.model("product", productSchema);
