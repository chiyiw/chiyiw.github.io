---
layout: post
---

# RxAndroid 与 Retrofit实战

---

RxAndroid是基于Rxjava的异步编程框架，其核心是观察者模式。
Retrofit是Square公司推出的开源高耦合Rest Api网络请求框架。
RxAndroid + Retorfit = 牛（zhuang）B

二者都是独立且相当强大的开源库，本文将从一个实际案例来练手。

## 应用场景

获取南昌大学家园网最新新闻，Api地址为：
[http://www.ncuhome.cn/NewIndex2013/AjaxGetList.ashx?partID=394&pageindex=1&pagesize=2](http://www.ncuhome.cn/NewIndex2013/AjaxGetList.ashx?partID=394&pageindex=1&pagesize=2)

```
[
    {
        "ID": 31614,
        "Content": "材料学院消息：为进一步提高我院2013级学生的考研热情，明确考研目标......",
        "PicUrl": "http://common.ncuhome.cn/UploadFiles/Image/2016-04/635954376703590756.jpg",
        "CreateTime": "2016/4/5 21:55:16",
        "newstitle": "材料学院：考研保研交流会顺利举行",
        "rowcount": 0,
        "pagecount": 787
    },
    {
        "ID": 31613,
        "Content": "眼视光学院消息：惠风和畅前湖暖，杨柳新姿学子忙。三月既是春暖花开......",
        "PicUrl": "http://common.ncuhome.cn/UploadFiles/Image/2016-04/63595324058898519.jpg",
        "CreateTime": "2016/4/5 21:47:08",
        "newstitle": "三月学雷锋——眼视光学院前湖环保行动",
        "rowcount": 0,
        "pagecount": 787
    }
]
```

我们要获取到json数据并且转化为java对象。即

```
public class News {
    private int ID;
    private String Content;
    private String PicUrl;
    private String CreateTime;
    private String newstitle;
    private int rowcount;
    private int pagecount;
}
```

## 纯 Retrofit 实现

参考自 Retrofit 的 [官方文档](https://square.github.io/retrofit)

1. 准备工作
首先，添加 库

```
compile "com.squareup.retrofit2:retrofit:${retrofit}"   
compile "com.squareup.retrofit2:converter-gson:${retrofit}"
```

新建类`News` ,建议使用 插件`GsonFormat`一键转化

2. 新建`NcuServices`接口

```java
public interface NcuServices {
    @GET("/NewIndex2013/AjaxGetList.ashx?partID=394&pageindex=1")
    Call<List<News>> getNcuNews(@Query("pagesize") int howmany);
}
```
Retrofit 通过注解生成路由，`@Query(key) type value` 既是添加进 url 的参数，又是 getNcuNews()的参数，实现了高耦合配置。

3. 定义`NcuApi`, 实现接口

```java
public class NcuApi {
    private final NcuServices mNcuServices;

    public NcuApi() {
        // 初始化 Retrofit
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://www.ncuhome.cn") /* 指定 baseUrl */
                .addConverterFactory(GsonConverterFactory.create()) /* 指定Converter */
                .build();
        mNcuServices= retrofit.create(NcuServices.class);
    }
    // addConverterFactory 指定了将 获取到的数据解析的方式
    // 使用GsonConverterFactory方式可以解析成Gson形式的json格式
    // 常用的 还有 SimpleXmlConverterFactory 等

    // 调用接口
    public Call<List<News>> getNcuNews(int howmany) {
        return mNcuServices.getNcuNews(howmany);
    }
}
```

4. 使用方式

```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        NcuApi mNcuApi = new NcuApi();

        Call<List<News>> call = mNcuApi.getNcuNews(5);
        // 异步获取
        call.enqueue(new Callback<List<News>>() {
            @Override
            public void onResponse(Call<List<News>> call, Response<List<News>> response) {
                // 获取List
                List<News> list = response.body();

                StringBuilder builder = new StringBuilder();
                for (News news : list) {
                    builder.append(news.getContent()).append("\n");
                }
                Log.d("tag", builder.toString());
            }

            @Override
            public void onFailure(Call<List<News>> call, Throwable t) {
                Log.d("tag", "获取失败");
            }
        });

        // 同步获取
        // Response<List<News>> response = call.execute();
        // List<News> list = response.body();
    }
}
```

一般`XxxServices`中会有多个 Api 接口，使用这种方式配置将更加简洁。

---

## 使用 RxAndroid

RxAndroid 也是异步处理框架，与 Retrofit 配合使用，Retrofit 可以采用同步方式。

首先，添加支持库

```
compile "io.reactivex:rxandroid:${rxandroid}"
compile "io.reactivex:rxjava:${rxandroid}"
compile "com.squareup.retrofit2:retrofit:${retrofit}"
compile "com.squareup.retrofit2:converter-gson:${retrofit}"
compile "com.squareup.retrofit2:adapter-rxjava:${retrofit}" // 必须
```

`adapter-rxjava` 是 Retrofit 对 Rxjava 的适配，必须引用

```java
// NcuService.java
public interface NcuServices {
    @GET("/NewIndex2013/AjaxGetList.ashx?partID=394")
    Observable<List<News>> getNcuNews(@Query("pagesize") int howmany, @Query("pageindex") int fromwhere);
}

// NcuApi.java
public class NcuApi {
    ...
    public Observable<List<News>> getNcuNews(int howmany, int fromwhere){
        return mNcuServices.getNcuNews(howmany, fromwhere)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread());
    }
}

// MainActivity.java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        NcuApi mNcuApi = new NcuApi();
        Observable<List<News>> observable = mNcuApi.getNcuNews(5, 2);
        observable.subscribe(new Subscriber<List<News>>() {
            ...
            @Override
            public void onNext(List<News> newses) {
                final StringBuilder builder = new StringBuilder();
                Observable.from(newses).subscribe(new Action1<News>() {
                    @Override
                    public void call(News news) {
                        builder.append(news.getContent()).append("\n");
                    }
                });
                Log.d("tag", builder.toString());
            }
        });
    }
}
```

如果用上 lambda 就极简了!

```java
final StringBuilder builder = new StringBuilder();
observable.subscribe((Action1) (newses) -> {
    Observable.from(newses).subscribe((Action1)(news) -> {
        builder.append(news.getContent()).append("\n");
    });
    Log.d("tag", builder.toString());
});
```

## 总结
到这里，我们已经看到 Retrofit 的强大了，Rest Api 的耦合，自带的异步（同步），可拓展的自动解析，

```
`优雅用`
“Service ==> Api ==> Java class”
`替代了`
“new Thread ==> Http request ==> JSONObject ==> Java class”
`后者的每一步都是如此头痛T_T`
```
