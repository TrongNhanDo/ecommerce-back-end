const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// get all products
const getAllProduct = asyncHandler(async (req, res) => {
   const products = await Product.find()
      .populate(["age", "branch", "skill"])
      .lean();
   if (!products || !products.length) {
      return res.json({ message: "No product found" });
   }
   return res.json(products);
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
         image1,
         image2,
         image3,
         image4,
         image5,
      } = req.body;
      const inputArray = [
         ageId,
         branchId,
         skillId,
         productName,
         price,
         amount,
         image1,
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
         ageId,
         branchId,
         skillId,
         productName,
         price,
         describes,
         amount,
         image1,
         image2: image2 || "",
         image3: image3 || "",
         image4: image4 || "",
         image5: image5 || "",
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
      console.log(error);
      return res.status(400).json({ message: "Insert new product fail" });
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
         image1,
         image2,
         image3,
         image4,
         image5,
      } = req.body;
      const inputArray = [
         productId,
         ageId,
         branchId,
         skillId,
         productName,
         price,
         amount,
         image1,
      ];
      // get user by id
      if (inputArray.some((value) => !value || value === "")) {
         return res.status(404).json({ message: "All fields are required" });
      }
      const product = await Product.findById(productId).exec();
      if (!product) {
         return res.status(400).json({ message: "Product not found" });
      }
      // check for duplicate
      const duplicate = await Product.findOne({ productName }).lean().exec();
      if (duplicate) {
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
            ageId,
            branchId,
            skillId,
            productName,
            price,
            describes,
            amount,
            image1,
            image2: image2 || "",
            image3: image3 || "",
            image4: image4 || "",
            image5: image5 || "",
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
      console.log(error);
      return res.status(400).json({ message: "Update product fail" });
   }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
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
});

// get product by id
const getProductById = asyncHandler(async (req, res) => {
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
});

// get product by category id
const getProductByAgeId = asyncHandler(async (req, res) => {
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
});

// get product by branch id
const getProductByBranchId = asyncHandler(async (req, res) => {
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
});

// get product by branch id
const getProductBySkillId = asyncHandler(async (req, res) => {
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
});

const getProductPaginate = asyncHandler(async (req, res) => {
   const { perPage, page } = req.body;
   const products = await Product.find()
      .sort({ createdAt: 1 })
      .populate(["age", "branch", "skill"])
      .skip(perPage * (page || 1) - perPage)
      .limit(perPage)
      .exec();
   if (!products || !products.length) {
      return res.json({ message: "No product found" });
   }
   return res.json(products);
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
};
