---
layout: post
categories: Android
---

# Android 多线程之 Handler

---

## Handler 工作机制

Thread1 用 Handler 发送 Message 到消息队列 MessageQueue <br>
Thread2 用 Handler 发送 Message 到消息队列 MessageQueue <br>
MessageQueue 中保存多个 Message 

UI主线程 通过 Looper 从 MessageQueue 中逐个取出 Message，由 handler.handlerMessage 处理

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
msg.obj = "hahaha"; // Object类型的数据可以用obj传递
msg.setData(Bundle); // 传递复杂类型 
handler.sendMessage(msg); // 将消息发出
```

> handler定义在哪儿就属于哪个线程，如果定义在UI主线程中就可以在处理函数中更改界面

## 使用实例

```java
public class MainActivity extends Activity {

    TextView tv;

    Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            tv.setText(msg.getData().getString("info"));
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tv = (TextView) findViewById(R.id.tv);
        getData();
    }

    public void getData(){
        new Thread(){
            @Override
            public void run() {
                // 可以执行耗时操作，如网络请求等
                Bundle bundle = new Bundle();
                bundle.putString("info", "hello, from UI handler");
                Message msg = Message.obtain();
                msg.setData(bundle);

                handler.sendMessage(msg);
            }
        }.start();
    }
}
```

## 没有主线程的 handler，如何更新 UI

这个问题在我百度二面的时候被问到，场景是这样的： <br>
handler 无法从主线程创建，也无法通过参数传递进子线程中，如何“自力更生”，去更新UI？

*我们知道，子线程中不能直接更新UI*，如何做到<br>
1.使用Looper.getMainLooper(),这个静态方法可以获取到主线程的Looper<br>
2.使用new Handler(Looper)创建handler，这种构造可以指定Looper，如果不指定，默认当前线程，如果要更新UI，明显不能这么做。

```java
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    
        getDataByNoHandler();
    }
    
    public void getDataByNoHandler(){
        new Thread(){
            @Override
            public void run() {
                // 开挂关键步骤
                Handler handler = new Handler(Looper.getMainLooper()){
                    @Override
                    public void handleMessage(Message msg) {
                        TextView tv = (TextView) findViewById(R.id.tv);
                        tv.setText(msg.getData().getString("info"));
                    }
                };
    
                Bundle bundle = new Bundle();
                bundle.putString("info", "from own handler");
                Message msg = Message.obtain();
                msg.setData(bundle);
    
                handler.sendMessage(msg);
            }
        }.start();
    }
}
```

这种“自力更生”的多线程方案，是不是更cool一点呢，我觉得至少程序的独立性更强一些，保证了代码的简洁性，看！onCreate()中就一行，`getDataByNoHandler()`!