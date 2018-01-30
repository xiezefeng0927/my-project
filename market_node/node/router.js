;
//处理表单上传的信息
var formidable = require("formidable");
//连接数据库并处理数据
var db = require("./db.js");
//md5加密
var md5 = require("./md5.js");

var fs = require("fs");

var path = require("path");

var gm = require("gm");

//格式化时间
var sd = require("silly-datetime");

exports.doGetAppIntroduce = function(req, res, next) {
  db.findData("introduce", {}, function(err, result) {
    if(err) {
      res.send({result: -2});
      return false;
    }
    res.send({"result": result});
  })
};

exports.showMine = function(req, res) {

}
