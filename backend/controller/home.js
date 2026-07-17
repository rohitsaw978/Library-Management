const homeController = {};

const { BookModel } = require("../model/BookModel");
const { BorrowModel } = require("../model/BorrowModel");
const { getCache, setCache } = require("../utils/cache");

homeController.getHomeData = async (req, res) => {
  try {
    // Cache
    const cachedData = getCache("homeData");

    if (cachedData) {
      return res.status(200).json({
        error: false,
        ...cachedData,
      });
    }

    // Total Books
    const totalBooks = await BookModel.countDocuments();

    // Total Categories
    const totalCategories = await BookModel.distinct("category");

    // Categories
    const categories = await BookModel.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          coverImage: { $first: "$coverImage" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 4,
      },
    ]);

    const formattedCategories = categories.map((item) => ({
      _id: item._id,
      category: item._id,
      count: item.count,
      coverImage: item.coverImage || "",
    }));

    // New Arrivals
    const newArrivals = await BookModel.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .select("title author category coverImage");

    // Active Students
    const issuedBooks = await BorrowModel.find({
      status: "Issued",
    }).select("userId");

    const totalActiveStudents = [
      ...new Set(
        issuedBooks.map((item) => item.userId.toString())
      ),
    ].length;

    const response = {
      stats: {
        totalBooks,
        totalCategories: totalCategories.length,
        totalActiveStudents,
      },
      categories: formattedCategories,
      newArrivals,
    };

    setCache("homeData", response);

    return res.status(200).json({
      error: false,
      ...response,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

module.exports = {
  homeController,
};