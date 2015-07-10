/**
 * Created by liqi on 2015/6/24.
 */
var data=require('./models/data').ep;

var DbUser=require('./models/user').ep;
var DbOrder=require('./models/order').ep;


//注册
//DbUser.register(data.register);

//登录
//DbUser.login(data.login);

//保存用户信息
//DbUser.save(data.complete);





var orderID='559b32634517c33c17886538';
var userID='559b6e46bb6079381ace4f38';
var orderStatus={
    '发布中':'0',
    '已取消':'1',
    '已终止':'2',
    '已完成':'3',
    '已过期':'4'
};

//发布订单
DbOrder.buildOrder(userID,data.order_publish);

//列出所有发布中的订单
//DbOrder.findAllOrderPublishing();

//根据orderID查找该order的信息
//DbOrder.findOrderByOrderID(orderID);

//列出该用户的某类型订单，根据userID,orderStatus
//DbOrder.findOrderByUserIDAndStatus(userID,orderStatus['发布中']);

//接单 根据userID，orderID
//DbOrder.acceptOrder('559b6e46bb6079381ace4f38',orderID);

//取消接单 根据userID，orderID
//DbOrder.cancelAcceptOrder('559b6e46bb6079381ace4f38',orderID);

//删除订单 根据orderID
//DbOrder.delOrder(orderID);



