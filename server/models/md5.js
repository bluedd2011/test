/**
 * Created by liqi on 2015/7/3.
 */
var Buffer = require('buffer').Buffer;

var crypto = require('crypto');
exports.md5=function(data){
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    return crypto.createHash("md5").update(str).digest("hex");
}