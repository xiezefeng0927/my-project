;window.onload = function(){
	//裁剪头像的弹窗
	/*$("#change-avatar").click(function(){
		$("#change-layer").css("display", "block").animate({"width":"100%","left":"0"}, 300, function(){
			$("#change-content").animate({"top":"50%"},200);
		});
	})*/
	//提交说说
	$("#publish").click(function(){
		var publishContent = $("#publish-content").val();
		var reContent = publishContent.replace(/\s+/g,"");  //去掉内容中的所有空格
		if(publishContent == ""){
			warnLayer("发表的内容不能为空！", function(){
				$("#publish-content").focus();
			});
			return false;
		}else if(reContent.indexOf("<script>") > -1 || reContent.indexOf("</script>") > -1){
			warnLayer("内容中含有非法字符，请检查后再发表...", function(){
				$("#publish-content").focus();
			});
			return false;
		};
		$.post("/publish", {"content": publishContent}, function(response){
			var result = typeof response == "string" ? JSON.parse(response) : response;
			if(result.result == 1){  //发表成功
				warnLayer("发表成功！", function(){
					//$("#publish-content").val("");
					window.location.href = "/";
				});
			}else if(result.result == -2){  //服务器错误
				warnLayer("服务器错误，请稍后再重试...");
			}else{   //其他问题导致发表失败
				warnLayer("对不起，内容发表失败...");
			}
		})
	});
	
	//清空内容框
	$("#empty").click(function(){
		$("#publish-content").val("").focus();
	});
	
	//获取说说
	allContent( 0,getPage );
}

function allContent(page, callback){
	$.get("/getAllContent?page=" + page, function(content){
		var datas = typeof content == "string" ? JSON.parse(content) : content;
		if(datas.login == "-1"){  //未登录时显示的页面
			var noLoginHtml = "";
			for(var i = 0; i < 9; i++){
				noLoginHtml += '<div class="col-md-4 one-part">';
				noLoginHtml += '<div class="person-title">';
				noLoginHtml += '<img src="moren.jpg" class="person-avatar" alt="" title="" />';
				noLoginHtml += '<span>系统自己 说:</span>'
				noLoginHtml += '</div>';
				noLoginHtml += '<p class="content">推荐、广告呢？</p>';
				//noLoginHtml += '<span class="messge-detail">查看详情</span>';
				noLoginHtml += '</div>';
			}
			$("#all-content").empty().append( noLoginHtml );
			return false;
		}
		var _content = datas.result;
		var html = "";
		for(var i = 0; i < _content.length; i++){
			$.ajax({
				type:"get",
				url:"/getUserMessage?username=" + _content[i].username,
				async:false,   //由于在for循环中执行，将异步变成同步
				success:function(userMessage){
					var person = typeof userMessage == "string" ? JSON.parse(userMessage).result : userMessage.result;
					_content[i].avatar = person[0].avatar;
					html += '<div class="col-md-4 one-part">';
					html += '<div class="person-title">';
					html += '<img src="/'+ _content[i].avatar +'" class="person-avatar" alt="" title="" />';
					html += '<span>'+ _content[i].username +' 说:</span>'
					html += '</div>';
					html += '<p class="content">'+ _content[i].content +'</p>';
					html += '<span class="messge-detail" data-id='+_content[i]._id  +'>查看详情</span>';
					html += '</div>';
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
