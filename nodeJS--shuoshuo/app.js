//项目入口文件
var express = require("express");
var app = express();
var router = require("./controller/router.js");
var session = require("express-session");

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

//模板引擎
app.set("view engine", "ejs");
//静态页面
app.use(express.static("./public"));
//静态图片文件夹
app.use("/avatar2", express.static("./avatar2"));
//静态已裁剪完毕的图片文件夹
app.use(express.static("./avatar"));


//设置路由表,相关的页面由 controller/router.js 完成
app.get("/", router.showIndex);   //渲染首页

app.get("/public/regist", router.showRegist);  //渲染注册页

app.get("/user/login", router.showLogin);    //渲染登录页

app.get("/uploadimage", router.showUpLoadImage);  //渲染图片上传页

//切图片
app.get("/picture/jcrop", router.showJcrop);   //渲染图片裁剪页

app.get("/user/:person", router.showMine);   //渲染我的说说页面

app.get("/users/list", router.showUserList);  //渲染用户列表页面

//提交注册信息
app.post("/doRegist", router.doRegist);

//提交登陆信息
app.post("/doLogin", router.doLogin);

//上传头像图片
app.post("/doUpLoadImage", router.doUpLoadImage);

//执行图片的裁剪
app.get("/doJcrop", router.doJcrop);

//接收并处理说说信息
app.post("/publish", router.doPublish);

//获取全部说说的数据
app.get("/getAllContent", router.doGetAllContent);

//获取相对应的个人信息  与显示个人信息公用一个AJAX服务，如果有修改是要注意；
app.get("/getUserMessage", router.getUserMessage);

//获取全部数据的总数量
app.get("/getAllCount", router.getAllCount);

//获取个人的全部说说
app.get("/getPersonContent", router.getPersonContent);

//获取单条信息
app.get("/getOneContent", router.getOneContent);

//获取所有已注册用户
app.get("/getAllUsers", router.getAllUsers);

//获取该用户已发表的说说数量
app.get("/getUserMessageCount", router.getUserMessageCount);

app.listen(3000);