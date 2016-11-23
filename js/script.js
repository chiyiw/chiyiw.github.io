// 自定义的javascript脚本
window.onload = function(){
    setLeftNav();
    alterClassByTagName("pre","prettyprint prettyprint linenums");
    prettyPrint();

    var theme = "black";
    setTheme(theme);
    alterPathAttribute(theme);

    document.getElementById('bulb').onclick=function(){
        if (theme == "black"){
            theme = "white";
        }else{
            theme = "black";
        }    
        setTheme(theme);
        alterPathAttribute(theme);
    }

    // var ele = document.getElementsByClassName("nav-left")[0];
    // fadeOut(ele);
}

function setLeftNav(){
    var screenWidth = document.body.clientWidth;
    var leftBlankWidth = screenWidth/2-(850/2); // 左边还剩的宽度
    if (leftBlankWidth < 160) {
        alterAttributeByClassName('nav-left', 'style', 'display:none');
    } else {
        alterAttributeByClassName('nav-left', 'style', 'margin-left:'+(leftBlankWidth-154)+'px');
    }
}

window.onresize = function(){
        
    setLeftNav();
}

// function fadeOut(ele){
    
//    var i = 0;
//    var id = setInterval(function(){
//         i++;
//         ele.style.opacity = parseFloat(i)/100;
//         if (i > 99) {
//             clearInterval(id);
//         }
//         if (i > 101) {
//             alert(i);
//         }
//    }, 15);
// }

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
        document.body.setAttribute("class","theme-black");
        alterClassByTagName("blockquote","black-blockquote");
        var link = document.getElementsByTagName("link")[1];
        link.setAttribute("href","/css/desert-cmd.css");

        alterAttributeByClassName("highlighter-rouge","style","background:#333;color:#f2f2f2");
        alterAttributeByClassName("site-title","style","color:#eee");
        alterAttributeByClassName("page-link","style","color:#eee");
        alterAttributeByClassName("post-link","style","color:#eee");
        alterAttributeByClassName("ds-post","style","background:#333");
        alterAttributeByClassName("ds-textarea-wrapper","style","background:#252525;border-width:1px");
        alterAttributeByClassName("ds-post-options","style","background:#555");
        alterAttributeByClassName('site-nav','style','background:#444');

    } else {
        document.body.setAttribute("class","theme-white");
        alterClassByTagName("blockquote","white-blockquote");
        var link = document.getElementsByTagName("link")[1];
        link.setAttribute("href","/css/prettify-chiyiw.css");

        alterAttributeByClassName("highlighter-rouge","style","background:#fffde9;color:#000");
        alterAttributeByClassName("site-title","style","color:#000");
        alterAttributeByClassName("page-link","style","color:#000");
        alterAttributeByClassName("post-link","style","color:#000");
        alterAttributeByClassName("ds-post","style","background:#eee");
        alterAttributeByClassName("ds-textarea-wrapper","style","background:#ddd;border-width:0px");
        alterAttributeByClassName("ds-post-options","style","background:#eaeaea");
        alterAttributeByClassName('site-nav','style','background:#f9f9f5');

    }
}

// 通过Tag替换class
function alterAttributeByClassName(classname,attrname,attrvalue){
    var eles = document.getElementsByClassName(classname);
    for (var i = 0; i < eles.length; i++){
        eles[i].setAttribute(attrname,attrvalue);
    }
}


function alterPathAttribute(theme){
    var eles = document.getElementsByTagName('path');
    if (theme == 'black'){
        for (var i = 0; i < eles.length; i++){
            eles[i].setAttribute('fill','#eee');
        }
    }else{
        for (var i = 0; i < eles.length; i++){
            eles[i].setAttribute('fill','#444');
        }
    }
}
