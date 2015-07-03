/**
 * Created by liqi on 2015/6/17.
 */
var db=require('./db').db;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var md5=require('./md5').md5;

var UsersSchema = new mongoose.Schema({
    user_name:String,
    password:String,
    md5:String,
    time:{
        type:date,
        default:date.now
    }
});

var UserInfosSchema=new mongoose.Schema({
    province:String,
    city:String,
    sex:String,
    age:Number,
    order_tpl_id:String,
    signature:String
});



//内部方法 用户名是否存在
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

//静态方法 注册
UsersSchema.statics.register= function (json,cb) {
    var thisModel=this.model('users');
    isExist(thisModel,json.user_name,function(user){
        if(user.length<=0){
            json.md5=md5(json.user_name+json.password);
            thisModel.create(json, function (err,user) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log(user[0].md5);
                if(cb) {
                    cb(err, user);
                }
            });
        }else{
            console.log(json.user_name+' has been existed.');
        }
    });
}

//静态方法 登录
UsersSchema.statics.login= function (json, cb) {
    var thisModel=this.model('users');
    isExist(thisModel,json.user_name,function(user){
        if(user.length===1){
            console.log(user[0].md5);
            if(cb){
                cb(user);
            }
        }else if(user.length>1){
            console.log(json.user_name+' is repeat at logging.');
        }else{
            console.log(json.user_name+' has been existed.');
        }
    });
}

//静态方法 用户名是否存在
UsersSchema.statics.isExist= function (name, cb) {
    this.model('users').find({user_name:name}, function () {
        if(err){
            console.log(err);
            return;
        }
        if(cb) {
            cb(user);
        }
    });
}

//静态方法 保存用户信息
UsersSchema.statics.save= function (json,cb) {
    this.model('users').find({user_name:json.user_name}, function (err,user) {
        if(err){
            console.log(err);
            return;
        }
        if(user.length===1) {
            json._id=user[0]._id;
            UserInfoModel.complete(json, cb);
        }
    });
}



//UserInfo静态方法 保存用户基本信息
UserInfosSchema.statics.complete= function (json, cb) {
    this.model('userinfos').update({_id:json._id},json,{upsert : true}, function (err) {
        if(err){
            console.log(err);
            return;
        }
        console.log('save success.');
    });
}

var UserInfoModel = db.model('userinfos',UserInfosSchema);
var UserModel = db.model('users',UsersSchema);

exports.user={
    schema:UsersSchema,
    model:UserModel
};


//var s = new Schema({name: {type: String, index: true})
//var s = new Schema({loc: {type: [Number], index: 'hashed'})
//var s = new Schema({loc: {type: [Number], index: '2d', sparse: true})
//var s = new Schema({loc: {type: [Number], index: {type: '2dsphere', sparse: true}})
//var s = new Schema({date: {type: Date, index: {unique: true, expires: '1d'}})
//Schema.path('my.path').index(true);
//Schema.path('my.date').index({expires: 60});
//Schema.path('my.path').index({unique: true, sparse: true});