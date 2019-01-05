var log = function() {
    // body...
    console.log.apply(console, arguments);
}
$(function() {
    // body...
    /** 获取随机颜色：闭包调用自身，通过三元运算符递归，随机生成1个字符，然后再串到一起，直到生成6个结束并返回。
    首先从getRandomColor函数里面传过来一个空字符串，
    连接上'0123456789abcdef'字符串里面随机的一个字母，也就是这段代码：color += '0123456789abcdef'[Math.floor(Math.random()*16)]；
    然后判断color这个变量的长度是不是为6，
    因为标准的颜色值是一个长度为6的字符串，第一次执行为1，所以不满足
    最后执行问号后面的arguments.callee(color)；自调用。
    */
    var getRandomColor = function() {
        return '#' +
            (function(color) {
                return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color);
            })('');
    }

    //填充ul下的li颜色，end()后,li的点击事件委托给ul
    $('#prize').children().each(function() {
        var li = $(this);
        li.css("background-color", getRandomColor());
    }).end().on("click", "li", function(event) {
    	//当前被点击的li以及颜色
        var target = $(event.target);
        var color = target.attr('style');

        //解除当前li点击事件
        target.parent().unbind('click');

        var request = {
            type: 'GET',
            url: './flipBrand.php',
            dataType: 'json',
            cache: false,
            //回调处理反转动作
            success: function(json) {  
                target.flip({
                	//反转样式
                    direction: 'rl',
                    //奖品信息（抽中）
                    content: json.yes,
                    color: color,
                    ////反转动作结束后，继续回调处理当前li的点击事件
                    onEnd: function() {
                    	////更换其他li鼠标指针，end()后增加当前li的点击事件
                        target.css({ "font-size": "22px", "line-height": "100px" }).siblings().css({"cursor": "default"}).end().on("click", function(event) {
                        	////解除当前li的点击事件
                        	target.unbind('click');
                        	////更新其他li内容
                            target.siblings().each(function(index) {
                                var lost = $(this);
                                lost.flip({
                                	////反转样式
                                    direction: 'bt',
                                    color: 'lightgrey',
                                    ////奖品信息（未抽中）
                                    content: json.no[index], 
                                    ////反转动作结束后,回调处理更新其他li样式
                                    onEnd: function() {
                                        lost.css({ "font-size": "22px", "line-height": "100px", "color": "#333" });
                                    }
                                });
                            });
                        });
                    }
                });
            }
        }
        $.ajax(request);
    });
})