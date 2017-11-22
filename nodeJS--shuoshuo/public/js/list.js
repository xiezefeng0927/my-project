;window.onload = function(){
	
	//获取说说
	allContent( 0,getPage );
}

function allContent(page, callback){
	$.get("/getAllUsers?page=" + page, function(content){
		var datas = typeof content == "string" ? JSON.parse(content) : content;
		if(datas.login == "-1"){  //未登录时显示的页面
			$("body").empty();
			warnLayer("请先登录！",function(){
				window.location.href = "/";
			})
			return false;
		}
		var _content = datas.result;
		console.log(_content);
		var html = "";
		for(var i = 0; i < _content.length; i++){
			$.ajax({
				type:"get",
				url:"/getUserMessageCount?username=" + _content[i].username,
				async:false,   //由于在for循环中执行，将异步变成同步
				success:function(userMessage){
					var messageCount = typeof userMessage == "string" ? JSON.parse(userMessage).count : userMessage.count;
					_content[i].count = messageCount;
					html += '<div class="col-md-5 col-lg-offset-1 my-list">';
					html += '<div class="list-title col-lg-2">';
					html += '<img src="/'+ _content[i].avatar +'" class="list-avatar" alt="" title="" />';
					html += '</div>';
					html += '<div class="col-lg-3 col-lg-offset-1">';	
					html += '<p class="list-username">用户名： '+ _content[i].username +'</p>';
					html += '<p class="message-count">已发表'+ _content[i].count +'条说说</p>';
					html += '<a href="/user/'+ _content[i].username +'" class="list-detail">查看全部说说</a>';
					html += '</div>';
					html += '</div>'
				}
			});
		}
		$("#all-content").empty().append( html );
		//显示分页按钮
		if(callback){
			callback();
		}
	})
}

function getPage(){
	//请求数据的总条数，实现分页
	$.get("/getAllCount", function(count){
		var total = typeof count == "string" ? JSON.parse(count) : count;
		//console.log(total.result);
		var pageTotal = Math.ceil(total.result / 9);
		var pageHtml = "";
		pageHtml += '<div class="page-btns">';
		
		for(var j = 0; j < pageTotal; j++){
			pageHtml += '<span class="page-number">'+ (j + 1) +'</span>';
		}
		pageHtml +='</div>';
		$(pageHtml).insertAfter($("#all-content"));
		$(".page-btns .page-number").eq(0).addClass("active");
		//按钮的翻页功能
		$(document).on("click", ".page-number", function(){
			$(this).addClass("active").siblings().removeClass("active");
			var pageText = parseInt( $(this).html() ) - 1;
			allContent(pageText);
		})
	})
}



//name.replace(/^\s*/g,"");  //去掉左边空格

//name.replace(/\s*$/g,"");  //去掉右边空格

//smSmsModelName.replace(/(^\s*)|(\s*$)/g,"")   //去掉前后空格
