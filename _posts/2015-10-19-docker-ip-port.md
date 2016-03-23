---
layout: post
keywords: Start
description: Docker内部访问的三种方式
title: Docker内部访问的三种方式
categories: [日常]
tags: [Docker]
group: archive
icon: globe
---

# Docker内部访问的三种方式

## Dockerfile是这样的

    FROM ubuntu:14.04
    MAINTAINER chiyiw wp941019@126.com
    RUN apt-get update
    RUN apt-get install -y nginx
    COPY ./www /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]

## 运行Docker容器

    docker run -p 8000:80 chiyiw/ubuntu-nginx:v2

这里将容器的80到端口映射到主机到8000端口

## 此时查看ifconfig

    docker0   Link encap:以太网  硬件地址 56:84:7a:fe:97:99  
              inet 地址:172.17.42.1  广播:0.0.0.0  掩码:255.255.0.0
              inet6 地址: fe80::5484:7aff:fefe:9799/64 Scope:Link
              UP BROADCAST RUNNING MULTICAST  MTU:1500  跃点数:1
              接收数据包:120 错误:0 丢弃:0 过载:0 帧数:0
              发送数据包:115 错误:0 丢弃:0 过载:0 载波:0
              碰撞:0 发送队列长度:0 
              接收字节:10074 (10.0 KB)  发送字节:13695 (13.6 KB)
    
    eth0      Link encap:以太网  硬件地址 00:0c:29:da:f3:8e  
              inet 地址:192.168.126.133  广播:192.168.126.255  掩码:255.255.255.0
              inet6 地址: fe80::20c:29ff:feda:f38e/64 Scope:Link
              UP BROADCAST RUNNING MULTICAST  MTU:1500  跃点数:1
              接收数据包:34713 错误:0 丢弃:0 过载:0 帧数:0
              发送数据包:16961 错误:0 丢弃:0 过载:0 载波:0
              碰撞:0 发送队列长度:1000 
              接收字节:35391719 (35.3 MB)  发送字节:2047770 (2.0 MB)
    
    lo        Link encap:本地环回  
              inet 地址:127.0.0.1  掩码:255.0.0.0
              inet6 地址: ::1/128 Scope:Host
              UP LOOPBACK RUNNING  MTU:65536  跃点数:1
              接收数据包:3845 错误:0 丢弃:0 过载:0 帧数:0
              发送数据包:3845 错误:0 丢弃:0 过载:0 载波:0
              碰撞:0 发送队列长度:0 
              接收字节:9644466 (9.6 MB)  发送字节:9644466 (9.6 MB)
    
    veth29a2  Link encap:以太网  硬件地址 ae:fa:c2:da:78:e7  
              inet6 地址: fe80::acfa:c2ff:feda:78e7/64 Scope:Link
              UP BROADCAST RUNNING  MTU:1500  跃点数:1
              接收数据包:12 错误:0 丢弃:0 过载:0 帧数:0
              发送数据包:15 错误:0 丢弃:1 过载:0 载波:0
              碰撞:0 发送队列长度:1000 
              接收字节:872 (872.0 B)  发送字节:1108 (1.1 KB)

包含了三个级别的地址：

* docker0:容器直接地址
* eth0:网卡地址，这个地址可以被外部直接访问，即虚拟机外部可以通过这个地址访问到虚拟机
* lo:虚拟机本地地址，只有本地可以访问

## 那么我们现在可以怎么访问我们容器里面的nginx下的html？

* docker0:
`http://172.17.42.1`或者`http://172.17.42.1:8000`<br/>
这个地址是容器自己分配的，所以本身绑定到就是80端口，我们知道80端口是http默认端口，所以访问8000端口失败时，会自动转到80端口

* eth0:
`192.168.126.133:8000`<br/>
使用物理网卡地址访问，因为绑定了docker外部的8000到内部的80端口，所以访问主机的8000端口可以访问到docker。<br/>
如果我们绑定到主机的也是80端口，即这样写`docker run -p 80:80 chiyiw/ubuntu-nginx:v2`，则我们可以直接通过`192.168.126.133`访问，因为80是默认端口，所以自动访问主机的80端口，而此时我们将docker的对外端口绑定在80端口上，所以就能连接到docker内部了。<br/>
当然这样会存在一个问题，就是如果主机本身开启了80端口的服务，比如也运行这nginx，此时就算`docker run` 绑定到是外部的80端口，也无法访问到docker内部，而此时可以通过docker0直接访问，之前说过了，docker0是专门分配给docker的，它访问docker内部的端口直接就是Dockerfile中对外暴露的端口。

* lo:
`127.0.0.1:8000`或者`localhost:8000`<br/>
这个和eth0类似，只是将网卡的地址对应到本地127.0.0.1而已，访问规则同eth0，只是无法其他计算机访问。

## 测试

* 本机浏览器：
  * lo `http://127.0.0.1:8000`
  * eth0	`http://192.168.126.133:8000`
  * docker0	`http://172.17.42.1`

* 另一台计算机：
  * eth0	`http://192.168.126.133:8000`


