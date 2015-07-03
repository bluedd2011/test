/**
 * Created by liqi on 2015/6/24.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db=mongoose.createConnection('localhost','server');
var data=require('./models/data').data;

var User=require('./models/user').user;
db.on('error', console.error.bind(console,'连接错误'));
db.once('open', function () {
    console.log('连接成功');
});

//注册
//User.model.register(data.register);

//登录
//User.model.login(data.login);

//保存用户信息
User.model.save(data.complete);











//var PersonModel = db.model('Person',PersonSchema);
//
//var personEntity = new PersonModel({
//    userid:'Krouky'
//});
//
//console.log(personEntity.userid);

//PersonSchema.methods.speak = function(){
//    console.log('我的名字是'+this.userid);
//};
//PersonSchema.statics.findByName= function (name, cb) {
//    this.model('users').find({userid:name},cb);
//};
//var PersonModel= db.model('users',PersonSchema);
//PersonModel.findByName('admin',function(err,persons){
//    console.log(persons);
//});
//var personEntity= new PersonModel({userid:'Krouky',password:'333'});
//personEntity.speak();
//personEntity.save();






