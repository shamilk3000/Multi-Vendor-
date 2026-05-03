const productService = require("../Service/productService");
const { createMulterUpload } = require("../Utils/multerUtil");
const sellerProductUpload = createMulterUpload("Seller/ProductImages");

const createProduct = (req, res) => {
  sellerProductUpload.fields([{ name: "productImages", maxCount: 4 }])(
    req,
    res,
    async (err) => {
      try {
        if (err)
          return res
            .status(400)
            .json({ message: "File upload failed", error: err.message });
        const product = await productService.createProduct(req);
        return res.status(201).json(product);
      } catch (error) {
        console.error("createProduct Controller Error:", error);
        return res.status(400).json({ message: error.message });
      }
    }
  );
};

const updateProduct = (req, res) => {
  sellerProductUpload.fields([{ name: "productImages", maxCount: 5 }])(
    req,
    res,
    async (err) => {
      try {
        if (err)
          return res
            .status(400)
            .json({ message: "File upload failed", error: err.message });
        const product = await productService.updateProduct(req);
        return res.status(200).json(product);
      } catch (error) {
        console.error("updateProduct Controller Error:", error);
        return res.status(400).json({ message: error.message });
      }
    }
  );
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productService.getProductById(productId);
    return res.status(200).json(product);
  } catch (error) {
    console.error("getProductById Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productService.deleteProduct(productId);
    return res.status(200).json(product);
  } catch (error) {
    console.error("deleteProduct Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const restoreProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productService.restoreProduct(productId);
    return res.status(200).json(product);
  } catch (error) {
    console.error("restoreProduct Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const getProductBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await productService.getAllProductsBySeller(sellerId);
    return res.status(200).json(products);
  } catch (error) {
    console.error("getProductBySellerId Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const getProductForSeller = async (req, res) => {
  try {
    const seller = req.seller;
    const products = await productService.getAllProductsBySeller(seller._id);
    return res.status(200).json(products);
  } catch (error) {
    console.error("getProductForSeller Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error("getAllProducts Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { sellerId, search } = req.params;
    const products = await productService.searchProducts(search, sellerId);
    return res.status(200).json(products);
  } catch (error) {
    console.error("searchProducts Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const getAllProductsForCustomer = async (req, res) => {
  try { 
    const { sellerId } = req.params;
    const products = await productService.getAllProductsForCustomer(sellerId);
    return res.status(200).json(products);
  } catch (error) {
    console.error("getAllProductsForCustomer Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const seller = req.seller;
    const category = await productService.createCategory(req.body, seller);
    return res.status(200).json(category);
  } catch (error) {
    console.error("createOrGetCategory Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// const getAllParentCategories = async (req, res) => {
//   try {
//     const seller = req.seller;
//     const categories = await productService.getAllParentCategories(seller._id);
//     return res.status(200).json(categories);
//   } catch (error) {
//     console.error("getAllParentCategories Controller Error:", error);
//     return res.status(400).json({ message: error.message });
//   }
// };

const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await productService.updateCategory(categoryId, req.body);
    return res.status(200).json(category);
  } catch (error) {
    console.error("updateCategory Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await productService.getCategoryById(categoryId);
    return res.status(200).json(category);
  } catch (error) {
    console.error("getCategoryById Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const getAllCategoriesOfSeller = async (req, res) => {
  try {
    const sellerId = req?.user?.sellerId || req?.seller?._id;
    const { onlyActive } = req.query;
    const categories = await productService.getAllCategoriesOfSeller(sellerId , onlyActive);
    return res.status(200).json(categories);
  } catch (error) {
    console.error("getAllCategoriesOfSeller Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};


const getAllCategoriesOfSellerForUser = async (req, res) => {
  try {
    const sellerId = req?.user?.sellerId || req.params.sellerId;
    console.log(sellerId);
    const categories = await productService.getAllCategoriesOfSellerForUser(sellerId);
    return res.status(200).json(categories);
  } catch (error) {
    console.error("getAllCategoriesOfSeller Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await productService.deleteCategory(categoryId);
    return res.status(200).json(category);
  } catch (error) {
    console.error("deleteCategory Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const restoreCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await productService.restoreCategory(categoryId);
    return res.status(200).json(category);
  } catch (error) {
    console.error("restoreCategory Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const addRating = async (req, res) => {
  try {
    const reviewData = req.body;
    const user = req.user;
    const rating = await productService.addRating(reviewData, user);
    return res.status(200).json(rating);
  } catch (error) {
    console.error("addRating Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { 
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  getProductBySellerId,
  getProductById,
  getProductForSeller,
  getAllProducts,
  searchProducts,
  getAllProductsForCustomer,
  createCategory,
  updateCategory,
  getCategoryById,
  getAllCategoriesOfSellerForUser,
  // getAllParentCategories,
  getAllCategoriesOfSeller,
  deleteCategory,
  restoreCategory,
  addRating,
};
