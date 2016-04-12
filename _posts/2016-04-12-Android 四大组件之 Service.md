---
layout: post
---

﻿# Android 四大组件之 Service

---

Service通常总是称之为“后台服务”，其中“后台”一词是相对于前台而言的，具体是指其本身的运行并不依赖于用户可视的UI界面。

## 应用场景

1. 并不依赖于用户可视的UI界面（当然，这一条其实也不是绝对的，如前台Service就是与Notification界面结合使用的）；

2. 具有较长时间的运行特性。

---

## Service 生命周期

### 1. startService调用
onCreate() ==> onStartCommand()

* 如果 Service 实例已经存在，startService只会调用 `onStartCommand`
* 当 Activity 销毁后，Service 仍然存在，在重新打开 Activity 时，依然只会调用`onStartCommand`方法

> *实际上在每次 onStartCommand 后都会调用 onStart, 但是 onStart 已经过时了，不需要考虑，也不用实现*

### 2. bindService调用
onCreate() ==> onBind()

* 如果 Service 实例已经存在，bindService 不会重新调用 `onCreate` 和 `onBind`，也不会调用 `onStartCommand` (更不会有 `onStart` )
* 当 Activity 销毁后，Service 也随着被销毁，依次调用 `onUnbind` ==> `onDestroy`

> 注意：当按返回键或主页键，或屏幕旋转，都会导致Activity被销毁，下一次Activity的onCreate会被重新调用

---

## Activity 使用 startService(Intent) 操作 Service

#### 1. AndroidManifest.xml 中指定 Action 对 Service 发送意图（Intent）

```java
<service android:name=".MusicService">
    <intent-filter>
        <action android:name="org.chiyiw.music.start"/>
        <action android:name="org.chiyiw.music.next"/>
    </intent-filter>
</service>
```

这里指定了对 MusicService 的 start 操作和next操作

#### 2. 给 Service 发送 action
通过发送 `start` 意图让 Service 执行“播放”

```java
Intent intent = new Intent();
intent.setAction("org.chiyiw.music.start");
this.startService(intent);
```

通过发送 `next` 意图让 Service 执行“下一首”

```java
Intent intent = new Intent();
intent.setAction("org.chiyiw.music.next");
this.startService(intent);
```

值得注意的是，第一次执行 startService 时，会调用 `onCreate` 和 `onStartCommand`, 当第二次调用时，Service 的实例已经存在，不会再调用 `onCreate`,但会重新调用 `onStartCommand`

---

## Activity 使用 bindService 操作 Service

#### 1. Service 中自定义内部内 Binder 提供 服务获取

```java
// Binder 继承 IBinder
class MyBinder extends Binder {
    public MusicService getService(){
        return MusicService.this;
    }
}
MyBinder binder = new MyBinder();

@Override
public IBinder onBind(Intent intent) {
    // 返回 binder
    return binder;
}
```

#### 2. Activity 中实现服务连接监听

```java
ServiceConnection connection = new ServiceConnection() {
    @Override // 连接到service时调用
    public void onServiceConnected(ComponentName name, IBinder service) {
        // 获取到 service 实例
        MusicService musicService = ((MusicService.MyBinder)service).getService();
        // ...此处可以对 service 实例执行操作
    }

    @Override // 当service意外解除时执行
    public void onServiceDisconnected(ComponentName name) {
    }
};
```

#### 3. Activity 中绑定Service

```java
Intent intent = new Intent();
intent.setAction(this, MusicService.class);
this.bindService(intent, connection, Context.BIND_AUTO_CREATE);

// onDestroy 中解除绑定，否则会报“MainActivity has leaked ServiceConnection”的异常
@Override
protected void onDestroy() {
    this.unbindService(connection);
    super.onDestroy();
}
```

---

## startService 与 bindService 的联系

二者可以独立使用，也可以同时使用

独立使用 startService 时，需要:

* 定义 action
* 实现 startCommand

独立使用 bindService 时，需要:

* 定义 Binder 内部类
* 定义 ServiceConnection
* 实现 onBind
