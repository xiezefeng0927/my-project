;
$(function() {
    // var myScroll;
    //整个页面滚动
    var _scroll = scrollEvent('#page');
	/*
	 *可以挂靠的事件如下：

		beforeScrollStart，在用户触摸屏幕但还没有开始滚动时触发。
		scrollCancel，滚动初始化完成，但没有执行。
		scrollStart，开始滚动
		scroll，内容滚动时触发，只有在scroll-probe.js版本中有效，请参考onScroll event。
		scrollEnd，停止滚动时触发。
		flick，用户打开左/右。
		zoomStart，开始缩放。
		zoomEnd，缩放结束。
	 * */

    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
    //图片懒加载
    $('img.image:not(".specail")').css({"display":"block"}).lazyload();
    
    _scroll.on("scrollStart", function(){
    	//{ threshold : 200 }  提前200px加载
    	$('img.image').css({"display":"block"}).lazyload({ threshold : 200 });
    	_scroll.refresh();
    	
    })
    _scroll.on("scroll", function(){
    	//console.log(123);
    	_scroll.refresh();
    })
    _scroll.on("scrollEnd", function(){
    	$('img.image').css({"display":"block"}).lazyload({ threshold : 200 });
    	_scroll.refresh();
    	
    })
    
//  var options = {};
//	$("#Gallery a").window.Code.PhotoSwipe(options);


    
});

function scrollEvent(scrollElement) {
    var myScroll = new IScroll(scrollElement, {
    	click: true,
        scrollbars: true,
        mouseWheel: true,
        interactiveScrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,

        disablePointer: true, //设置移动端的滚动
        disableTouch: false, //设置移动端的滚动
        disableMouse: false, //设置移动端的滚动
        momentum: true
    });
    return myScroll;
}

(function(window, $, PhotoSwipe){
			
			$(document).ready(function(){
				var s = 0;
				var options = {};
				var aaa = $(".desc-image-a").photoSwipe(options);
				
				$(".image-title").click(function(){
				console.log(aaa);
				console.log(s);
			})
			
			});
			
			
		})(window, window.jQuery, window.Code.PhotoSwipe);