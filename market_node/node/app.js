var express = require('express');

var router = require('./router.js');

var fs = require('fs');

var path = require('path');

var app = express();

app.use(express.static(path.resolve(__dirname, '../dist')));

// 头像(包括用户头像)
app.use('/myavatar', express.static('./avatar'));
// 轮播图
app.use("/lunbo/image", express.static("./images/swiper"));
// 详情图
app.use("/details/image", express.static("./images/detail"));
// 分类图
app.use("/classify", express.static("./images/classify"));
// 品牌图
app.use("/brand", express.static("./images/brand"));

app.all('*',function (req, res, next) {

  res.header('Access-Control-Allow-Origin', '*');

  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');

  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE,OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }

});

app.get('/', function(req, res) {
    var html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
    res.send(html);
});

//设置路由表,相关的页面由 controller/router.js 完成
app.get('/getAppIntroduce', router.doGetAppIntroduce);

app.get("/user/:person", router.showMine); //渲染我的说说页面

// 192.168.43.126
app.listen(8088);
