const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// get all products
const getAllProduct = asyncHandler(async (req, res) => {
   try {
      const products = await Product.find()
         .populate(["age", "branch", "skill"])
         .sort({ createdAt: 1 })
         .lean();
      if (!products || !products.length) {
         return res.json({ message: "No product found" });
      }
      return res.json(products);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// insert product
const insertNewProduct = asyncHandler(async (req, res) => {
   try {
      // get params from request's body
      const {
         ageId,
         branchId,
         skillId,
         productName,
         price,
         describes,
         amount,
         images,
      } = req.body;
      const inputArray = [
         ageId,
         branchId,
         skillId,
         productName,
         price,
         describes,
         amount,
         images,
      ];
      // confirm data
      if (inputArray.some((value) => !value || value === "")) {
         return res.status(404).json({ message: "All fields are required" });
      }
      // check for duplicate
      const duplicate = await Product.findOne({ productName }).lean().exec();
      if (duplicate) {
         return res
            .status(409)
            .json({ message: `Product '${productName}' already existed` });
      }
      // hash password
      const userObject = {
         ageId: ageId,
         branchId: branchId,
         skillId: skillId,
         productName: productName,
         price: price,
         describes: describes,
         amount: amount,
         images: images,
      };
      // create and store new user
      const product = await Product.create(userObject);
      if (product) {
         // created
         return res.status(201).json({
            message: `New product '${productName}' has been created`,
         });
      } else {
         return res.status(400).json({
            message: "Invalid product data received",
         });
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// insert product
const updateProduct = asyncHandler(async (req, res) => {
   try {
      const {
         productId,
         ageId,
         branchId,
         skillId,
         productName,
         price,
         describes,
         amount,
         images,
      } = req.body;
      const inputArray = [
         productId,
         ageId,
         branchId,
         skillId,
         productName,
         price,
         describes,
         amount,
         images,
      ];
      const product = await Product.findById(productId).exec();
      if (!product) {
         return res.status(400).json({ message: "Product not found" });
      }
      // get user by id
      if (inputArray.some((value) => !value || value === "")) {
         return res.status(404).json({ message: "All fields are required" });
      }
      // check for duplicate
      const duplicate = await Product.findOne({ productName }).lean().exec();
      if (duplicate && product._id.toString() !== duplicate._id.toString()) {
         return res.status(409).json({
            message: `Product's name '${productName}' already existed`,
         });
      }
      // confirm update data
      const updateProduct = await Product.updateOne(
         {
            _id: productId,
         },
         {
            ageId: ageId,
            branchId: branchId,
            skillId: skillId,
            productName: productName,
            price: price,
            describes: describes,
            amount: amount,
            images: images,
         }
      );
      if (updateProduct) {
         return res.json({
            message: `${product.productName} has been updated`,
         });
      } else {
         return res.status(400).json({ message: "Update product fail" });
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
   try {
      const { productId } = req.body;
      if (!productId) {
         return res.status(404).json({ message: "Product ID is required" });
      }
      const product = await Product.findById(productId).exec();
      if (!product) {
         return res.status(400).json({ message: "User not found" });
      }
      const result = await product.deleteOne();
      return res.status(201).json({
         message: `Product '${result.productName}' has been deleted`,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// get product by id
const getProductById = asyncHandler(async (req, res) => {
   try {
      const { productId } = req.params;
      if (!productId) {
         return res.status(404).json({ message: "Product ID is required" });
      }
      const product = await Product.findById(productId)
         .populate(["age", "branch", "skill"])
         .exec();
      if (!product) {
         return res.status(400).json({ message: "Product not found" });
      }
      return res.status(201).json(product);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// get product by category id
const getProductByAgeId = asyncHandler(async (req, res) => {
   try {
      const { ageId } = req.query;
      if (!ageId) {
         return res.status(404).json({ message: "Age ID is required" });
      }
      const product = await Product.find({ ageId })
         .populate(["age", "branch", "skill"])
         .exec();
      if (!product || !product.length) {
         return res.status(400).json({ message: "Product not found" });
      }
      return res.status(201).json(product);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// get product by branch id
const getProductByBranchId = asyncHandler(async (req, res) => {
   try {
      const { branchId } = req.query;
      if (!branchId) {
         return res.status(404).json({ message: "Branch ID is required" });
      }
      const product = await Product.find({ branchId })
         .populate(["age", "branch", "skill"])
         .exec();
      if (!product || !product.length) {
         return res.status(400).json({ message: "Product not found" });
      }
      return res.status(201).json(product);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// get product by branch id
const getProductBySkillId = asyncHandler(async (req, res) => {
   try {
      const { skillId } = req.query;
      if (!skillId) {
         return res.status(404).json({ message: "Skill ID is required" });
      }
      const product = await Product.find({ skillId })
         .populate(["age", "branch", "skill"])
         .exec();
      if (!product || !product.length) {
         return res.status(400).json({ message: "Product not found" });
      }
      return res.status(201).json(product);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getProductPaginate = asyncHandler(async (req, res) => {
   try {
      const { perPage, page } = req.body;
      const products = await Product.find()
         .sort({ createdAt: 1 })
         .populate(["age", "branch", "skill"])
         .skip(perPage * (page || 1) - perPage)
         .limit(perPage)
         .exec();
      const count = (await Product.find().exec()).length;
      if (!products || !products.length) {
         return res.json({ message: "No product found" });
      }
      return res.json({
         count: count || 0,
         returnCnt: products.length || 0,
         totalPage: Math.ceil(count / perPage) || 0,
         products,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const insertManyDocuments = asyncHandler(async (req, res) => {
   try {
      const { documents } = req.body;
      if (!documents || !documents.length) {
         return res.status(404).json({ message: "List document is required" });
      }
      const options = { ordered: true };
      const result = await Product.insertMany(documents, options);
      return res.status(201).json({
         message: `${result.length} documents were inserted`,
         data: result,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getAllProduct,
   insertNewProduct,
   updateProduct,
   deleteProduct,
   getProductById,
   getProductByAgeId,
   getProductByBranchId,
   getProductBySkillId,
   getProductPaginate,
   insertManyDocuments,
};
