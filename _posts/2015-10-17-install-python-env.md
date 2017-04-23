---
layout: post
keywords: Start
description: Python Flask环境本地搭建
title: Python Flask环境本地搭建
categories: [日常]
tags: [Flask]
group: archive
icon: globe
categories: 兴趣
---

# Python Flask环境本地搭建

本文介绍Windows下如何从零开始搭建Python + Flask开发环境。

参考：[http://segmentfault.com/a/1190000002450878](http://segmentfault.com/a/1190000002450878)

## 安装Python

访问 [https://www.python.org/]()，进入下载页面，下载Python 2.7系列的WINDOWS版本。

安装之后需要把Python相关的路径加入到PATH环境变量中（假如安装在D:\Python27）：

* `D:\Python27`
* `D:\Python27\Scripts`

*Scripts* 目录还未创建，下面的工具都会默认安装到这个目录下

## 安装setuptools(easy_install)

    wget https://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py
    python ez_setup.py

## 安装virtualenv

使用easy_install命令安装virtualenv:

    easy_install virtualenv
    
> VirtualEnv用于在一台机器上创建多个独立的Python虚拟运行环境，多个Python环境相互独立，互不影响，它能够：
* 在没有权限的情况下安装新套件
* 不同应用可以使用不同的套件版本
* 套件升级不影响其他应用
* 虚拟环境是在Python解释器上的一个私有复制，你可以在一个隔绝的环境下安装packages，不会影响到你系统中全局的Python解释器。

## 安装pip

使用easy_install命令安装pip

    easy_install pip
    
> pip是Python模块管理工具，用于快速安装Python拓展包

## 创建独立工作目录，并初始化独立虚拟环境

    virtualenv Flask
    
*这一步会创建一个Flask的目录，这个目录下的Python环境与系统Python环境隔离*
 
操作完成后，Flask目录下会生成Lib等，在Scripts下也会包含pip、easy_install等工具

## 安装flask

    cd Flask
    pip install flask
    
现在就可以使用flask库了...

### 新建test.py文件

    $vim test.py
    
### 编写test.py文件

    from flask import Flask
    app = Flask(__name__)    
    
    @app.route('/')
    def hello_world():
        return 'Hello World!'
    
    if __name__ == '__main__':
        app.run()
    
### 运行test.py，启动服务器

    python test.py
   
### 测试

浏览器打开：[http://127.0.0.1:5000](http://127.0.0.1:5000)

`Hello World!`