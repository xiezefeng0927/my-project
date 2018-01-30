var MongoClient = require("mongodb").MongoClient;

var settings = require("./settings.js");

function _connect(callback) {
    var url = settings.dbUrl;
    MongoClient.connect(url, function(err, db) {
        console.log("连接成功！");
        callback(err, db);
    });
}
//初始化时给集合创建索引
function init() {
    _connect(function(err, db) {
        if (err) {
            console.log(err);
            return false;
        }
        db.collection("users").createIndex({
            "username": 1
        }, null, function(err, result) {
            if (err) {
                console.log(err);
                return false;
            }
            console.log("索引创建成功");
        })
    })
}
//init();

/*
向数据库插入数据

collectionName ====> 插入的集合名称
json ====> 插入的数据
callback ====>插入后的回调函数
*/

exports.insertData = function(collectionName, json, callback) {
    _connect(function(err, db) {
        if (err) {
            callback("数据库连接失败", null);
            return false;
        }
        db.collection(collectionName).insert(json, function(err, result) {
            callback(err, result);
            db.close(); //关闭数据库
        })
    })
}

/*
向数据库查找数据

collectionName ====> 查找的集合名称
json ====> 查找的条件
callback ====>查找后的回调函数
page ====>分页的条件

*/
exports.findData = function(collectionName, json, callback, page) {
    if (arguments.length < 3) {
        callback("find函数至少接收3个参数", null);
        return false;
    }
    var json = json || {};
    var skipNumber = 0;
    var limitNumber = 0;
    var sort = {};
    var result = []; //数据查找的结果
    if (page) {
        //过滤的数量
        skipNumber = parseInt(parseInt(page.pageamount) * parseInt(page.pages)) ? parseInt(parseInt(page.pageamount) * parseInt(page.pages)) : 0;
        //显示的数量
        limitNumber = parseInt(page.pageamount) ? parseInt(page.pageamount) : 0;
        //排序的方式
        sort = page.sort || {};
        console.log(skipNumber + "::::" + limitNumber);
    }
    _connect(function(err, db) {
        if (err) {
            callback("数据查找失败", null);
            return false;
        }
        var cursor = db.collection(collectionName).find(json).limit(limitNumber).skip(skipNumber).sort(sort);

        cursor.each(function(err, doc) {
            if (err) {
                callback(err, null);
                return false;
            }
            if (doc != null) {
                result.push(doc);
            } else {
                //当cursor迭代完毕后做的事情
                callback(null, result);
                db.close();
            }
        });
    });
};

/*
向数据库更新数据

collectionName ====> 更新的集合名称
json1 ====> 更新的条件
json2 ====> 更新的数据
callback ====>查找后的回调函数

*/
exports.updateData = function(collectionName, json1, json2, callback) {
    _connect(function(err, db) {
        if (err) {
            callback("更新数据失败", null);
            return false;
        }
        db.collection(collectionName).updateMany(json1, json2, function(err, result) {
            if (err) {
                callback("更新数据失败", null);
                return false;
            }
            callback(err, result);
            db.close();
        })
    });
};

/*
向数据库删除数据

collectionName ====> 删除的集合名称
json ====> 删除的条件
callback ====>删除后的回调函数

*/
exports.deleteData = function(collectionName, json, callback) {
        _connect(function(err, db) {
            if (err) {
                callback("删除数据失败", null);
                return false;
            }
            db.collection(collectionName).deleteMany(json, function(err, result) {
                if (err) {
                    callback("删除数据失败", null);
                    return false;
                }
                callback(err, result);
                db.close();
            })
        })
    }
    /*
    查找集合中的数量总数量

    collectionName ====> 查找的集合名称
    json ====> 查找的条件
    callback ====>查找后的回调函数
    */
exports.dataCount = function(collectionName, json, callback) {
    var json = json || {};
    _connect(function(err, db) {
        if (err) {
            callback("查找数据失败", null);
        }
        db.collection(collectionName).count(json).then(function(count) {
            callback(count);
            db.close();
        });
    });
}