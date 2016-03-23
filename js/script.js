// 自定义的javascript脚本
window.onload = function(){
    alterClassByTagName("pre","prettyprint prettyprint linenums");
    prettyPrint();

    alterClassByTagName("blockquote","black-blockquote");
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