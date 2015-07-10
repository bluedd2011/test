/**
 * Created by liqi on 2015/7/2.
 */
var mongoose = require('mongoose');
var db=mongoose.createConnection('localhost','server');
db.on('error', console.error.bind(console,'连接错误'));
db.once('open', function () {
    console.log('连接成功');
});
exports.db=db;