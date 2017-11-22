;
$(function(){
	//console.log("login");
	//查看是否有将用户名、密码缓存在本地
	var userArray = JSON.parse( localStorage.getItem("userMessage_JSON") ) || [];
	var userName = "";
	var passWord = "";
	//console.log(typeof userArray);
	if(userArray != null && userArray.length > 0){
		console.log("have");
		userName = userArray[0].username;
		passWord = userArray[0].password;
		$("#inputEmail3").val( userName );
		$("#inputPassword3").val( passWord );
	}
	
	//登录
	$("#login").click(function(evt){
		var evt = evt || window.event;
		evt.preventDefault();
		console.log("click");
		var username = $("#inputEmail3").val();
		var pwd = $("#inputPassword3").val();
		var isCheck = $("#check").is(":checked");
		if(username == "" || pwd == ""){
			warnLayer("用户名、密码为必填项", function(){
				$("#inputEmail3").focus();
			});
			return false;
		}
		var userMessage = {
			"username": username,
			"password": pwd
		};
		
		$.post("/doLogin", userMessage, function(response){
			var result = typeof response == "string" ? JSON.parse(response) : response;
			if(result.result == 1){  //登录成功
				if(isCheck && username != userName ){
					userArray.push(userMessage);
					localStorage.setItem("userMessage_JSON", JSON.stringify(userArray));
					console.log(localStorage.getItem("userMessage_JSON"));
				}
				window.location.href = "/";
			}else if(result.result == -1){  //用户不存在
				warnLayer("改用户名不存在，是否注册？", function(){
					window.location.href = "/public/regist";
				});
				return false;
			}else if(result.result == -2){  //密码错误
				warnLayer("密码错误，请重新输入", function(){
					$("#inputPassword3").val("").focus();
				});
				return false;
			}else{  //其他错误或者服务器出错
				warnLayer("服务器未响应，请稍后再试...");
				return false;
			}
		})
	});
})
