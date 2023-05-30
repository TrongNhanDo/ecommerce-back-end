const asyncHandler = require("express-async-handler");
const Skill = require("../models/Skill");

// @desc get all categories
// @route GET /categories
// @access private
const getAllCategory = asyncHandler(async (req, res) => {
   try {
      const categories = await Skill.find().sort({ skillId: 1 }).lean();
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
      const { skillName } = req.body;
      // confirm data
      if (!skillName) {
         return res.status(404).json({ message: "All fields are required" });
      }
      // check for duplicate
      const duplicate = await Skill.findOne({ skillName }).lean().exec();
      if (duplicate) {
         return res
            .status(409)
            .json({ message: `Category '${skillName} already existed'` });
      }
      // get max cateId
      const maxCategory = await Skill.find().sort("-skillId").limit(1);
      const categoryObject = {
         skillId:
            parseInt(maxCategory[0] ? maxCategory[0].skillId || 0 : 0) + 1,
         skillName,
         createdAt: new Date(),
         updatedAt: new Date(),
      };
      // create and store new category
      const category = await Skill.create(categoryObject);
      if (category) {
         // created
         return res.status(201).json({
            message: `New category ${skillName} has been created`,
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
      const { skillId, skillName } = req.body;
      // get user by id
      const category = await Skill.findOne({ skillId }).lean().exec();
      if (!category) {
         return res.status(400).json({ message: "Category not found" });
      }
      // check for duplicate
      const duplicate = await Skill.findOne({ skillName }).lean().exec();
      if (duplicate) {
         return res
            .status(409)
            .json({ message: `Category '${skillName}' already existed` });
      }
      // confirm update data
      const updateCategory = await Skill.updateOne(
         {
            skillId,
         },
         {
            skillName,
            updatedAt: new Date(),
         }
      );
      if (updateCategory) {
         return res.json({ message: `Category has been updated` });
      } else {
         return res.status(400).json({ message: "Update category fail" });
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
      const { skillId } = req.body;
      if (!skillId) {
         return res.status(404).json({ message: "Category ID is required" });
      }

      const category = await Skill.findOne({ skillId }).exec();
      if (!category) {
         return res.status(400).json({ message: "Category not found" });
      }
      const result = await category.deleteOne();
      return res.status(201).json({
         message: `Category ${result.skillName} with ID ${result.skillId} has been deleted`,
      });
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Delete category fail" });
   }
});

// get user by id
const getCategoryById = asyncHandler(async (req, res) => {
   try {
      const { skillId } = req.params;
      if (!skillId) {
         return res.status(404).json({ message: "Category ID is required" });
      }
      const category = await Skill.findOne({ skillId }).exec();
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
