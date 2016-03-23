# Android Handler使用

---

Thread1 发送 Handler 到消息队列 MessageQueue
Thread2 发送 Handler 到消息队列 MessageQueue
MessageQueue 中保存多个 Message

UI主线程 通过 Looper 从 MessageQueue 中逐个取出 Message

```java
// 处理消息
Handler handler = new Handler(){
    public void handlerMessage(Message msg){
        // 更改界面
    }
};

// 发消息
// 发空消息（标识）
handler.senderEmptyMessage(1);

// 发送非空消息
Message msg = new Message();
// Message msg = Message.obtain(); 与上等价，使用了消息池，优化，更常用
msg.what = 2; // 标识，用来区分各个线程
msg.arg1 = 5; // int数据可以用arg传递
msg.arg2 = 0;
msg.obj = "hahaha"; // Object类型的数据可以用obj传递
handler.sendMessage(msg);
```

> handler定义在哪儿就属于哪个线程，如果定义在UI主线程中就可以在处理函数中更改界面

## 使用实例
```java
ArrayList<News> newsData = new ArrayList<~>();

Handler handler = new Handler({
    @Override
    void handleMessage(Message msg){
        listview.setAdapter(new mAdapter(info));
    }
});

pubilc void getData(){
    new Thread(){
        URLConnection con = get...;
        for(News news : Results){
            newsData.add(news);
        }
        Message msg = Message.obtain();
        handler.sendMessage(msg);
    }.start();
}

getData();
```
