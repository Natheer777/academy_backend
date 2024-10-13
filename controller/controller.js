const Model = require('../module/module')
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
}
module.exports = UserController
