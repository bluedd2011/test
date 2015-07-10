/**
 * Created by liqi on 2015/7/3.
 */
var db=require('./db').db;
var mongoose = require('mongoose');
var md5=require('./md5').md5;
var DbUser=require('./user').ep;
var orderStatus={
    '发布中':'0',
    '已取消':'1',
    '已终止':'2',
    '已完成':'3',
    '已过期':'4'
};
var tool=require('./tool').tool;

var OrdersSchema = new mongoose.Schema({
    publisher_id:{type:String,index:true},          //发布者id
    publisher_time:Date,                            //发布时间
    province:String,                                //省份
    city:String,                                    //城市
    acceptor_id:String,                             //接单者id
    accept_time:Date,                               //接单时间
    applicants:Array,                               //接单人列表
    clock:Date,                                     //约定时间
    duration:String,                                //时长
    money:String,                                   //费用
    remark:String,                                  //备注
    status:{                                        //状态
        type:'String',
        default:orderStatus['发布中']
    }
});
OrdersSchema.statics.toSaveUndone= function (json, cb) {
    var thisModel=this.model('orders');
    var publish_order_id=json._id;

    if(publish_order_id){
        thisModel.update({_id:publish_order_id},json,{upsert:true}, function (err,doc) {
            tool.managerError(err);
            console.log('订单保存成功');
            if(cb){
                cb(doc);
            }
        });
    }else{
        delete json._id;
        thisModel.create(json, function (err,doc) {
            tool.managerError(err);
            console.log('订单保存成功');
            if(cb){
                cb(doc);
            }
        });
    }

}

function _orderIsUnique(model,user_id,cb){
    model.find({publisher_id:user_id}, function (err,docs) {
        if(err){
            console.log(err);
            return;
        }
        if(docs.length<1){
            if(cb) {
                cb();
            }
        }else{
            console.log('order is not unique,publisher_id is '+user_id);
        }
    });
}


var OrderTplSchema=new mongoose.Schema({
    publisher_id:String,
    clock:Date,
    duration:String,
    money:String,
    remark:String
});
OrderTplSchema.statics.toSave= function (json,cb) {
    var thisModel=this.model('orderTpl');
    var order_tpl_id=json._id;
    if(order_tpl_id) {
        thisModel.update({_id: order_tpl_id}, json, {upsert: true}, function (err, doc) {
            tool.managerError(err);
            console.log('订单模板保存成功');
            if (cb) {
                cb(doc);
            }
        });
    }else{
        delete json._id;
        thisModel.create(json, function (err, doc) {
            tool.managerError(err);
            console.log('订单模板保存成功');
            if (cb) {
                cb(doc);
            }
        });
    }
}


var OrdersModel=db.model('orders',OrdersSchema);
var OrderTplModel=db.model('orderTpl',OrderTplSchema);

function buildOrder(userId,json){
    DbUser.getUserInfo(userId, function (userInfo) {
        OrdersModel.toSaveUndone({
            _id:userInfo.publish_order_id,
            publisher_id:userId,
            publisher_time:Date.now(),
            province:userInfo.province || undefined,
            city:userInfo.city || undefined,
            clock:json.clock,
            duration:json.duration,
            money:json.money,
            remark:json.remark
        },function(order){
            OrderTplModel.toSave({
                _id:userInfo.order_tpl_id,
                publisher_id:userId,
                clock:json.clock,
                duration:json.duration,
                money:json.money,
                remark:json.remark
            },function(orderTpl){
                userInfo.publish_order_id=userInfo.publish_order_id || order._id;
                userInfo.order_tpl_id=userInfo.order_tpl_id || orderTpl._id;
                userInfo.save(function(err){
                    tool.managerError(err);
                    console.log('用户信息更新成功')
                });
            });
        });
    });

}

function findAllOrderPublishing(){
    OrdersModel.find({status:orderStatus['发布中']}, function (err, docs) {
        if(err){
            console.log(err);
        }
        console.log('查询完成（发布中）');
        for(var i = 0;i<docs.length;i++){
            console.log(docs[i].publisher_id);
        }
    });
}

