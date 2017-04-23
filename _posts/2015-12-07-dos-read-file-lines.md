---
layout: post
keywords: Start
description: 描述
title: Dos批处理读取文件的指定行数
categories: [日常]
tags: [Dos批处理]
group: archive
icon: globe
categories: 兴趣
---

# Dos批处理读取文件的指定行数

    set "fromfile=%0"
    set "tofile=tofile.txt"
    set /a min=3,max=10
    
    setlocal enabledelayedexpansion
    
    for /f "skip=%min% tokens=1* delims=:" %%a in ('findstr /n .* "!fromfile!"') do (
       if %%a leq %max% echo;%%b
    )>>!tofile!

* 通过`set "file=a.txt"`可以设置`file`的值为`a.txt`，之后可以通过`!file!`使用file变量的值,`/a`表示设置类型为数值型。例中skip表示跳过前三行

* `%0`代表文件本身,`%1`代表第一个参数，`%2...`

* 数值比较   
EQU - 等于
NEQ - 不等于
LSS - 小于
LEQ - 小于或等于
GTR - 大于
GEQ - 大于或等于

* for循环
:: for循环中的变量用`%%`，`%%a,%%b..`,分别代表在`in(?,?)`中收到的第一列，第二列，列通过制定字符来划分，例如2015-12-07可以通过-来区分，默认分隔符是"空格键"，"Tab键"，"回车键"，这里delims指定了通过`:`分割

* `@`表示不输出

* `rem`或`::`为注释，面向用户

* `@rem` 可以实现不输出的注释，面向程序员
