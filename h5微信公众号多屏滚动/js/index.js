;
window.onload = function() {
	
	var swiper = new Swiper('.swiper-container', {
		direction: 'vertical',
		loop: true
	});
	
	//是否播放音乐
    var isPlay = false;
    var audioPlayer = document.getElementById('audio');
    document.getElementById("music").onclick = function(){
    	if(isPlay) {
    		isPlay = false;
    		//$(this).addClass('rotate').removeClass('m-close');
    		this.className = "music m-play rotate";
    		audioPlayer.play();
    	}else {
    		isPlay = true;
    		//$(this).removeClass('rotate').addClass('m-close');
    		this.className = "music m-play m-close";
    		audioPlayer.pause();
    	}
    };
	
};
