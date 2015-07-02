/**
 * Created by liqi on 2015/6/17.
 */
var db=require('./db').db;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
    id:Number,
    user_name:String,
    password:String
});

function isExist(model,name,cb){
    model.find({user_name:name}, function (err,user) {
        if(err){
            console.log(err);
            return;
        }
        if(cb) {
            cb(user);
        }
    });
}

UserSchema.statics.register= function (json,cb) {
    var thisModel=this.model('user');
    isExist(thisModel,json.user_name,function(user){
        if(!user){
            thisModel.create(json, function (err,user) {
                if(err){
                    console.log(err);
                }
                if(cb) {
                    cb(err, user);
                }
            });
        }else{
            console.log(json.user_name+' has been existed.');
        }
    })

}

UserSchema.statics.isExist= function (name, cb) {
    this.model('user').find({user_name:name}, function () {
        if(err){
            console.log(err);
            return;
        }
        if(cb) {
            cb(user);
        }
    });
}

var UserModel = db.model('user',UserSchema);
exports.user = {
    schema:UserSchema,
    model:UserModel
};