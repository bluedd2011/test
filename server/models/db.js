/**
 * Created by liqi on 2015/7/2.
 */
var mongoose = require('mongoose');
var db=mongoose.createConnection('localhost','server');
exports.db=db;