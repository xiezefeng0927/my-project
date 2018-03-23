
;
function successCallBack(result) {
	if (!!document.getElementById("jsonp-request")) {
		document.getElementsByTagName("head")[0].removeChild(document.getElementById("jsonp-request"));
	}
	createAry(result);
	return;
}

function jsonpRequest (requestUrl) {
	var oS = document.createElement("script");
	var baseUrl = requestUrl + "?callback=" + successCallBack;
	oS.src = baseUrl;
	oS.id = "jsonp-request";
	document.getElementsByTagName("head")[0].appendChild(oS);
	return true;
}

var ary = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];

function createAry(list) {
	var $array = [];
	for (var i = 0; i < list.length; i++) {
		var obj = {};
		for (var j = 0; j < list[i].length; j++) {
			obj[ary[j]] = list[i][j];
		}
		$array.push(obj);
	}
	if (!!vm) {
		vm.success($array);
	}
	return $array;
}

;
