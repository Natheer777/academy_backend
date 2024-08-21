const db = require('../config/config')
class Model {
    static getcomments(){
        return new Promise((resolve , reject) =>{
            db.query('SELECT * FROM comments' ,[] ,(error , result) =>{
                if(error){
                    return reject(error)
                }else{
                    resolve(result)
                }
            })
        })
    } 
    static addcomments(name , country , comment){
      return new Promise((resolve , reject) =>{
        const query = 'INSERT INTO comments (name, country ,comment) VALUES (?, ? ,?)'
    db.query(query, [name, country ,comment],(error , result) =>{
        if(error){
            return reject(error);
        }
        resolve(result.affectedRows > 0);
    })  
    })  
    }

    static deletecomment(id){
        return new Promise((resolve , reject) =>{
            const query = 'DELETE FROM comments WHERE id =?'
            db.query(query , [id],(error , result) =>{
                if(error){
                    return reject(error)
                }else{
                    return resolve(result.affectedRows > 0)
                }
            })
        })
    }
}
module.exports = Model
