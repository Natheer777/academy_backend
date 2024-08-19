const Model = require('../module/module')
class UserController{
    static async getAllcomments(req , res){
        try{
            const result = await Model.getcomments();
            res.send(result);
        }catch(error){
            res.status(500).send("error fetching users")
        }
    }
    static async addcomments(req , res){
        const{name , country , comment} = req.body;
        try{
            const answer = await Model.addcomments(name , country , comment)
                 if (answer){
                    res.send('add successfully')
                 }   else{
                    res.status(500).send(' adding failed')
                 }
        }catch(error){
            res.status(500).send('error')
        }
    }
}
module.exports = UserController