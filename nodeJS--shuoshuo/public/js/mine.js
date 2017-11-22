;window.onload = function(){
	//裁剪头像的弹窗
	/*$("#change-avatar").click(function(){
		$("#change-layer").css("display", "block").animate({"width":"100%","left":"0"}, 300, function(){
			$("#change-content").animate({"top":"50%"},200);
		});
	})*/
	console.log(window.location.pathname);
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
	
	//说说翻页
	$(".page-btns .page-number").eq(0).addClass("active");
	$(document).on("click", ".page-number", function(){
		$(this).addClass("active").siblings().removeClass("active");
		var pageText = parseInt( $(this).html() ) - 1;
		var username = $(this).parent().attr("username");
		allContent(pageText, username);
	})
}

function allContent(page, username){
	$.get("/getPersonContent?page=" + page + "&username=" + username, function(content){
		var datas = typeof content == "string" ? JSON.parse(content) : content;
		var _content = datas.result;
		var html = "";
		for(var i = 0; i < _content.length; i++){
			$.ajax({
				type:"get",
				url:"/getUserMessage?username=" + _content[i].username,
				async:false,
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
	})
}



//name.replace(/^\s*/g,"");  //去掉左边空格

//name.replace(/\s*$/g,"");  //去掉右边空格

//smSmsModelName.replace(/(^\s*)|(\s*$)/g,"")   //去掉前后空格
