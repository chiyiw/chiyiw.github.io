# Mitmproxy使用笔记

## 安装

在github下载最新的包*.tar.gz，解压到任意目录，包含三个可执行文件。

mitmproxy，mitmdump，mitmweb

三者的功能和用法一样，只是呈现方式不同，mitmproxy带交互界面, dump是纯命令行，mitmweb是web端（http://localhost:8081）

## 初级使用

- -p port 设置监听端口

```bash
./mimtproxy -p 9527
```

测试， 另开窗口：

```bash
curl -x http://127.0.0.1:9527 baidu.com
```

可以在窗口中查看到请求。

* 快捷键(请求列表界面)：

  ? 显示帮助

  enter 查看请求

  q  退出/返回

  e  开/关日志面板

  z  清空列表

* 快捷键（请求详情界面）：

  tab 切换面板

  e 编辑请求

  r 重新发起请求（如修改完请求后）

## 高级用法 

- -f filter 设置过滤

```bash
./mitmproxy -p 9527 -f "~u baidu ~b chiyiw" # url中包含‘baidu’且body中包含‘chiyiw’
```

更多过滤用法可在mitmproxy中使用?查看

* -s script 设置处理脚本

```bahs
./mitmdump -p 9527 -s modify_response.py
```

处理脚本如下

```python
def response(flow):
    content = flow.response.content.decode('utf8')
    if content.find('chiyiw') == -1:
        flow.response.content = 'why no me\n'.encode('utf8')
```

使用如下测试：

```bash
curl -x http://127.0.0.1:9527 baidu.com

result: why no me
```

更多的例子：https://github.com/mitmproxy/mitmproxy/tree/master/examples/simple

## 其它笔记

### curl

- -x [PROTOCOL://]HOST[:PORT] 设置代理，eg: `curl -x 127.0.0.1:1080 baidu.com`
- -d body  提交消息体，eg: `curl -d 'name=chiyiw' baidu.com`
- -H header 添加头，eg: `curl -H 'cookie: token=123456' baidu.com`
- --help 其它高级用法

### python

- if ... elif...else
- 缩进可用tab也可用空格，但不能二者都用
- if 'name'.find('me') != -1 或者 if 'me' in 'name'
- time.strftime('%Y-%m-%d %H:%m:%S',time.localtime(time.time()))

### mysql-python-connector

- 离线安装，https://dev.mysql.com/downloads/connector/python/ 下载，rpm -ivh mysql-python-connector.rpm

- 在线安装，pip install mysql-connector

- 基本使用 

  ```python
  import mysql.connector

  try:
      conn=mysql.connector.connect(host='host',port=3306,user='user',passwd='passwd', database='db')
      cur=conn.cursor()
      
      cur.execute("select id,name,token from user")
      for (id,cmd,token) in cur:
          print("ID: %s, name: %s, token: %s"% cur)
      
      cur.execute("select id,name,token from user")
      cur.fetchone()
      print("ID: %s"% cur[1])
      
      cur.fetchmany(5)
      for r in cur:
          print(r)
      
      cur.close()
      conn.close()
  except mysql.connector.Error as e:
      print("Error: %s"% e.msg)

  # 参考 "Python3连接MySQL数据库":http://smilejay.com/2013/03/python3-mysql-connector/
  ```

### 错误记录

- mitmproxy -s 的脚本只支持python3语法，因此使用MySQLdb无法使用

- mitmproxy -s 的脚本中的import mysql失败 “no module named mysql”

  原因：脚本无法找到module路径，需要设置sys.path

  解决：

  ```python
  import sys
  sys.path.append('/usr/lib/python2.7/site-packages') # 这个路径要填写module的搜索路径
  ```

- mitmproxy 证书安装，在代理环境下访问 http://mitm.it, 安装对应证书

**Link**: mitmproxy 官方文档：http://docs.mitmproxy.org/en/stable/index.html