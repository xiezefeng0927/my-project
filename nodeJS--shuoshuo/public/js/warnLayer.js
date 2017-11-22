/*
提示弹窗
content ====> 提示的内容  string
callback ====> 点击确定/取消后要做的事情 function
bgColor ====> 遮罩层颜色 rgba格式 string  默认黑色半透明
*/

function warnLayer(content, callback, bgcolor){
	var _bgcolor = bgcolor ? bgcolor : "0,0,0,0.5";
	var styleA = "width:100%;height:100%;position:fixed;left:0;top:0;z-index:100000;background-color:rgba("+ _bgcolor +");";
	var styleB = "width:280px;padding-bottom:15px;position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);background-color:#fff;border-radius:5px;-webkit-border-radius:5px;-moz-border-radius:5px;";
	var styleC = "height:30px;line-height:30px;font-size:12px;font-weight:bold;color:#f00;text-indent:2em;border-bottom: 2px solid #ff0;";
	var styleD = "padding: 8px 20px;line-height:24px;font-size:14px;color:#00f;text-align:center;";
	var styleE = "text-align:center;font-size:0;";
	var styleF = "background:none;border:none;outline:none;width:80px;height:30px;line-height:30px;font-size:12px;color:#fff;cursor:pointer;margin:0 10px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;background-color:#ec158f;";
	var styleG = "background:none;border:none;outline:none;width:80px;height:30px;line-height:30px;font-size:12px;color:#fff;cursor:pointer;margin:0 10px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;background-color:#1b191a;";;
	var layerHtml = "";
	//layerHtml += "<div class=\"warn-layer\" style=\""+ styleA +"\">";
	layerHtml += "<div class=\"layer-box\" style=\""+ styleB +"\">";
	layerHtml += "<p class=\"warn-message\" style=\""+ styleC +"\">温馨提醒：</p>";
	layerHtml += "<p class=\"warn-content\" style=\""+ styleD +"\">"+ content +"</p>";
	layerHtml += "<div class=\"layer-buttons\" style=\""+ styleE +"\">";
	layerHtml += "<button class=\"warn-query\" id=\"warn-query\" style=\""+ styleF +"\">确 定</button>";
	layerHtml += "<button class=\"warn-cancel\" id=\"warn-cancel\" style=\""+ styleG +"\">取 消</button>";
	layerHtml += "</div>";
	layerHtml += "</div>";
	//layerHtml += "</div>";
	var cDiv = document.createElement("div");
	cDiv.className = "warn-layer";
	cDiv.setAttribute("style", styleA);
	cDiv.innerHTML = layerHtml;
	document.body.appendChild(cDiv);
	//点击确定
	document.getElementById("warn-query").onclick = function(){
		document.body.removeChild( cDiv );
		if(callback){	
			callback();
		}
	}
	//点击取消
	document.getElementById("warn-cancel").onclick = function(){
		document.body.removeChild( cDiv );
		//callback();
	}
}