const pool = require("../db/db");

class Order {
  static async fetchAll() {
    try {
      const { rows } = await pool.query("SELECT * FROM orders");
      return rows;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
  }

  static async fetchById(order_id) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM orders WHERE order_id = $1",
        [order_id]
      );
      if (rows.length === 0) {
        throw new Error(`Order with id ${order_id} not found`);
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching order by id ${order_id}:`, error);
      throw error;
    }
  }

  static async create({ customer_id, total_price, status }) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO orders (customer_id, total_price, status) VALUES ($1, $2, $3) RETURNING *",
        [customer_id, total_price, status]
      );
      return rows[0];
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  static async updateById(order_id, { customer_id, total_price, status }) {
    try {
      const { rows } = await pool.query(
        "UPDATE orders SET customer_id = $2, total_price = $3, status = $4 WHERE order_id = $1 RETURNING *",
        [order_id, customer_id, total_price, status]
      );
      if (rows.length === 0) {
        throw new Error(`Order with id ${order_id} not found`);
      }
      return rows[0];
    } catch (error) {
      console.error(`Error updating order by id ${order_id}:`, error);
      throw error;
    }
  }

  static async deleteById(order_id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query("DELETE FROM order_items WHERE order_id = $1", [
        order_id,
      ]);

      const result = await client.query(
        "DELETE FROM orders WHERE order_id = $1 RETURNING *",
        [order_id]
      );

      if (result.rows.length === 0) {
        throw new Error(`Order with id ${order_id} not found`);
      }

      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`Error deleting order by id ${order_id}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Order;
