const Model = require('../module/module')
const bcrypt = require('bcryptjs')

class UserController{
    static async getAllcomments(req, res) {
        try {
            const result = await Model.getcomments(); // استدعاء الدالة getcomments
            res.send(result); // إرسال النتيجة كاستجابة
        } catch (error) {
            console.error("Error fetching comments:", error);
            res.status(500).send("Error fetching comments");
        }
    }

    static async allusers(req , res){
        try{
            const result = await Model.getusers();
            res.send(result)
        }catch(error){
            console.error("Error fetching users:", error);
            res.status(500).send("Error fetching users");        }
    }

    static async addcomments(req, res) {
        const { name, country, comment } = req.body;
        try {
            const answer = await Model.addcomments(name, country, comment);
            if (answer) {
                res.send('Added successfully');
            } else {
                res.status(500).send('Adding failed');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).send('Error');
        }
    }
    
    static async deletecomment(req, res) {
        const { id } = req.body;
        try {
            if (id) {
                const resultId = await Model.deletecomment(id);
                if (resultId) {
                    res.send('Delete done');
                } else {
                    res.status(500).send('Delete failed');
                }
            } else {
                res.status(400).send('ID is required');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).send('Error deleting comment');
        }
    }
    static async deleteusers(req, res) {
        const { id } = req.body;
        try {
            if (id) {
                const resultId = await Model.deleteuser(id);
                if (resultId) {
                    res.send('Delete done');
                } else {
                    res.status(500).send('Delete failed');
                }
            } else {
                res.status(400).send('ID is required');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).send('Error deleting comment');
        }
    }
    
   static   updateCredentials = async (req, res) => {
        const { newUsername, newPassword, userId } = req.body;
      
        if (!newUsername || !newPassword) {
          return res.status(400).json({ message: "الرجاء إدخال اسم مستخدم وكلمة مرور." });
        }
      
        try {
          // تشفير كلمة المرور
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          
          // تحديث البيانات في قاعدة البيانات
          await Model.updateCredentials(userId, newUsername, hashedPassword);
          
          res.status(200).json({ message: "تم تحديث اسم المستخدم وكلمة المرور بنجاح" });
        } catch (error) {
          console.error("Error updating credentials:", error);
          res.status(500).json({ message: "حدث خطأ أثناء تحديث البيانات" });
        }
      };
      
      // دالة لجلب المستخدم باستخدام ID (يمكن استخدامها لاحقًا)
      static  getUserById = async (req, res) => {
        const userId = req.params.id;
      
        try {
          const user = await Model.getUserById(userId);
          if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
          }
          res.status(200).json(user);
        } catch (error) {
          console.error("Error fetching user:", error);
          res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات المستخدم" });
        }
      };
}


module.exports = UserController
