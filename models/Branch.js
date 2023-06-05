const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
   {
      branchId: {
         type: Number,
         require: true,
      },
      branchName: {
         type: String,
         require: true,
      },
      establish: {
         type: Date,
         require: true,
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("branch", branchSchema);
