const Product = require("../Models/productModel");
const Category = require("../Models/categoryModel");
const Seller = require("../Models/sellerModel");
const Review = require("../Models/reviewModel");
const { deleteFiles } = require("../Utils/multerUtil");
const mongoose = require("mongoose");
const size = 10; // Default page size for pagination

const calculateDiscountPercentage = (mrpPrice, sellingPrice) => {
  if (mrpPrice <= 0) {
    throw new Error("MRP price must be greater than zero");
  }
  if (mrpPrice < sellingPrice) {
    throw new Error("Selling price cannot be greater than MRP price");
  }
  if (sellingPrice < 0) {
    throw new Error("Selling price cannot be negative");
  }
  const discountPercentage = Math.round(
    ((mrpPrice - sellingPrice) / mrpPrice) * 100,
  );
  return discountPercentage;
};

const createProduct = async (req) => {
  try {
    const seller = req.seller;
    const productData = req.body;
    if (!seller) {
      throw new Error("Seller information is required to create a product");
    }
    if (!productData) {
      throw new Error("Product data is required");
    }
    const {
      name,
      description,
      mrpPrice,
      sellingPrice,
      discountPercentage,
      category,
      subCategory,
      stock,
      needAttachment,
      needMessage,
    } = productData;
    const productImages = req.files?.productImages || [];
   
    const product = await Product.create({
      name,
      description,
      image: productImages.map(
        (file) =>
          `/Uploads/Seller/ProductImages/${seller.email}/${file.filename}`,
      ),
      mrpPrice,
      sellingPrice,
      discountPercentage,
      category,
      subCategory,
      seller: seller._id,
      stock,
      needAttachment,
      needMessage,
    });
    seller.products.push(product._id);
    await seller.save();
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(`Unable to create product: ${error.message}`);
  }
};

const updateProduct = async (req) => {
  try {
    const updateData = req.body;
    const productId = updateData.productId;
    const seller = req.seller;
    const productImages = req.files?.productImages || [];

    if (!productId) {
      throw new Error("Product ID is required for update");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

  // ✅ PARSE JSON FIELDS
    const description = JSON.parse(updateData.description || "[]");
    const removedImages = JSON.parse(updateData.removedImages || "[]");


    if (removedImages.length > 0) {
      await deleteFiles(removedImages);
      product.image = product.image.filter(
        (file) => !removedImages.includes(file),
      );
    }
    if (productImages.length > 0) {
      const newImages = productImages.map(
        (file) =>
          `/Uploads/Seller/ProductImages/${seller.email}/${file.filename}`,
      );
      product.image = [...product.image, ...newImages];
    }
    await product.save();

    const {
      name,
      mrpPrice,
      sellingPrice,
      category,
      subCategory,
      discountPercentage,
      stock,
      needAttachment,
      needMessage,
    } = updateData;
     const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description, 
        mrpPrice,
        sellingPrice,
        discountPercentage,
        category,
        subCategory,
        stock,
        needAttachment,
        needMessage,
      },
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw new Error(
      `Unable to update product with ID ${productId}: ${error.message}`,
    );
  }
};

const deleteProduct = async (productId) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { isActive: false, deletedBy: "manual" },
      { new: true },
    );
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw new Error(
      `Unable to delete product with ID ${productId}: ${error.message}`,
    );
  }
};

const restoreProduct = async (productId) => {
  try {
    const product = await Product.findById(productId).populate("subCategory");
    if (!product) {
      throw new Error("Product not found");
    }
    if (!product.subCategory.isActive) {
      throw new Error("Cannot restore product as its category is inactive");
    } else {
      product.isActive = true;
      product.deletedBy = null;
      await product.save();
    }
    return product;
  } catch (error) {
    console.error(`Error restoring product with ID ${productId}:`, error);
    throw new Error(
      `${error.message}`,
    );
  }
};

