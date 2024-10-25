import express from "express";
import cors from "cors";
import axios from "axios";
import { Product } from "./models/product.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.get("/initialize", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;

    await Product.insertMany(transactions);
    res.status(200).json({ message: "Database initialized with seed data!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error initializing database", error: error.message });
  }
});

app.get("/transactions", async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;
  const regex = new RegExp(search, "i");

  const query = {
    $or: [{ title: regex }, { description: regex }],
    dateOfSale: { $regex: `-${month.padStart(2, "0")}-` },
  };

  if (search && !isNaN(search)) {
    query.price = Number(search);
  } else if (search) {
    delete query.price;
  }

  try {
    const transactions = await Product.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

app.get("/statistics", async (req, res) => {
  const { month } = req.query;
  try {
    const totalSaleAmount = await Product.aggregate([
      { $match: { dateOfSale: { $regex: `-${month}-` } } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const soldItems = await Product.countDocuments({
      dateOfSale: { $regex: `-${month}-` },
      isSold: true,
    });

    const unsoldItems = await Product.countDocuments({
      dateOfSale: { $regex: `-${month}-` },
      isSold: false,
    });

    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
      soldItems,
      unsoldItems,
      message: "Statistics fetched successfully.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching statistics", error: error.message });
  }
});

app.get("/bar-chart", async (req, res) => {
  const { month } = req.query;

  const dateQuery = month
    ? { dateOfSale: { $regex: `^.*${month}.*`, $options: "i" } }
    : {};

  const priceRanges = [
    {
      $bucket: {
        groupBy: "$price",
        boundaries: [
          0,
          100,
          200,
          300,
          400,
          500,
          600,
          700,
          800,
          900,
          Number.MAX_VALUE,
        ],
        default: "901-above",
        output: { count: { $sum: 1 } },
      },
    },
  ];

  try {
    const result = await Product.aggregate([
      { $match: dateQuery },
      ...priceRanges,
    ]);
    res
      .status(200)
      .json({ data: result, message: "Bar chart data fetched successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching bar chart data", error: error.message });
  }
});

app.get("/pie-chart", async (req, res) => {
  const { month } = req.query;

  const dateQuery = month
    ? { dateOfSale: { $regex: `^.*${month}.*`, $options: "i" } }
    : {};

  try {
    const result = await Product.aggregate([
      { $match: dateQuery },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res
      .status(200)
      .json({ data: result, message: "Pie chart data fetched successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching pie chart data", error: error.message });
  }
});

app.get("/combined-report", async (req, res) => {
  const { month } = req.query;

  try {
    const transactions = await Product.find({
      dateOfSale: { $regex: `-${month.padStart(2, "0")}-` },
    });
    const statistics = await getStatistics(month);
    const priceRange = await getBarChartData(month);
    const categories = await getPieChartData(month);

    res.status(200).json({
      transactions,
      statistics,
      priceRange,
      categories,
      message: "Combined report fetched successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching combined report",
      error: error.message,
    });
  }
});

async function getStatistics(month) {
  const dateQuery = month
    ? { dateOfSale: { $regex: `^.*${month}.*`, $options: "i" } }
    : {};

  const totalSales = await Product.aggregate([
    { $match: dateQuery },
    {
      $group: {
        _id: null,
        total: { $sum: "$price" },
        count: { $sum: 1 },
        sold: { $sum: { $cond: ["$sold", 1, 0] } },
      },
    },
  ]);

  return totalSales[0] || { total: 0, count: 0, sold: 0 };
}

async function getBarChartData(month) {
  const dateQuery = month
    ? { dateOfSale: { $regex: `^.*${month}.*`, $options: "i" } }
    : {};

  const priceRanges = [
    {
      $bucket: {
        groupBy: "$price",
        boundaries: [
          0,
          100,
          200,
          300,
          400,
          500,
          600,
          700,
          800,
          900,
          Number.MAX_VALUE,
        ],
        default: "901-above",
        output: { count: { $sum: 1 } },
      },
    },
  ];

  return await Product.aggregate([{ $match: dateQuery }, ...priceRanges]);
}

async function getPieChartData(month) {
  const dateQuery = month
    ? { dateOfSale: { $regex: `^.*${month}.*`, $options: "i" } }
    : {};

  return await Product.aggregate([
    { $match: dateQuery },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
}

export { app }
