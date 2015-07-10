/**
 * Created by liqi on 2015/7/3.
 */
exports.ep={
    register:{          //注册
        type:'register',
        user_name:'admin',
        password:'123'
    },
    login:{             //登录
        type:'login',
        user_name:'admin',
        password:'123'
    },
    complete:{
        user_name:'admin',
        province:'浙江省',            //省份
        city:'杭州市',                //城市
        sex:'男',
        age:'26',
        signature:'我是帅锅。'
    },
    order_publish:{
        clock:Date.now(),                 //约定时间
        duration:'2',            //时长
        money:'20',               //费用
        remark:'我是帅锅。'               //备注
    }
}