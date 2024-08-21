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


    static async deletecomment(req , res){
        const {id} = req.body
        try{
            if(id){
                const resultId = await Model.deletecomment(id)
                if(resultId){
                    res.send('delete done')
                }else{
                    res.status(500).send('delete failed')
                }
            }else{
                res.status(400).send('id is required')
            }
        }catch(error){
            res.status(500).send('error deleting comment')
        }
    }
}
module.exports = UserController