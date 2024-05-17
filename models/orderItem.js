const pool = require("../db/db");

class OrderItem {
  static async fetchByOrderId(order_id) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [order_id]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error fetching order items by order id ${order_id}:`,
        error
      );
      throw error;
    }
  }

  static async create({ order_id, product_id, quantity, price }) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
        [order_id, product_id, quantity, price]
      );
      return rows[0];
    } catch (error) {
      console.error("Error creating order item:", error);
      throw error;
    }
  }

  static async updateById(
    order_item_id,
    { order_id, product_id, quantity, price }
  ) {
    try {
      const { rows } = await pool.query(
        "UPDATE order_items SET order_id = $2, product_id = $3, quantity = $4, price = $5 WHERE order_item_id = $1 RETURNING *",
        [order_item_id, order_id, product_id, quantity, price]
      );
      if (rows.length === 0) {
        throw new Error(`Order item with id ${order_item_id} not found`);
      }
      return rows[0];
    } catch (error) {
      console.error(`Error updating order item by id ${order_item_id}:`, error);
      throw error;
    }
  }

  static async deleteById(order_item_id) {
    try {
      const result = await pool.query(
        "DELETE FROM order_items WHERE order_item_id = $1 RETURNING *",
        [order_item_id]
      );
      if (result.rows.length === 0) {
        throw new Error(`Order item with id ${order_item_id} not found`);
      }
      return result.rows[0];
    } catch (error) {
      console.error(`Error deleting order item by id ${order_item_id}:`, error);
      throw error;
    }
  }
}

module.exports = OrderItem;
