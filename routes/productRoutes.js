const express = require("express");
const router = express.Router();
const Product = require("../models/product");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category, sort } = req.query;
    const products = await Product.fetchAll({ category, sort });
    res.json(products);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.fetchById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const updatedProduct = await Product.updateById(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await Product.deleteById(req.params.id);
    res.json({ message: "Product deleted" });
  })
);

router.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Server error" });
});

module.exports = router;
