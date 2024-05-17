const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const orders = await Order.fetchAll();
    res.json(orders);
  })
);

router.get(
  "/:order_id",
  asyncHandler(async (req, res) => {
    const order = await Order.fetchById(req.params.order_id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  })
);

router.get(
  "/:order_id/items",
  asyncHandler(async (req, res) => {
    const orderItems = await OrderItem.fetchByOrderId(req.params.order_id);
    res.json(orderItems);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  })
);

router.put(
  "/:order_id",
  asyncHandler(async (req, res) => {
    const updatedOrder = await Order.updateById(req.params.order_id, req.body);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOrder);
  })
);

router.delete(
  "/:order_id",
  asyncHandler(async (req, res) => {
    await Order.deleteById(req.params.order_id);
    res.json({ message: "Order deleted" });
  })
);

router.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Server error" });
});

module.exports = router;
