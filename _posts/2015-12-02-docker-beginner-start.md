---
layout: post
keywords: Start
description: Docker安装和基本配置
title: Docker 基础入门
categories: [日常]
tags: [Docker]
group: archive
icon: globe
categories: docker
---

# Docker安装和基本配置

本篇介绍docker安装和初步使用。

## 系统要求

* Linux 3.x内核

* 64位系统

*本文基于Ubuntu14.04*

## 安装Docker

    sudo apt-get install docker.io
    
## 获取镜像

    sudo docker pull ubuntu:14.04
    
## 运行容器

    sudo docker run -it ubuntu:14.04

到这里，docker容器已经在运行了。
后面所有内容，默认采用sudo 方式，这里不予添加了。

## 管理Docker

### 查看当前运行的容器

    root@ubuntu:~# docker ps
    CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                NAMES
    484dcc6335a8        ubuntu:14.04        "/bin/bash"         17 minutes ago      Up 17 minutes       0.0.0.0:80->80/tcp   kickass_engelbart   

可以看到这里绑定了容器的80端口到了主机的80端口

### 查看所有容器

    docker ps -a
    
### 查看所有镜像

    docker images

### 打包容器为镜像

    docker commit -m "Add nginx from ubuntu" -a "chiyiw" 484dcc6335a8 chiyiw/ubuntu-nginx
    
    -m :指定提交说明信息
    -a  :指定用户信息
    484dcc6335a8为被打包的容器id
    chiyiw/ubuntu-nginx为新的镜像名称
    
镜像制作完毕后可以通过下面命令运行

    docker run -it chiyiw/ubuntu-nginx

### 使用Dockerfile

    // 新建index.html文件
    root@ubuntu:~# vim index.html
    <html>
    <head>
        <title>nginx</title>
    </head>
    <body>
    	<h1>Hello Docker!</h1>
    </body>
    </html>
    
    // 编写Dockerfile
    root@ubuntu:~# vim Dockerfile
    FROM ubuntu:14.04
    MAINTAINER chiyiw wp941019@126.com
    RUN apt-get update
    RUN apt-get install -y nginx
    COPY ./index.html /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    
    // 生成镜像
    root@ubuntu:~# docker build -t="chiyiw/ubuntu-nginx" .
    
    // 运行容器
     root@ubuntu:~# docker run -p 80:80 chiyiw/ubuntu-nginx
 
    
#### 关于Dockerfile

* FROM --基础镜像

* MAINTAINER --作者和邮箱

* RUN --初始命令（在这里我们安装了nginx）

* COPY --拷贝文件到容器目录下

* EXPOSE --向外暴露端口

* CMD --运行命令并提供参数（这里启动了nginx）

#### build

* -t :指明镜像名称

#### run

* -p ：端口映射【主机端口：容器端口】，将容器端口映射到主机端口，提供给外界访问

### 拷贝文件到Docker

A. 查看当前运行的容器id（短id）
    $ docker ps

B. 获取整个容器的id，其实键盘tag就可以补全的。 

    $ docker inspect -f  ’{{.Id}}’  步骤A获取的名称或者id

C. 在主机上拷贝文件到docker里面:

    $ sudo cp path-file-host /var/lib/docker/devicemapper/mnt/<容器的id>/rootfs/root
    