const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId).populate("category").populate("subCategory");
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    console.error(`Error getting product with ID ${productId}:`, error);
    throw new Error(
      `Unable to get product with ID ${productId}: ${error.message}`,
    );
  }
};

const getProductByIdForUser = async (productId) => {
  try {
   const product = await Product.findById(productId)
  .populate("category")
  .populate("subCategory")
  .lean();

if (!product) throw new Error("Product not found");

const reviews = await Review.find({ product: productId });

const breakdownMap = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

reviews.forEach((r) => {
  if (breakdownMap[r.rating] !== undefined) {
    breakdownMap[r.rating]++;
  }
});

product.breakdown = Object.keys(breakdownMap)
  .map((star) => ({
    stars: Number(star),
    count: breakdownMap[star],
  }))
  .sort((a, b) => b.stars - a.stars);

return product;
  } catch (error) {
    console.error(`Error getting product with ID ${productId}:`, error);
    throw new Error(
      `Unable to get product with ID ${productId}: ${error.message}`
    );
  }
};

const searchProducts = async (searchTerm, sellerId) => {
  try {
    const regex = new RegExp(searchTerm, "i"); // case-insensitive search
    const products = await Product.find({
      name: { $regex: regex },
      seller: sellerId,
      isActive: true,
    });
    return products;
  } catch (error) {
    console.error(`Error searching products with term "${searchTerm}":`, error);
    throw new Error(
      `Unable to search products with term "${searchTerm}": ${error.message}`,
    );
  }
};

const getAllProductsBySeller = async (sellerId) => {
  try {
    const products = await Product.find({ seller: sellerId }).populate("category").populate("subCategory");
    return products;
  } catch (error) {
    console.error("Error getting all products:", error);
    throw new Error(`Unable to get all products: ${error.message}`);
  }
};

const getAllProductsForCustomer = async (sellerId) => {
  try {

   const products = await Product.find({
  isActive: true,
  seller: sellerId,
  stock: { $gt: 0 }, // 👈 this line
}).populate("category").populate("subCategory");
  
    return products;
  } catch (error) {
    console.error("Error getting all products for customer:", error);
    throw new Error(
      `Unable to get all products for customer: ${error.message}`,
    );
  }
};

const getProductsInCategory = async (categoryId) => {
  try {
    const products = await Product.find({
      category: categoryId,
      isActive: true,
      stock: { $gt: 0 },
    }).populate("category").populate("subCategory");
    return products;
  } catch (error) {
    console.error("Error getting products in category:", error);
    throw new Error(`Unable to get products in category: ${error.message}`);
  }
};

const getAllProducts = async () => {
  try {
    const products = await Product.find({ isActive: true });
    return products;
  } catch (error) {
    console.error("Error getting all products:", error);
    throw new Error(`Unable to get all products: ${error.message}`);
  }
};

const createCategory = async (categoryData, seller) => {
  try {
    if (!seller) {
      throw new Error(
        "Seller information is required to create a new category",
      );
    }
    let category = await Category.create({
      name: categoryData.name,
      // description: categoryData.description,
      parentCategory: categoryData.parentCategory || null,
      sellerId: seller._id,
    });

    return category;
  } catch (error) {
    console.error("Error creating or getting category:", error);
    throw new Error(`Unable to create or get category: ${error.message}`);
  }
};

// const getAllParentCategories = async (sellerId) => {
//   try {
//     const categories = await Category.find({
//       sellerId: sellerId,
//       parentCategory: null,
//       // isActive: true,
//     });
//     return categories;
//   } catch (error) {
//     console.error("Error getting all parent categories:", error);
//     throw new Error(`Unable to get all parent categories: ${error.message}`);
//   }
// };

