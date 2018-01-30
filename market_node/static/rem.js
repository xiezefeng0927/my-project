/*
    移动端字体自适应、高宽度根据根元素按倍数计算
*/

;
(function(designWidth, maxWidth) {
    var doc = document,
        win = window;
    var docEl = doc.documentElement;
    var tid;
    var rootItem, rootStyle;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        if (!maxWidth) {
            maxWidth = 540;
        };
        // if (width > maxWidth) {
        //     width = maxWidth;
        // }

        var rem = width * 20 / designWidth;

        // 兼容UC
        rootStyle = "html{font-size:" + rem + "px!important}";
        rootItem = document.getElementById("rootsize") || document.createElement("style");
        if (!document.getElementById("rootsize")) {
            document.getElementsByTagName("head")[0].appendChild(rootItem);
            rootItem.id = "rootsize";
        }
        if (rootItem.styleSheet) {
            rootItem.styleSheet.disabled || (rootItem.styleSheet.cssText = rootStyle)
        } else {
            try {
                rootItem.innerHTML = rootStyle
            } catch (f) {
                rootItem.innerText = rootStyle
            }
        }
        // END
        docEl.style.fontSize = rem + "px";
    };
    refreshRem();

    win.addEventListener("resize", function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);

    win.addEventListener("pageshow", function(e) {
        if (e.persisted) { //浏览器后退时重新计算
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === "complete") {
        doc.body.style.fontSize = "16px";
    } else {
        doc.addEventListener("DOMContentloaded", function(e) {
            doc.body.style.fontSize = "16px";
        }, false);
    }
})(640, 640)