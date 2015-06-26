/**
 * Created by liqi on 2015/6/24.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db=mongoose.createConnection('localhost','server');

db.on('error', console.error.bind(console,'连接错误'));
//db.once('open', function () {
//    console.log('连接成功');
//})

var PersonSchema = new mongoose.Schema({
    userid:String,
    password:String
});

//var PersonModel = db.model('Person',PersonSchema);
//
//var personEntity = new PersonModel({
//    userid:'Krouky'
//});
//
//console.log(personEntity.userid);

PersonSchema.methods.speak = function(){
    console.log('我的名字是'+this.userid);
};
PersonSchema.statics.findByName= function (name, cb) {
    this.find({name:new RegExp(name)},cb);
};
var PersonModel= db.model('users',PersonSchema);
PersonModel.findByName('admin',function(err,persons){
    console.log(persons);
});
//var personEntity= new PersonModel({userid:'Krouky',password:'333'});
//personEntity.speak();
//personEntity.save();






