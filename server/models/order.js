/**
 * Created by liqi on 2015/7/3.
 */
var db=require('./db').db;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var md5=require('./md5').md5;

var OrderDoneSchema = new mongoose.Schema({
    publisher_id:String,        //发布者id
    publisher_time:Date,        //发布时间
    province:String,            //省份
    city:String,                //城市
    acceptor_id:String,         //接单者id
    accept_time:Date,           //接单时间
    applicants:Array,           //接单人列表
    clock:Date,                 //约定时间
    duration:String,            //时长
    money:String,               //费用
    remark:String               //备注
});

var OrderUnDoneSchema = new mongoose.Schema({
    publisher_id:String,
    publisher_time:Date,
    acceptor:String,
    accept_time:Date,
    applicants:Array
});

var OrderTplSchema=new mongoose.Schema({
    publisher_id:String,
    clock:Date,
    duration:String,
    money:String,
    remark:String
});















