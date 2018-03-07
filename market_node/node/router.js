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

var dictionary = require('./dictionary.js').DICTIONARY;

// 获取首页信息
exports.doGetAppIntroduce = function(req, res, next) {
  db.findData("introduce", {}, function(err, result) {
    if(err) {
      res.send({result: -2});
      return false;
    }
    res.send({"result": result});
  })
};

// 获取指定ID的商品
exports.doGetClassifyProducts = function(req, res, next) {
  // 获取前台传过来的id
  var id = parseInt(req.query.id);
  var classString = req.query.classify;
  var classify = dictionary[req.query.id];
  // 按类型分类
  if (classString === "classId") {
    db.findData("production", {"classId": id}, function(err, result) {
      if (err) {
        res.send({result: -2});
        return false;
      }
      res.send({"result": result, "classify": classify});
    })
    // 按品牌分类
  }else if (classString === "brandId") {
    db.findData("production", {"brandId": id}, function(err, result) {
      if (err) {
        res.send({result: -2});
        return false;
      }
      res.send({"result": result, "classify": classify});
    })
  }
}

exports.showMine = function(req, res) {

}