function findOrderByOrderID(userID){
    userID=userID||'559b32634517c33c17886538';
    OrdersModel.findById(userID, function (err, doc) {
        if(err){
            console.log(err);
        }
        console.log('查询完成（id:'+userID+'）');
        console.log(doc.publisher_id);
    });
}

function findOrderByUserIDAndStatus(userID,_orderStatus){
    userID=userID||'559b32634517c33c17886538';
    _orderStatus=_orderStatus||orderStatus['已发布'];
    OrdersModel.find({publisher_id:userID,status:_orderStatus}, function (err, docs) {
        if(err){
            console.log(err);
        }
        console.log('查询完成（publisher_id:'+userID+',status:'+_orderStatus+'）');
        console.log('count:'+docs.length);
    });
}

function acceptOrder(userID,orderID){
    OrdersModel.findOne({_id:orderID,status:orderStatus['发布中']}, function (err, doc) {
        tool.managerError(err);
        console.log('查询完成（orderID:'+orderID+',status:发布中）');
        if(doc){
            doc.applicants=doc.applicants||[];
            var applicants=doc.applicants;
            var _count=0;
            for (var i = 0; i < applicants.length; i++) {
                if(applicants[i]===userID){
                    _count++;
                    break;
                }
            }
            if(_count>0){
                console.log('您已申请此订单');
            }else{
                applicants.push(userID);
                doc.save( function (_err) {
                    tool.managerError(_err);
                    console.log('申请成功，orders更新完成：'+doc._id);
                });
            }
        }else{
            console.log('订单不存在');
        }

        DbUser.getUserInfo(userID,function(user){
            user.apply_orders = user.apply_orders || [];
            var apply_orders = user.apply_orders;
            var count=0;
            for(var i=0;i<apply_orders.length;i++){
                if(apply_orders[i]===orderID){
                    count++;
                    break;
                }
            }
            if(count>0){
                console.log('您已申请该订单');
            }else{
                apply_orders.push(orderID);
                user.save(function(err){
                    tool.managerError(err);
                    console.log('申请成功，userInfo更新完成');
                });
            }
        })
    });
}

function cancelAcceptOrder(userID,orderID){
    OrdersModel.findOne({_id:orderID,status:orderStatus['发布中']}, function (err, order) {
        var i = 0;
        var count=0;
        tool.managerError(err);
        console.log('查询完成（orderID:' + orderID + ',status:发布中）');
        if(order){
            order.applicants=order.applicants||[];
            var applicants=order.applicants;
            for (i = 0; i < applicants.length; i++) {
                if(applicants[i]===userID){
                    applicants.splice(i);
                    count++;
                    break;
                }
            }
            if(count>0){
                order.save( function (_err) {
                    tool.managerError(_err);
                    console.log('取消申请成功，orders更新完成');
                });
            }else{
                console.log('未申请此订单');
            }

            DbUser.getUserInfo(userID,function(user){
                user.apply_orders = user.apply_orders || [];
                var apply_orders = user.apply_orders;
                var count=0;
                for(var i=0;i<apply_orders.length;i++){
                    if(apply_orders[i]===orderID){
                        apply_orders.splice(i);
                        i--;
                        count++;
                    }
                }
                if(count>0){
                    user.save(function(err){
                        tool.managerError(err);
                        console.log('取消申请成功，userInfo更新完成');
                    });
                }else{
                    console.log('未申请该订单');
                }
            });

        }else{
            console.log('订单不存在');
        }
    });
}

function delOrder(orderID){

    OrdersModel.findByIdAndRemove(orderID, function (err, doc) {
        tool.managerError(err);
        console.log('订单删除成功，'+doc._id);
        var publisher_id=doc.publisher_id;
        var applicants=doc.applicants;
        DbUser.getUserInfo(publisher_id,function(user){

        });
    });
}


exports.ep={
    buildOrder:buildOrder,
    findAllOrderPublishing:findAllOrderPublishing,
    findOneOrderByID:findOrderByOrderID,
    findOrderByUserIDAndStatus:findOrderByUserIDAndStatus,
    acceptOrder:acceptOrder,
    cancelAcceptOrder:cancelAcceptOrder,
    delOrder:delOrder
}












