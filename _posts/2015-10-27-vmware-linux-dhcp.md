---
layout: post
keywords: DHCP
description: Linux搭建DHCP服务器
title: Vmware下Linux搭建DHCP服务器
categories: [Linux]
tags: [dhcp]
group: archive
icon: globe
---

本文介绍在vmware中的Linux下搭建DHCP服务器

## 环境

Windows8.1

VMware Workstation 10

Red Hat Enterprise Linux 5

## 安装DHCP服务器

### 检查是否安装了dhcp

    rpm -qa | grep dhcp
    dhcpv6_client-0.10-33.el5
    dhcp-3.0.5-7.el5
    
### 如果没有包含

    cd /media/RHEL_5.3 i386 DVD/Server
    rpm -ivh dhcp-3.0.5-18.el5.i386.rpm 
    
## 配置DHCP

案例：2.3.6 DHCP配置实例1


### 1. 确定服务器的静态IP地址，使用setup菜单完成TCP/IP网络配置；

（1）在命令行运行setup，选择“Network Configuration”->"Edit a device params"->

（2）选择“eth0（eth0）……”

（3）取消“Use DHCP”

（4）配置IP地址和子网掩码为192.168.1.2/255.255.255.0，网关为192.168.1.1

（5）一层层退出

（6）运行ifdown eth0禁用以太网卡

（7）运行ifup eth0启用以太网卡并重新读取配置。

（8）使用ifconfig检查eth0网卡的IP地址配置。

### 2. 禁用vmware的DHCP服务

（1）在vmware程序菜单中，选择Edit – Virtual Network Editor

（2）选择DHCP，点下面的stop，应用。

### 3. 配置Linux DHCP服务器

（1）rpm -q dhcp			查询DHCP软件包是否安装

（2）cp   /usr/share/doc/dhcp-3.0.5/dhcpd.conf.sample   /etc/dhcpd.conf

（3）vim /etc/dhcpd.conf

（4）做以下修改：

    ddns-update-style interim;
    ignore client-updates;
    
    subnet 192.168.1.0 netmask 255.255.255.0 {
    
    # --- default gateway
            option routers                  192.168.1.1;
            option subnet-mask              255.255.255.0;
    
            option nis-domain               "domain.org";
            option domain-name              "domain.org";
            option domain-name-servers      192.168.1.2;
    
            option time-offset              -18000; # Eastern Standard Time
    #       option ntp-servers              192.168.1.1;
    #       option netbios-name-servers     192.168.1.1;
    # --- Selects point-to-point node (default is hybrid). Don't change this unless
    # -- you understand Netbios very well
    #       option netbios-node-type 2;
    
            range dynamic-bootp 192.168.1.100 192.168.1.200;
            default-lease-time 21600;
            max-lease-time 43200;
    
            # we want the nameserver to appear at a fixed address
            host ns {
                    next-server marvin.redhat.com;
                    hardware ethernet 12:34:56:78:AB:CD;
                   fixed-address 207.175.42.254;
            }
    }
    

（5）service dhcpd restart

### 4. 测试

（1）在本机，打开“网络连接”，配置“VMware Network Adapter VMnet1”=>“属性”=>“Internet 协议版本4 (TCP/IPv4)”=>IP地址为“自动获得IP地址和DNS”

（2）稍待片刻，“VMware Network Adapter VMnet1”会重新连接，察看ipconfig

（3）出现以下内容表示成功

    以太网适配器 VMware Network Adapter VMnet1:
    
    连接特定的 DNS 后缀 . . . . . . . : domain.org
    本地链接 IPv6 地址. . . . . . . . : fe80::1403:69e3:867c:9e79%28
    IPv4 地址 . . . . . . . . . . . . : 192.168.1.199
    子网掩码  . . . . . . . . . . . . : 255.255.255.0
    默认网关. . . . . . . . . . . . . : 192.168.1.1

## 总结

* 确定服务器的静态IP地址要根据需求修改，本例中 本机的IP地址必须在192.168.1.1~192.168.1.254内，子网掩码为255.255.255.255.0，默认网关为192.168.1.1，这些配置是直接对DHCP服务器的静态配置。

* subnet 192.168.1.0 netmask 255.255.255.0 {...} 中网络号必须与DHCP服务器的网络号相同。

* 修改服务器静态IP后腰通过`ifdown eth0`和`ifup eth0`重新加载eth0的IP地址


