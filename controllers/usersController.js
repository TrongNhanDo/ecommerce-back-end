const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// @desc get all users
// @route GET /users
// @access private
const getAllUser = asyncHandler(async (req, res) => {
   try {
      const users = await User.find().select("-password").lean();
      if (!users || !users.length) {
         return res.status(400).json({ message: "No users found" });
      }
      return res.json(users);
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Get users list fail" });
   }
});

// @desc create new user
// @route POST /users
// @access private
const createUser = asyncHandler(async (req, res) => {
   try {
      // get params from request's body
      const { username, password, roles } = req.body;
      // confirm data
      if (!username || !password || !Array.isArray(roles) || !roles.length) {
         return res.status(404).json({ message: "All fields are required" });
      }
      // check for duplicate
      const duplicate = await User.findOne({ username }).lean().exec();
      if (duplicate) {
         return res
            .status(409)
            .json({ message: `Username already existed` });
      }
      // hash password
      const hashedPwd = await bcrypt.hash(password, 10);
      const userObject = {
         username,
         password: hashedPwd,
         roles,
      };
      // create and store new user
      const user = await User.create(userObject);
      if (user) {
         // created
         return res.status(201).json({
            message: `New user ${username} has been created`,
         });
      } else {
         return res.status(400).json({
            message: "Invalid user data received",
         });
      }
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Insert new user fail" });
   }
});

// @desc update user
// @route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
   try {
      const { id, username, roles, active, password } = req.body;
      // get user by id
      const user = await User.findById(id).exec();
      if (!user) {
         return res.status(400).json({ message: "User not found" });
      }
      // check for duplicate
      const duplicate = await User.findOne({ username }).lean().exec();
      if (duplicate) {
         return res
            .status(409)
            .json({ message: `Username '${username}' already existed` });
      }
      // confirm update data
      const updateUser = await User.updateOne(
         {
            _id: id,
         },
         {
            username: username || user.username,
            password: password ? await bcrypt.hash(password, 10) : user.password,
            roles: roles || user.roles,
            active: active || user.active,
            updatedAt: new Date(),
         }
      );
      if (updateUser) {
         return res.json({ message: `${user.username} has been updated` });
      } else {
         return res.status(400).json({ message: "Update user fail" });
      }
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Update user fail" });
   }
});

// @desc delete user
// @route DELETE /users
// @access private
const deleteUser = asyncHandler(async (req, res) => {
   try {
      const { id } = req.body;
      if (!id) {
         return res.status(404).json({ message: "User ID is required" });
      }
      const user = await User.findById(id).exec();
      if (!user) {
         return res.status(400).json({ message: "User not found" });
      }
      const result = await user.deleteOne();
      return res.status(201).json({
         message: `Username '${result.username}' has been deleted`,
      });
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Delete user fail" });
   }
});

// get user by id
const getUserById = asyncHandler(async (req, res) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(404).json({ message: "User ID is required" });
      }
      const user = await User.findById(id).exec();
      if (!user) {
         return res.status(400).json({ message: "User not found" });
      }
      return res.status(201).json(user);
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Get user by id fail" });
   }
});

module.exports = {
   getAllUser,
   createUser,
   updateUser,
   deleteUser,
   getUserById,
};
