---
layout: post
categories: Android
---

# Android AndFix 热修复初探

---

热修复已经不是一个新鲜的词汇，早在n年前，Windows就采用“打补丁”的方式修复系统的问题。这种方式不需要用户重装系统，就可以修复系统的漏洞。这种方式友好，无违和感。

Android的热修复方案早在两年多前就已经出现了，这里要感谢国内企业阿里、腾讯等做出的杰出贡献。现在成熟的方案包括 HotFix, Dexposed，DroidPlugin等，最近又出了一个Nuwa（女娲）。

作为要给菜鸟，虽然现在无法做出这东西来，直接拿来用还是可以的，这些解决方案全部都开源在github上。我选择了一个阿里的AndFix来实践。

## AndFix

这个库是阿里新出的热修复库，使用起来非常方便，毫无违和感，无需改动已经存在的源代码。只需要在 Application类中添加几行代码即可。更详细的可以看 [github](https://github.com/alibaba/AndFix)

## Gradle配置

    compile 'com.alipay.euler:andfix:0.4.0@aar'

## 修改Application子类

如果没有初始 Application类需要先创建子类

```
public class App extends Application {

    private PatchManager mPatchManager;

    private static final String TAG = "App";
    private static final String APATCH_PATH = "/out.apatch";

    @Override
    public void onCreate() {
        super.onCreate();

        // 初始化 mPatchManager
        mPatchManager = new PatchManager(this);
        mPatchManager.init("1.0"); // 当前版本
        mPatchManager.loadPatch(); // 载入Patch

        // 检查是否存在Patch，有则加载
        try {
            // .apatch 文件的路径，这里就是SD卡根目录
            String patchFileString = Environment.getExternalStorageDirectory()
                    .getAbsolutePath() + APATCH_PATH;
            mPatchManager.addPatch(patchFileString); // 文件名
            Log.d(TAG, "apatch:" + patchFileString + " added.");
        } catch (IOException e) {
            Log.e(TAG, "", e);
        }
    }
}
```

这里添加了PatchManager,即Patch管理器，init(appVersion)初始化Patch存储目录，当应用发布新版本时，清除之前所有的Patch。应用都更新了，还要之前的Patch干啥，直接在新版本中修复了。

loadPatch()方法是载入Patch，这里的载入和下面的addPatch()方法的意义不同，loadPatch是将已经通过addPatch()方法添加过的patch载入到应用中。

addPatch()方法是找到*.patch文件，加入到应用程序可以使用的patch集合中。

一个*.patch文件的生命历程：

    download到SD卡或某文件目录 ==> App重启 ==> addPatch()加入到patch列表 ==> loadPatch() ==> 被使用

那么根据按照上面的代码执行顺序，App需要重启两次才能使用刚加入的patch，因为loadPatch()在addPatch()之前执行，下一次App启动才会load新的Patch，测试时发现并不是这样，看源码，发现，原来在addPatch()这个函数中，自动调用了loadPatch()。

## 制作patch文件

App配置好了，可以加载patch文件了，只需要将patch文件下载或推送到设备即可。那么我们一直说的patch应该怎么生成呢？patch,即补丁，是对现有程序的一个修复文件。

patch的应用场景：

1. 成功上线了一个App
2. 发现了一个严重的Bug，马上修复，但是还要到各种市场提交新版本，等待审核...,少则几个小时，多则几天，如果App部署了热修复方案，那就开挂了，进入第三步！
3. 修改代码，干掉Bug，编译出新的APK
4. 使用patch制作工具，对比老版本 old.apk 和新版本 new.apk 的差异生成 `*.patch`文件
5. 推送到用户设备
6. App成功修复。

如何生成patch，使用AndFix提供的 `apkpatch`工具

```
usage: apkpatch -f <new> -t <old> -o <output> -k <keystore> -p <***> -a <alias> -e <***>
 -a,--alias <alias>     keystore entry alias.
 -e,--epassword <***>   keystore entry password.
 -f,--from <loc>        new Apk file path.
 -k,--keystore <loc>    keystore path.
 -n,--name <name>       patch name.
 -o,--out <dir>         output dir.
 -p,--kpassword <***>   keystore password.
 -t,--to <loc>          old Apk file path.
```

keystore必须相同，这是patch安全性的保障
测试时使用debug.keystore，这个文件在的路径为C:\Users\用户名\.android\debug.keystore

    apkpatch -f new.apk -t old.apk -k C:\Users\用户名\.android\debug.keystore -p android -a androiddebugkey -e android -o ./output

执行后，就能在output目录下看到*.patch文件了

将其复制到SD根目录，重启App，Bug即可修复了。
