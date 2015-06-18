/**
 * Created by liqi on 2015/6/11.
 */


var ku=(function ($) {
    var $body=$('body');

    var section= (function () {
        var config={
            show:'.section-show',
            hide:'.section-hide',
            current_z:'0',
            other_z:'10'
        };
        var $sections=$('[section]');

        $('#mainPage').css('z-index',config.current_z);
        $sections.on('tap','[section-prev]', function () {
            var $this=$(this),
                target=$this.attr('section-target')
            ;

        });

        //显示前一个
        function sectionPrev($current,target){
            var $target=$('#'+target);//目标
            $current.css('z-index','0');
            $target.css('z-index','10').addClass('.');
        }
    })();

    return {
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
            }
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



//ku.tpl('<a>{ name }</a>',{name:'woo'});