const asyncHandler = require("express-async-handler");
const Age = require("../models/Age");

// @desc get all categories
// @route GET /categories
// @access private
const getAllCategory = asyncHandler(async (req, res) => {
   try {
      const categories = await Age.find().sort({ ageId: 1 }).lean();
      if (!categories || !categories.length) {
         return res.status(400).json({ message: "No category found" });
      }
      return res.json(categories);
   } catch (error) {
      return res.status(400).json({ message: "Get categories list fail" });
   }
});

// @desc create new category
// @route POST /categories
// @access private
const createCategory = asyncHandler(async (req, res) => {
   try {
      const { ageId, ageName } = req.body;
      // confirm data
      if (!ageId || ageId === "0" || !ageName) {
         return res.status(404).json({ message: "All fields are required" });
      }
      // check for duplicate
      const duplicate = await Age.find({
         $or: [{ ageId: ageId }, { ageName: ageName }],
      })
         .lean()
         .exec();

      if (duplicate && duplicate.length) {
         const arrayError = [];
         if (duplicate.some((value) => value.ageId == ageId)) {
            arrayError.push("ageId");
         }
         if (duplicate.some((value) => value.ageName === ageName)) {
            arrayError.push("ageName");
         }
         return res
            .status(409)
            .json({ message: `${arrayError.join(", ")} already existed` });
      }
      // confirm data
      const categoryObject = {
         ageId,
         ageName,
         createdAt: new Date(),
         updatedAt: new Date(),
      };
      // create and store new category
      const category = await Age.create(categoryObject);
      if (category) {
         // created
         return res.status(201).json({
            message: `New category ${ageName} has been created`,
         });
      }
      return res.status(400).json({
         message: "Invalid category data received",
      });
   } catch (error) {
      return res.status(400).json({ message: "Insert new category fail" });
   }
});

// @desc update category
// @route PATCH /categories
// @access private
const updateCategory = asyncHandler(async (req, res) => {
   try {
      const { id, ageName } = req.body;
      // get user by id
      const category = await Age.findById(id).lean().exec();
      if (!category) {
         return res.status(400).json({ message: "Category not found" });
      }
      // check for duplicate
      const duplicate = await Age.findOne({ ageName }).lean().exec();
      if (duplicate && duplicate._id !== category._id) {
         return res
            .status(409)
            .json({ message: `Category name already existed` });
      }
      // confirm update data
      const updateCategory = await Age.updateOne(
         {
            _id: id,
         },
         {
            ageName,
            updatedAt: new Date(),
         }
      );
      if (updateCategory) {
         return res.json({ message: `Category has been updated` });
      }
      return res.json({ message: "Update category fail" });
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
      const { ageId } = req.body;
      if (!ageId) {
         return res.status(404).json({ message: "Category ID is required" });
      }
      const category = await Age.findById(ageId).exec();
      if (!category) {
         return res.status(400).json({ message: "Category not found" });
      }
      const result = await category.deleteOne();
      return res.status(201).json({
         message: `Category ${result.ageName} with ID ${result.ageId} has been deleted`,
      });
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Delete category fail" });
   }
});

// get user by id
const getCategoryById = asyncHandler(async (req, res) => {
   try {
      const { ageId } = req.params;
      if (!ageId) {
         return res.status(404).json({ message: "Category ID is required" });
      }
      const category = await Age.findById(ageId).exec();
      if (!category) {
         return res.status(400).json({ message: "Category not found" });
      }
      return res.status(201).json(category);
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Get category by id fail" });
   }
});

const getAgePaginate = asyncHandler(async (req, res) => {
   try {
      const { perPage, page } = req.body;
      const ages = await Age.find()
         .sort({ ageId: 1 })
         .skip(perPage * (page || 1) - perPage)
         .limit(perPage)
         .exec();
      if (!ages || !ages.length) {
         return res.status(400).json({ message: "No ages found" });
      }
      return res.json(ages);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getAllCategory,
   createCategory,
   updateCategory,
   deleteCategory,
   getCategoryById,
   getAgePaginate,
};
