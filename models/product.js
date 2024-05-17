const pool = require("../db/db");

class Product {
  static async fetchAll({ category, sort }) {
    try {
      let query = "SELECT * FROM products";
      const queryParams = [];

      if (category) {
        queryParams.push(category);
        query += ` WHERE category = $${queryParams.length}`;
      }

      if (sort) {
        const validSortColumns = ["price", "name"];
        if (validSortColumns.includes(sort)) {
          query += ` ORDER BY ${sort}`;
        }
      }

      const { rows } = await pool.query(query, queryParams);
      return rows;
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  }

  static async fetchById(id) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
      );
      if (rows.length === 0) {
        throw new Error(`Product with id ${id} not found`);
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching product by id ${id}:`, error);
      throw error;
    }
  }

  static async create({ name, description, price, image_url, category }) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO products (name, description, price, image_url, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, description, price, image_url, category]
      );
      return rows[0];
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  static async updateById(
    id,
    { name, description, price, image_url, category }
  ) {
    try {
      const { rows } = await pool.query(
        "UPDATE products SET name = $2, description = $3, price = $4, image_url = $5, category = $6 WHERE id = $1 RETURNING *",
        [id, name, description, price, image_url, category]
      );
      if (rows.length === 0) {
        throw new Error(`Product with id ${id} not found`);
      }
      return rows[0];
    } catch (error) {
      console.error(`Error updating product by id ${id}:`, error);
      throw error;
    }
  }

  static async deleteById(id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query("DELETE FROM order_items WHERE product_id = $1", [id]);

      const result = await client.query(
        "DELETE FROM products WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        throw new Error(`Product with id ${id} not found`);
      }

      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`Error deleting product by id ${id}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Product;
