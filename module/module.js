const db = require("../config/config");
class Model {
  static async getcomments() {
    try {
      const [rows] = await db.query("SELECT * FROM comments"); // استعلام مباشر بدون الحاجة إلى Promise يدوي
      return rows; // إرجاع النتائج
    } catch (error) {
      console.error("Database query error:", error);
      throw error; // رمي الخطأ ليتم التعامل معه في الدالة المستدعية
    }
  }
  static async getusers() {
    try {
      const [row] = await db.query("SELECT * FROM users");
      return row;
    } catch (error) {
      console.error("Database query error:", error);
      throw error; // رمي الخطأ ليتم التعامل معه في الدالة المستدعية
    }``
  }
  static async addcomments(name, country, comment) {
    try {
      const query =
        "INSERT INTO comments (name, country, comment) VALUES (?, ?, ?)";
      const [result] = await db.query(query, [name, country, comment]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Database insert error:", error);
      throw error;
    }
  }

  static async deletecomment(id) {
    try {
      const query = "DELETE FROM comments WHERE id = ?";
      const [result] = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Database delete error:", error);
      throw error;
    }
  }
  static async deleteuser(id) {
    try {
      const query = "DELETE FROM users WHERE id = ?";
      const [result] = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Database delete error:", error);
      throw error;
    }
  }
}
module.exports = Model;
