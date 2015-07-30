/**
 * Created by sihan on 2015/7/30.
 */
var mongodb = require('./db');

function Comment(name,day,title,comment){
    this.name = name;
    this.day = day;
    this.title = title;
    this.comment = comment;
}

module.exports  = Comment;

//存储一条留言信息
Comment.prototype.save = function(callback){
    var name = this.name,
        day = this.day,
        title = this.title,
        comment = this.comment;

    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        //读取  posts 集合
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            //通过用户名、时间及标题查找文档，并把一跳留言对象添加到该文档的 comments 数组里
            collection.update({
                "name":name,
                "title":title,
                "time.day":day
            },{
                $push:{"comments":comment}   //保存用$push
            },function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};