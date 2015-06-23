/**
 * Created by liqi on 2015/6/11.
 */


var ku=(function ($) {
    var $body=$('body'),
        viewUrl='views/',   //视图的主路径
        zIndex={            //多个绝对定位的z轴级别
            pageNow:    1,  //当前显示页
            header:     1,  //头部
            nav:        1,  //导航
            loading:    10  //加载动画
        }
    ;


    return {
        init: function () {
            //页面切换功能初始化
            //第一步增加切换动画
            //第二步，下一页不存在时检查该脚本中的缓存
            //第三步，如果缓存不存在，使用ajax去获取视图
            //视图的文件命名为page-name的值，要获取到的子视图为page-sub-name
            function pageInit() {
                var $pages = $('[page-name]'),
                    pageZ = zIndex.pageNow,
                    tpls = {},
                    status=true //true待命阶段、false执行中
                ;

                function pageNext($next, $now) {
                    status=false;
                    pageZ++;
                    $next.css('z-index', pageZ);
                    $now.css('z-index', pageZ - 1);
                    $next.show().addClass('pageFromRightToCenter');
                    setTimeout(function () {
                        $next.removeClass('pageFromRightToCenter');
                        $now.hide();
                        status=true;
                    }, 400);
                }

                function pagePrev($prev, $now) {
                    status=false;
                    pageZ--;
                    $prev.css('z-index', pageZ);
                    $now.css('z-index', pageZ + 1);
                    $prev.show();
                    $now.addClass('pageFromCenterToRight');
                    setTimeout(function () {
                        $now.removeClass('pageFromCenterToRight');
                        $now.hide();
                        status=true;
                    }, 400);
                }

                function toLoad(view, success) {
                    var parts = view.split(/\s/),
                        selector = parts[1]
                        ;
                    ku.ui.loading.show();
                    setTimeout(function () {
                        $.get(viewUrl + view, function (response) {
                            ku.ui.loading.hide();
                            success($(selector ?
                                $(document.createElement('div')).html(response).find(selector).html() :
                                response));
                        });
                    }, 2000);

                }

                $pages.each(function (index, item) {
                    var $page = $(this),
                        pageName = $page.attr('page-name')
                        ;
                    $page.on('click', '[page-prev]', function () {
                        var $this = $(this),
                            prev = $this.attr('page-prev'),
                            $prev = $page.find('[page-sub-name=' + prev + ']')
                            ;
                        $prev = $prev.length > 0 || tpls[prev] ? $prev || tpls[prev].clone() : null;
                        if ($prev) {
                            pagePrev($prev, $this);
                        } else {
                            toLoad(pageName + '.html ' + prev, function ($dom) {
                                tpls[prev] = $dom;
                                $page.append($dom);
                                pagePrev($dom, $this);
                            });
                        }
                    });

                    $page.on('click', '[page-next]', function () {
                        var $this = $(this),
                            next = $this.attr('page-next'),
                            $next = $page.find('[page-sub-name=' + next + ']')
                            ;
                        $next = $next.length > 0 || tpls[next] ? $next || tpls[next].clone() : null;
                        if ($next) {
                            pageNext($next, $this);
                        } else {
                            toLoad(pageName + '.html #' + next, function ($dom) {
                                tpls[next] = $dom;
                                $page.append($dom);
                                pageNext($dom, $this);
                            });
                        }
                    });
                });
            }

            pageInit();
        },
        ui:{
            modalSimp:function(text){
                var $dom=$('<div class="modal modal-simp ani-modal-simp"></div>');
                $dom.html(text);
                if($body.find('.modal-simp').length<=0){
                    $body.append($dom);
                }
                var $dom_live=$body.find('.modal-simp');
                setTimeout(function () {
                    $dom_live.remove();
                },3000);
            },
            //加载中动画
            //api:{
            //  status      当前状态,
            //  show()      显示
            //  hide()      隐藏并删除
            // }
            loading: (function () {
                var $dom=$('<div class="loading"><div class="loading-img"></div></div>'),
                    _status='hide';
                $dom.css('z-index',zIndex.loading);
                return {
                    status:_status,
                    show: function () {
                        _status='show';
                        $body.append($dom);
                    },
                    hide: function () {
                        _status='hide';
                        $dom.remove();
                    }
                };
            })()
        },
        Url:(function () {
            var objUrl= function (url) {
                this.url=url||window.location.href;//原始url
                this.href="";//？之前
                this.params={};//？对象
                this.achor="";//锚
                this._init();//初始化
            };
            objUrl.prototype={
                _init: function () {
                    var url=this.url;
                    var index=url.indexOf('#');
                    if(index>0){
                        this.achor=url.substr(index+1);
                        url=url.substring(0,index);
                    }
                    index=url.indexOf('?');
                    if(index>0){
                        this.href=url.substring(0,index);
                        url=url.substr(index+1);
                        var parts=url.split('&');
                        for(var i = 0,len=parts.length;i<len;i++){
                            var kv=parts[i].split('=');
                            this.params[kv[0]]=kv[1];
                        }
                    }else{
                        this.href=url;
                        this.params={};
                    }
                    return this;
                },
                //设置param
                set: function (k, v) {
                    this.params[k]=v;
                    return this;
                },
                //获取param
                get: function (k) {
                    return this.params[k];
                },
                //移除param
                remove: function (k) {
                    this.params[k]=undefined;
                    return this;
                },
                //重新获取url
                getUrl: function () {
                    var href=this.href;
                    var params=this.params;
                    var paramsArr=[];
                    for(var k in params){
                        if(params[k]){
                            paramsObj.push(k+'='+params[k]);
                        }
                    }
                    if(paramsArr.length>0){
                        href+='?'+paramsArr.join('&');
                    }
                    if(this.achor.length>0){
                        href+='#'+this.achor;
                    }
                    return href;
                }
            };
            return new objUrl();
        })() ,
        //用于模板中的值的替换
        //index:{
        //  html    html字符串
        //  fields  键值的对象
        // }
        tpl:function(html,fields){
            var backupHtml=html;
            var names={};//存储模板中的名称与对象的对应关系

            function getFirstName(html,names){
                var first=0,last= 0;
                first=html.indexOf('{');
                last=html.indexOf('}');
                if(first>=0 && last>0) {
                    var oldObj = html.substring(first, last+1);
                    var newObj = oldObj.replace(/\s|{|}/g, '');
                    names[newObj] = oldObj;
                    return html.substr(last+1);
                }else{
                    return '';
                }
            }

            while(html.length>2){
                html=getFirstName(html,names);
            }

            for(var i in names){
                if(names.hasOwnProperty(i)){
                    backupHtml=backupHtml.replace(new RegExp(names[i],'g'),fields[i]||'');
                }
            }
            return backupHtml;
        }
    }
})(Zepto);



