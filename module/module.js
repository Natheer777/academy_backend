// const db = require("../config/config");
// class Model {
//   static async getcomments() {
//     try {
//       const [rows] = await db.query("SELECT * FROM comments"); // استعلام مباشر بدون الحاجة إلى Promise يدوي
//       return rows; // إرجاع النتائج
//     } catch (error) {
//       console.error("Database query error:", error);
//       throw error; // رمي الخطأ ليتم التعامل معه في الدالة المستدعية
//     }
//   }
//   static async getusers() {
//     try {
//       const [row] = await db.query("SELECT * FROM users");
//       return row;
//     } catch (error) {
//       console.error("Database query error:", error);
//       throw error; // رمي الخطأ ليتم التعامل معه في الدالة المستدعية
//     }``
//   }
//   static async addcomments(name, country, comment) {
//     try {
//       const query =
//         "INSERT INTO comments (name, country, comment) VALUES (?, ?, ?)";
//       const [result] = await db.query(query, [name, country, comment]);
//       return result.affectedRows > 0;
//     } catch (error) {
//       console.error("Database insert error:", error);
//       throw error;
//     }
//   }

//   static async deletecomment(id) {
//     try {
//       const query = "DELETE FROM comments WHERE id = ?";
//       const [result] = await db.query(query, [id]);
//       return result.affectedRows > 0;
//     } catch (error) {
//       console.error("Database delete error:", error);
//       throw error;
//     }
//   }
//   static async deleteuser(id) {
//     try {
//       const query = "DELETE FROM users WHERE id = ?";
//       const [result] = await db.query(query, [id]);
//       return result.affectedRows > 0;
//     } catch (error) {
//       console.error("Database delete error:", error);
//       throw error;
//     }
//   }


//   static getUserByUsername = (username) => {
//     return new Promise((resolve, reject) => {
//         const query = `SELECT * FROM dash WHERE username = ?`;
//         db.execute(query, [username])
//             .then(result => resolve(result[0]))
//             .catch(error => reject(error));
//     });
// };

// static updateCredentials = (userId, username, password) => {
//     return new Promise((resolve, reject) => {
//         const query = `UPDATE dash SET username = ?, password = ? WHERE id = ?`;
//         db.execute(query, [username, password, userId])
//             .then(result => resolve(result))
//             .catch(error => reject(error));
//     });
// };

// static getUserById = (userId) => {
//     return new Promise((resolve, reject) => {
//         const query = `SELECT * FROM dash WHERE id = ?`;
//         db.execute(query, [userId])
//             .then(result => resolve(result[0]))
//             .catch(error => reject(error));
//     });
// };

// }


// module.exports = Model;


const db = require("../config/config");

class Model {
  static async getcomments() {
    try {
      const [rows] = await db.query("SELECT * FROM comments");
      return rows;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

    static async getusers() {
    try {
      const [row] = await db.query("SELECT * FROM users");
      return row;
    } catch (error) {
      console.error("Database query error:", error);
      throw error; // رمي الخطأ ليتم التعامل معه في الدالة المستدعية
    }
  }

  static async addcomments(name, country, comment) {
    try {
      const query = "INSERT INTO comments (name, country, comment) VALUES (?, ?, ?)";
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

  static async getUserByUsername(username) {
    try {
      const query = "SELECT * FROM dash WHERE username = ?";
      const [result] = await db.query(query, [username]);
      return result[0]; // يرجع أول مستخدم
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  static async updateCredentials(userId, username, password) {
    try {
      const query = "UPDATE dash SET username = ?, password = ? WHERE id = ?";
      const [result] = await db.query(query, [username, password, userId]);
      return result;
    } catch (error) {
      console.error("Database update error:", error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const query = "SELECT * FROM dash WHERE id = ?";
      const [result] = await db.query(query, [userId]);
      return result[0]; // يرجع أول مستخدم
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }
}

module.exports = Model;