const updateCategory = async (categoryId, updateData) => {
  try {
    // 1️⃣ Get old category
    const oldCategory = await Category.findById(categoryId);
    if (!oldCategory) {
      throw new Error("Category not found");
    }

    // 2️⃣ Prepare update fields
    const updateFields = {
      name: updateData.name,
    };

    if (
      updateData.parentCategory !== "" &&
      updateData.parentCategory !== null &&
      updateData.parentCategory !== undefined
    ) {
      updateFields.parentCategory = updateData.parentCategory;
    } else {
      updateFields.parentCategory = null;
    }

    // 3️⃣ Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateFields,
      { new: true }
    );

    // 4️⃣ CHECK: if parent changed
    const parentChanged =
      String(oldCategory.parentCategory) !==
      String(updateFields.parentCategory);

    if (parentChanged) {
      // 👉 Update all products that use this subcategory
      await Product.updateMany(
        { subCategory: categoryId },
        {
          $set: {
            category: updateFields.parentCategory, // new parent
          },
        }
      );
    }

    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error(`Unable to update category: ${error.message}`);
  }
};

const getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    console.error("Error getting category:", error);
    throw new Error(`Unable to get category: ${error.message}`);
  }
};

const getAllCategoriesOfSeller = async (sellerId, onlyActive) => {
  try {
    if (!sellerId) {
      throw new Error("Seller ID not found");
    }

    let filter = { sellerId };

    if (onlyActive === "true") {
      filter.isActive = true;
    }

    const categories = await Category.find(filter);

    const parents = categories.filter(c => c.parentCategory === null);
    const children = categories.filter(c => c.parentCategory !== null);

    // 🔥 GET PRODUCT COUNT PER CATEGORY
    const productCounts = await Product.aggregate([
      {
        $match: {
          subCategory: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$subCategory",
          count: { $sum: 1 },
        },
      },
    ]);

    // 🔥 Convert to map for fast lookup
    const productCountMap = {};
    productCounts.forEach(p => {
      productCountMap[p._id.toString()] = p.count;
    });

    // 🔥 BUILD TREE WITH COUNTS
    const categoryTree = parents.map(parent => {
      const childList = children
        .filter(
          child =>
            child.parentCategory?.toString() === parent._id.toString()
        )
        .map(child => ({
          ...child._doc,
          productCount: productCountMap[child._id.toString()] || 0,
        }));

      // 🔥 total products in parent
      const totalProducts = childList.reduce(
        (sum, child) => sum + child.productCount,
        0
      );

      return {
        ...parent._doc,
        children: childList,
        childrenCount: childList.length,
        totalProductCount: totalProducts,
      };
    });

    return categoryTree;
  } catch (error) {
    console.error("Error getting all categories:", error);
    throw new Error(`Unable to get all categories: ${error.message}`);
  }
};

const getAllCategoriesOfSellerForUser = async (sellerId) => {
  try {
    if (!sellerId) {
      throw new Error("Seller ID not found");
    }

    let filter = {
  sellerId,
  isActive: true,
  // stock: { $gt: 0 }   
};

    const categories = await Category.find(filter);
   

    const parents = categories.filter(c => c.parentCategory === null);
    const children = categories.filter(c => c.parentCategory !== null);

    // 🔥 GET PRODUCT COUNT PER CATEGORY
    const productCounts = await Product.aggregate([
      {
        $match: {
          subCategory: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$subCategory",
          count: { $sum: 1 },
        },
      },
    ]);

    // 🔥 Convert to map for fast lookup
    const productCountMap = {};
    productCounts.forEach(p => {
      productCountMap[p._id.toString()] = p.count;
    });

    // 🔥 BUILD TREE WITH COUNTS
    const categoryTree = parents.map(parent => {
      const childList = children
        .filter(
          child =>
            child.parentCategory?.toString() === parent._id.toString()
        )
        .map(child => ({
          ...child._doc,
          productCount: productCountMap[child._id.toString()] || 0,
        }));

      // 🔥 total products in parent
      // const totalProducts = childList.reduce(
      //   (sum, child) => sum + child.productCount,
      //   0
      // );

      return {
        ...parent._doc,
        children: childList,
        // childrenCount: childList.length,
        // totalProductCount: totalProducts,
      };
    });
    return categoryTree;
  } catch (error) {
    console.error("Error getting all categories:", error);
    throw new Error(`Unable to get all categories: ${error.message}`);
  }
};

