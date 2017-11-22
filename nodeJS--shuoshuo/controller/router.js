;
//处理表单上传的信息
var formidable = require("formidable");
//连接数据库并处理数据
var db = require("../model/db.js");
//md5加密
var md5 = require("../model/md5.js");

var fs = require("fs");

var path = require("path");

var gm = require("gm");

//格式化时间
var sd = require("silly-datetime");

//首页
exports.showIndex = function(req, res, next){
	//console.log(123);
	//判断用户是否在登录状态并检索是否有设置头像，没有则使用系统默认头像
	var avatar = "moren.jpg";   //系统默认头像
	if(req.session.login == "1"){
		console.log("我已登录");
		db.findData("users", {"username": req.session.username}, function(err, result){
			avatar = result[0].avatar;
			res.render("index", {
				"islogin": req.session.login == "1" ? true : false,
				"username": req.session.login == "1" ? req.session.username : "",
				"active": "首页",
				"avatar": req.session.login == "1" ? avatar : "moren.jpg"
			});
		})
	}else{
		res.render("index", {
			"islogin": req.session.login == "1" ? true : false,
			"username": req.session.login == "1" ? req.session.username : "",
			"active": "首页",
			"avatar": avatar
		});
	}
	
}

//注册
exports.showRegist = function(req, res, next){
	console.log("zhucechenggong");
	res.render("regist", {
		"islogin": req.session.login == "1" ? true : false,
		"username": req.session.login == "1" ? req.session.username : "",
		"active": "注册"
	});
}

//登录
exports.showLogin = function(req, res, next){
	res.render("login", {
		"islogin": req.session.login == "1" ? true : false,
		"username": req.session.login == "1" ? req.session.username : "",
		"active": "登录"
	});
}

//处理用户注册信息
exports.doRegist = function(req, res, next){
	var registForm = new formidable.IncomingForm();
	
	registForm.parse(req, function(err, fields, files){
		var userName = fields.username;
		var passWord = fields.password;
		var md5_passWord = md5( md5(passWord) + "风之子" );  //密码加密
		db.findData("users", {"username": userName}, function(err, result){
			if(result.length > 0){
				res.json({"result": -2});
				return false;
			}
			db.insertData("users", {
				"username": userName,
				"password": md5_passWord,
				"avatar": "moren.jpg"
			}, function(err, result){
				if(err){
					res.json({"result": -1});
					return false;
				}
				res.json({"result": 1});
			})
		})
	})
};

//处理登陆信息
exports.doLogin = function(req, res, next){
	var loginForm = new formidable.IncomingForm();
	loginForm.parse(req, function(err, fields, files){
		var userName = fields.username;
		var passWord = fields.password;
		console.log(userName + ";" + passWord);
		var md5_passWord = md5( md5(passWord) + "风之子" );
		db.findData("users", {"username": userName}, function(err, result){
			if(err){  //服务器错误
				res.json({"result": -3});
				return false;
			};
			if(result.length <= 0){  //用户名不存在
				res.json({"result": -1});
				return false;
			};
			if(result[0].password != md5_passWord){  //密码错误
				res.json({"result": -2});
				return false;
			}
			//判断提交的信息正确后设置 session 并返回登录成功的值
			req.session.login = "1";
			req.session.username = userName;
			//req.session.avatar = result[0].avatar || "moren.jpg";
			//req.session.cookie.expires = new Date(Date.now() + 600000);  //设置session的过期时间，以毫秒计算
			res.json({"result": 1});
		})
	});
}

//渲染上传图片页面，必须保证此时是登录状态
exports.showUpLoadImage = function(req, res, next){
	if(req.session.login != "1"){
		res.send("非法闯入，请登录后再设置头像!");
		return false;
	}
	res.render("upLoapImage",{
		"islogin": req.session.login == "1" ? true : false,
		"username": req.session.login == "1" ? req.session.username : "",
		"active": "上传"
	});
}

//处理上传图片的业务
exports.doUpLoadImage = function(req, res, next){
	var upLoadForm = new formidable.IncomingForm();
	
	//设置上传图片的路径,这里注意uploadDir的大小写(2017-11-08因为"l"写成大写的查看一个多小时)
	upLoadForm.uploadDir = path.normalize( __dirname + "/../avatar2/" );
	//console.log(upLoadForm.upLoadDir);
	upLoadForm.parse(req, function(err, fields, files){
		console.log(fields);
		//图片的原始地址
		var oldPath = files.picture.path;
		//存放图片的新地址，用登录的session名字给图片命名
		var newPath = path.normalize( __dirname + "/../avatar2/" ) + req.session.username + ".jpg";
		//执行更改图片名称
		console.log(oldPath);
		//console.log(newPath);
		fs.rename(oldPath, newPath, function(err){
			if(err){
				res.send("失败");
				return false;
			}
			req.session.avatar = req.session.username + ".jpg";
			//上传成功直接跳转带切的页面
			res.redirect("/picture/jcrop");
		});
	});
}

//切图片
exports.showJcrop = function(req, res, next){
	if(req.session.login != "1"){
		res.send("非法闯入，请登录后再设置头像!");
		return false;
	}
	res.render("jcrop", {
		"avatar": req.session.avatar
	});
}

