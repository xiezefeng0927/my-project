;$(function(){
	//初始化fullpage
    $("#fullpage").fullpage({
    	//continuousVertical: true,   //循环滚动
    	anchors: ["page1", "page2", "page3", "page4"],
    	navigation: false,    //是否显示导航条
    	onLeave:function(index, nextIndex, direction) {
    		if(index === 1){
    			$('.first-content').hide(100);
    		}
    		if (nextIndex === 1){
    			$('.first-content').show(0);
    		}
    	},
    	afterLoad: function(anchorLink, index) {  // 滚动到某一屏 index从1开始计算
    		if (index === 1) {  //第一屏
    			
    			$('.login').addClass('bounce');
    			removeSecondPageClass();
    		}
    		if (index === 2) {  //第二屏
    			//console.log("第二屏");
    			$(".explain-1").addClass('shake');
    			$(".explain-2").addClass('flash');
    			$(".explain-3").addClass('swing');
    			$(".explain-4").addClass('bounce');
    			$(".explain-5").addClass('tada');
    			$(".explain-6").addClass('wobble');
    			$(".explain-7").addClass('pulse');
    			$(".explain-8").addClass('flip');
    			$(".explain-9").addClass('slideInRight');
    			$(".explain-10").addClass('slideInLeft');
    			//删除第一屏的类
    			$(".login").removeClass('bounce');
    		}
    		if (index === 3) {   //第三屏
    			removeSecondPageClass();
    		}
    		if (index === 4) {   //第四屏
    			
    		}
    	}
    });
    
    //是否播放音乐
    var isPlay = false;
    var audioPlayer = document.getElementById('audio');
    $('#music').click(function(){
    	if(isPlay) {
    		isPlay = false;
    		$(this).addClass('rotate').removeClass('m-close');
    		audioPlayer.play();
    	}else {
    		isPlay = true;
    		$(this).removeClass('rotate').addClass('m-close');
    		audioPlayer.pause();
    	}
    })
})

function removeSecondPageClass() {
	$(".explain-1").removeClass('shake');
	$(".explain-2").removeClass('flash');
	$(".explain-3").removeClass('swing');
	$(".explain-4").removeClass('bounce');
	$(".explain-5").removeClass('tada');
	$(".explain-6").removeClass('wobble');
	$(".explain-7").removeClass('pulse');
	$(".explain-8").removeClass('flip');
	$(".explain-9").removeClass('slideInRight');
	$(".explain-10").removeClass('slideInLeft');
}
