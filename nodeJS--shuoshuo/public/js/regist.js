;
/*
检查复选框是否被选中的方法
原生js:
if(document.getElementById("checkboxID").checked){
	alert("checkbox is checked");
}
jq:
方法一：
if ($("#checkbox-id")get(0).checked) {
	// do something
}
方法二：
if($('#checkbox-id').is(':checked')) {
	// do something
}
方法三：
if ($('#checkbox-id').attr('checked')) {
	// do something
}
*/
$(function(){
	$("#regist").click(function(event){
		var evt = event || window.event;
		evt.preventDefault();
		console.log("submit");
		var userName = $("#inputEmail3").val();
		var passWord = $("#inputPassword3").val();
		//标志  [检查复选框是否选中]  true  OR  false
		var isCheck = $("#check").is(":checked");  //如果选中复选框，则将用户名、密码用localStorage保存于本地
		if(userName == "" || passWord == ""){
			warnLayer("用户名、密码为必填项", function(){
				$("#inputEmail3").focus();
			});
			return false;
		}
		
		var userMessage = {
			"username": userName,
			"password": passWord
		};
		//localStorage.clear();
		var userArray = JSON.parse( localStorage.getItem("userMessage_JSON") ) || [];
		//console.log(userArray);
		$.post("/doRegist", userMessage , function(response){
			var result = typeof response == "string" ? JSON.parse(response) : response;
			if(result.result == 1){  //注册成功
				if(isCheck){  //存储用户信息
					userArray.push( userMessage );
					localStorage.setItem("userMessage_JSON", JSON.stringify(userArray));
				}
				warnLayer("恭喜您，用户注册成功！是否跳转到登陆页面？", function(){
					window.location.href = "/user/login";
				})
			}else if(result.result == "-2"){  //填写的用户名已注册
				warnLayer("该用户名已注册！", function(){
					$("#inputEmail3").val("").focus();
					$("#inputPassword3").val("");
				})
			}else{  //其他情况注册失败
				warnLayer("服务器未响应，请稍后再试...")
			}
		})
		//window.location.href = "/";
		return false;
	});
})