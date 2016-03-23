// 自定义的javascript脚本
window.onload = function(){
    alterClassByTagName("pre","prettyprint prettyprint linenums");
    prettyPrint();

    setTheme("black");
}

// 通过Tag替换class
function alterClassByTagName(tagname,classname){
    var eles = document.getElementsByTagName(tagname);
    for (var i = 0; i < eles.length; i++){
        eles[i].setAttribute("class",classname);
    }
}

// 替换innerHTML
function alterInnerHTML(classname,str){
    var eles = document.getElementsByClassName(classname);
    for (var i = 0; i < eles.length; i++){
        eles[i].innerHTML= str;
    }
}

function setTheme(theme){
    if (theme == 'black'){
        alterClassByTagName("blockquote","black-blockquote");
        var link = document.getElementsByTagName("link")[1];
        link.setAttribute("href","/css/desert-cmd.css");
    } else {
        document.body.setAttribute("class","theme-white");
        alterClassByTagName("blockquote","white-blockquote");
        alterAttributeByClassName("highlighter-rouge","style","background:#f2f2f2;color:#000");
        alterAttributeByClassName("site-title","style","color:#000");
        alterAttributeByClassName("page-link","style","color:#000");
        alterAttributeByClassName("post-link","style","color:#000");

        var link = document.getElementsByTagName("link")[1];
        link.setAttribute("href","/css/prettify-cmd.css");
    }
}

// 通过Tag替换class
function alterAttributeByClassName(classname,attrname,attrvalue){
    var eles = document.getElementsByClassName(classname);
    for (var i = 0; i < eles.length; i++){
        eles[i].setAttribute(attrname,attrvalue);
    }
}