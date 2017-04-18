;(function(){
   /******瀑布流对象*****/
   var Waterfall = function(config){
       var self = this;
       //默认配置的参数
       this.config = {
       	  "selectId":"wf-waterfall",//瀑布流的id选择器
       	  "width":200,//宽度
       	  "column":4,//列数
       	  "speed":3000//动画的速度
       };
       //手动配置
       if(config){
          $.extend(this.config,config); 
       }
       //设置默认参数
       this.setConfig();
       this.waterfalls();
       //绑定滚动事件
       $(window).scroll(function(){
            var sh = self.wfitems.last().position().top + self.wfitems.last().outerHeight()/2;
            var ch = document.documentElement.clientHeight;
            var cw = document.documentElement.clientWidth;
            var sTop = $(this).scrollTop();
            if(ch + sTop > sh){
                self.wfitems.eq(self.createRandomNumber(1,20)).clone(false).appendTo(self.waterfall).css({
                      width:self.config.width,
                      position:"absolute",
                      top:self.createRandomNumber(-2*ch,-ch),
                      left:self.createRandomNumber(-cw/2,cw/2),
                      opacity:0 
                });
                self.wfitems = self.waterfall.children();
                self.waterfalls();
           }
       });


   };
   /*****原型继承*****/
   Waterfall.prototype = {
   	    /**
   	     * 设置默认的参数
   	     */
        setConfig:function(){
           var _this_ = this; 
           //设置waterfall的宽度
           this.waterfall = $("#" + this.config.selectId);
           var wfwidth = (this.config.width + 2*5)*this.config.column; 
           this.waterfall.css({width:wfwidth});
           //获取wf-waterfall下的所有wf-item
           this.wfitems = this.waterfall.children();
           //获得客户区的宽度和高度
           var cw = document.documentElement.clientWidth;
           var ch = document.documentElement.clientHeight;
           //设置所有wf-item的宽度
           this.wfitems.each(function(){
           	    $(this).css({
           	    	  width:_this_.config.width,
                    position:"absolute",
                    top:_this_.createRandomNumber(0,ch),
                    left:_this_.createRandomNumber(0,cw),
                    opacity:0 
           	    });
           });

        },
        /**
         * { function_description }
         */
        waterfalls:function(){
            var arr = [];
        	  //将this.wfitems转换为数组
            for (var i = 0; i < this.wfitems.size();i++) {
                //定义初始化偏移量都为0
                var offsetw = 0,
                    offseth = 0;
                if(i< this.config.column) {
                     //第一列设置top都为0，arr里存放都为前column个wfitem的高度
                     offsetw = this.wfitems.eq(i).outerWidth()*i;
                     arr.push(this.wfitems.eq(i).outerHeight());
                }else{
                    //获取数组中的最小高度和索引值
                    var obj = this.minHightToIndex(arr);
                    //重新更新arr中的值
                    arr[obj.index] += this.wfitems.eq(i).outerHeight();
                    var w = this.wfitems.eq(i).outerWidth();
                    offsetw = obj.index*w;
                    offseth = obj.height;
                }
                //设置动画
                this.wfitems.eq(i).animate({
                          position:"absolute",
                          top:offseth,
                          left:offsetw,
                          opacity:1
                },this.config.speed);


            }
        },
        /**
         * { 求一个数组中的最小值的索引值 }
         *
         * @param      {<type>}  arr     穿入的数组
         */
        minHightToIndex:function(arr){
        	//判断穿入的参数是否为数组
        	if($.isArray(arr)){
        		var min = arr[0];
	            var index = 0;
	            for (var i = 0; i < arr.length; i++) {
	            	if(arr[i] < min){
	                   min = arr[i];
	                   index = i;
	            	}
	            }
	            return {"height":min,"index":index};
        	}else{
	            return false; 
            }
        },
        createRandomNumber:function(min,max){
        	   var m = max > min?min:max;
        	   var diff = max - min > 0? max -min:min - max;
        	   return m + Math.floor(diff*Math.random());
        },
        scrollUpdate:function(){
             
        } 
   };
   /****将瀑布流对象绑定在window对象***/
   window['waterfall'] = Waterfall;

})()