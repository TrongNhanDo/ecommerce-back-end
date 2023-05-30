const asyncHandler = require("express-async-handler");
const Branch = require("../models/Branch");

// @desc get all categories
// @route GET /categories
// @access private
const getAllCategory = asyncHandler(async (req, res) => {
   try {
      const categories = await Branch.find().sort({ branchId: 1 }).lean();
      if (!categories || !categories.length) {
         return res.status(400).json({ message: "No category found" });
      }
      return res.json(categories);
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Get categories list fail" });
   }
});

// @desc create new category
// @route POST /categories
// @access private
const createCategory = asyncHandler(async (req, res) => {
   try {
      const { branchName } = req.body;
      // confirm data
      if (!branchName) {
         return res.status(404).json({ message: "All fields are required" });
      }
      // check for duplicate
      const duplicate = await Branch.findOne({ branchName }).lean().exec();
      if (duplicate) {
         return res
            .status(409)
            .json({ message: `Category '${branchName} already existed'` });
      }
      // get max cateId
      const maxCategory = await Branch.find().sort("-branchId").limit(1);
      const categoryObject = {
         branchId:
            parseInt(maxCategory[0] ? maxCategory[0].branchId || 0 : 0) + 1,
         branchName,
         createdAt: new Date(),
         updatedAt: new Date(),
      };
      // create and store new category
      const category = await Branch.create(categoryObject);
      if (category) {
         // created
         return res.status(201).json({
            message: `New category ${branchName} has been created`,
         });
      } else {
         return res.status(400).json({
            message: "Invalid category data received",
         });
      }
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Insert new category fail" });
   }
});

// @desc update category
// @route PATCH /categories
// @access private
const updateCategory = asyncHandler(async (req, res) => {
   try {
      const { id, branchId, branchName } = req.body;
      // get category by id
      const category = await Branch.findById(id).lean().exec();
      if (!category) {
         return res.status(400).json({ message: "Category not found" });
      }
      // check for duplicate
      const duplicate = await Branch.findOne({ branchId }).lean().exec();
      if (duplicate) {
         return res
            .status(409)
            .json({ message: `Category ID '${branchId}' already existed` });
      }
      // confirm update data
      const updateCategory = await Branch.updateOne(
         {
            _id: id,
         },
         {
            branchId,
            branchName,
            updatedAt: new Date(),
         }
      );
      if (updateCategory) {
         return res.json({ message: `Category has been updated` });
      } else {
         return res.json({ message: "Update category fail" });
      }
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Update category fail" });
   }
});

// @desc delete user
// @route DELETE /categories
// @access private
const deleteCategory = asyncHandler(async (req, res) => {
   try {
      const { id } = req.body;
      if (!id) {
         return res.status(404).json({ message: "Category ID is required" });
      }

      const category = await Branch.findById(id).exec();
      if (!category) {
         return res.status(400).json({ message: "Category not found" });
      }
      const result = await category.deleteOne();
      return res.status(201).json({
         message: `Category ${result.branchName} with ID ${result.branchId} has been deleted`,
      });
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Delete category fail" });
   }
});

// get user by id
const getCategoryById = asyncHandler(async (req, res) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(404).json({ message: "Category ID is required" });
      }
      const category = await Branch.findById(id).exec();
      if (!category) {
         return res.status(400).json({ message: "Category not found" });
      }
      return res.status(201).json(category);
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Get category by id fail" });
   }
});

module.exports = {
   getAllCategory,
   createCategory,
   updateCategory,
   deleteCategory,
   getCategoryById,
};