const deleteCategory = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error("Category not found");

    // 🔹 decide subCategories
    const subCategories =
      category.parentCategory === null
        ? await Category.find({
            parentCategory: category._id,
            isActive: true,
          })
        : [category];

    // 🔹 deactivate current category
    category.isActive = false;
    if (category.parentCategory !== null) {
      category.deletedBy = "manual";
    }
    await category.save();

    // 🔹 get all products from subcategories
    const products = await Product.find({
      subCategory: { $in: subCategories.map((sub) => sub._id) },
      isActive: true,
      deletedBy: null,
    });

    // 🔹 deactivate products (cascade)
    if (products.length) {
      await Promise.all(
        products.map((p) =>
          Product.findByIdAndUpdate(p._id, {
            isActive: false,
            deletedBy: "cascade",
          }),
        ),
      );
    }

    // 🔹 deactivate subcategories (cascade)
    await Promise.all(
      subCategories.map((sub) => {
        if (sub.isActive) {
          return Category.findByIdAndUpdate(sub._id, {
            isActive: false,
            deletedBy: "cascade",
          });
        }
      }),
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error(`Unable to delete category: ${error.message}`);
  }
};

const restoreCategory = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error("Category not found");

    // 🔹 decide subCategories
    const subCategories =
      category.parentCategory === null
        ? await Category.find({
            parentCategory: category._id,
            isActive: false,
            deletedBy: "cascade",
          })
        : [category];

    // 🔹 restore category + parent (if subcategory)
    category.isActive = true;
    category.deletedBy = null;

    if (category.parentCategory !== null) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        isActive: true,
      });
    }

    await category.save();

    // 🔹 get products (only cascade deleted)
    const products = await Product.find({
      subCategory: { $in: subCategories.map((sub) => sub._id) },
      isActive: false,
      deletedBy: "cascade",
    });

    // 🔹 restore products
    if (products.length) {
      await Promise.all(
        products.map((p) =>
          Product.findByIdAndUpdate(p._id, {
            isActive: true,
            deletedBy: null,
          }),
        ),
      );
    }

    // 🔹 restore subcategories
    await Promise.all(
      subCategories.map((sub) => {
        if (!sub.isActive) {
          return Category.findByIdAndUpdate(sub._id, {
            isActive: true,
            deletedBy: null,
          });
        }
      }),
    );
  } catch (error) {
    console.error("Error restoring category:", error);
    throw new Error(`Unable to restore category: ${error.message}`);
  }
};

const addRating = async (reviewData, user) => {
  try {
    const { productId, rating, review } = reviewData;

    // 1. Save new rating
    const newRating = await Review.create({
      product: productId,
      user: user._id,
      username: user.name,
      email: user.email,
      rating,
      review,
    });

    // 2. Recalculate product rating
    const result = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        ratingAverage: Math.round(result[0].averageRating * 2) / 2,
        ratingCount: result[0].totalRatings,
      });
    }

    return newRating;
  } catch (error) {
    console.error("Error adding rating:", error);
    throw new Error(`Unable to add rating: ${error.message}`);
  }
};

const getReviews = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
    return reviews;
  } catch (error) {
    console.error("Error getting reviews:", error);
    throw new Error(`Unable to get reviews: ${error.message}`);
  }
};

module.exports = {
  calculateDiscountPercentage,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  getProductById,
  getProductByIdForUser,
  searchProducts,
  getAllProductsBySeller,
  getAllProducts,
  getAllProductsForCustomer,
  getProductsInCategory,
  createCategory,
  getAllCategoriesOfSellerForUser,
  // getAllParentCategories,
  updateCategory,
  getCategoryById,
  getAllCategoriesOfSeller,
  deleteCategory,
  restoreCategory,
  addRating,
  getReviews,
};
