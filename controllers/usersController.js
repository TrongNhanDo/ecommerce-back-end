const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc get all users
// @route GET /users
// @access private
const getAllUser = asyncHandler(async (req, res) => {
   try {
      const users = await User.find()
         .sort({ createdAt: 1 })
         .select("-password")
         .lean();
      if (!users || !users.length) {
         return res.status(400).json({ message: "No users found" });
      }
      return res.json(users);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// login
const loginUser = asyncHandler(async (req, res) => {
   try {
      const { username, password } = req.body;
      if (!username || !password) {
         return res
            .status(400)
            .json({ message: "Username and password are required" });
      }
      const user = await User.findOne({ username, password })
         .select("-password")
         .exec();
      if (!user) {
         return res
            .status(401)
            .json({ message: "Username or password incorrect" });
      } else {
         return res.status(200).json(user);
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// @desc create new user
// @route POST /users
// @access private
const createUser = asyncHandler(async (req, res) => {
   try {
      // get params from request's body
      const { username, password, role, active } = req.body;
      // confirm data
      if (!username && !password) {
         return res.status(404).json({ message: "All fields are required" });
      }
      // check for duplicate
      const duplicate = await User.findOne({ username }).lean().exec();
      if (duplicate) {
         return res.status(409).json({ message: `Username already existed` });
      }
      const userObject = {
         username,
         password,
         role: role || 1,
         active:
            active !== undefined && typeof active === Boolean ? active : true,
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
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// @desc update user
// @route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
   try {
      const { id, username, role, active, password } = req.body;
      if (!id || id === "" || id === undefined) {
         return res.status(400).json({ message: "User Id not found" });
      }
      // get user by id
      const user = await User.findById(id).exec();
      if (!user) {
         return res.status(400).json({ message: "User not found" });
      }
      // check for duplicate
      if (username && username !== "" && username !== user.username) {
         const duplicate = await User.findOne({ username }).lean().exec();
         if (duplicate) {
            return res
               .status(409)
               .json({ message: `Username '${username}' already existed` });
         }
      }
      // confirm update data
      const updateUser = await User.updateOne(
         {
            _id: id,
         },
         {
            username: username || user.username,
            password: password || user.password,
            role: role || user.role,
            active: active || user.active,
            updatedAt: new Date(),
         }
      );
      if (updateUser) {
         return res
            .status(201)
            .json({ updateUser, message: "Account has been updated" });
      } else {
         return res.status(400).json({ message: "Update user fail" });
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
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
      return res.status(400).json({ error, message: "Server's error" });
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
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getSortedData = asyncHandler(async (req, res) => {
   try {
      const { column, condition } = req.body;
      const sortOptions = {
         [column]: condition,
      };
      const users = await User.find()
         .sort(sortOptions)
         .select("-password")
         .lean();
      if (!users || !users.length) {
         return res.status(400).json({ message: "No users found" });
      }
      return res.json(users);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getAllUser,
   createUser,
   updateUser,
   deleteUser,
   getUserById,
   loginUser,
   getSortedData,
};
