//密码加密
var _crypto = require("crypto");
module.exports = function(password){
	var md5 = _crypto.createHash("md5");
	var md5_password = md5.update(password).digest("base64");
	return md5_password;
}