//执行图片裁剪
exports.doJcrop = function(req, res, next){
	var W = req.query.W;
	var H = req.query.H;
	var X = req.query.X;
	var Y = req.query.Y;
	console.log(W + ";" + H + ";" + X + ";" + Y);
	gm("./avatar2/" + req.session.avatar).crop(W, H, X, Y).resize(100, 100, "!").write("./avatar/" + req.session.avatar, function(err){
		if(err){
			res.json({"result": -1});
			return false;
		}
		db.updateData("users", {"username": req.session.username},{$set:{"avatar": req.session.avatar}}, function(err, result){
			if(err){
				res.json({"result": -2});
				return false;
			}
			res.json({"result": 1});
		})
	})
}

//处理说说信息
exports.doPublish = function(req, res, next){
	if(req.session.login != "1"){
		res.send("非法闯入，请登录后再发表说说......");
		return false;
	}
	var publishForm = new formidable.IncomingForm();
	
	publishForm.parse(req, function(err, fields, files){
		if(err){
			res.json({"result": -2});
			return false;
		}
		var _content = fields.content;
		console.log(_content);
		db.insertData("contents", {
			"username": req.session.username,
			"content": _content,
			"datetime": sd.format(new Date(), "YYYY-MM-DD HH:mm:ss")   //HH => 表示24小时制; hh => 表示12小时制
		}, function(err, result){
			if(err){
				res.json({"result": -2});
				return false;
			}
			res.json({"result": 1});
		})
	});
}

//获取全部说说的数据
exports.doGetAllContent = function(req, res, next){
	if(req.session.login != "1"){  //没有登录
		res.json({"login": -1});
		return false;
	}
	var page = req.query.page;
	db.findData("contents", {}, function(err, result){
		if(err){
			res.json({"result": -2});
			return false;
		}
		res.json({"result": result});
	},{sort:{datetime: -1},"pageamount": 9, "pages": page})
}

//获取首页说说列表中相对应的个人信息   与显示个人信息公用一个AJAX服务，如果有修改是要注意；
exports.getUserMessage = function(req, res, next){
	var userName = req.query.username;
	var userMessage = [];
	db.findData("users", {"username": userName}, function(err, result){
		if(err){  //服务器错误
			res.json({"result": -2});
			return false;
		}
		var obj = {
			"username": result[0].username,
			"avatar": result[0].avatar,
			"_id": result[0]._id
		}
		userMessage.push(obj);
		res.json({"result": userMessage});
	})
}

//获取全部说说的数量
exports.getAllCount = function(req, res, next){
	db.dataCount("contents", {}, function(count){
		res.json({"result": count});
	})
}

//渲染我的说说页面
exports.showMine = function(req, res, next){
	if(req.session.login != "1"){
		res.send("非法闯入，请登录后再查看......");
		return false;
	}
	//获取路由路径带冒号的值用params加[], 获取get请求或者路由路径问好后面的参数使用query;
	var _person = req.params["person"];
	db.findData("contents", {"username": _person}, function(err, result){  //获取个人说说内容
		if(err){
			res.send("页面加载错误，请稍后重试......");
			return false;
		}
		db.findData("users", {"username": _person}, function(err, person){  //获取个人信息
			if(err){
				res.send("页面加载错误，请稍后重试......");
				return false;
			}
			db.dataCount("contents", {"username": _person}, function(count){   //获取说说数量
				res.render("mine",{
					"islogin": req.session.login == "1" ? true : false,
					"username": req.session.login == "1" ? req.session.username : "",
					"active": "我的说说",
					"count": Math.ceil( count / 9 ),
					"content": result,
					"person": person
				});
			})
		})
		
	},{"sort":{"datetime": -1}, "pageamount": 9, "pages": 0})
};

//获取个人全部说说
exports.getPersonContent = function(req, res, next){
	var username = req.query.username;
	var page = parseInt( req.query.page );
	db.findData("contents", {"username": username}, function(err, result){
		res.json({"result": result});
	}, {"sort": {"datetime": -1}, "pageamount": 9, "pages": page});
};

//获取单条信息
exports.getOneContent = function(req, res, next){
	var userId = req.query.id;
	db.findData("contents", {id:userId}, function(err, result){
		if(err){
			res.json({"result": -1});
			return false;
		}
		res.json({"result": result});
	})
}

//显示用户列表
exports.showUserList = function(req, res, next){
	if(req.session.login != "1"){
		res.send("非法闯入，请登录后再查看......");
		return false;
	}
	res.render("list",{
		"islogin": req.session.login == "1" ? true : false,
		"username": req.session.login == "1" ? req.session.username : "",
		"active": "成员列表"
	});
}

//获取所有已注册用户
exports.getAllUsers = function(req, res, next){
	var page = parseInt( req.query.page );
	db.findData("users", {}, function(err, result){
		if(err){
			res.json({"result": -2});
			return false;
		}
		res.json({"result": result});
	})
}

//获取一个用户已发表的说说数量
exports.getUserMessageCount = function(req, res, next){
	var userName = req.query.username;
	db.dataCount("contents", {"username": userName}, function(count){
		res.json({"count": count});
	})
}
