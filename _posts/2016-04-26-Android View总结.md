---
layout: post
---

# Android View总结

---

Android 中包括两类基类：View 和 ViewGroup

View 是 Android 中重要的类，它有众多的重要的方法，比如 onMeasure,onLayout,onTouchEvent等
ViewGroup 是容器，可以包含多个View,比如典型的 LinearLayout , Framelayout等

## Android 窗口组成

```
Activity
  └── PhoneWindow
    └── DecorView (FrameLayout)
      └── LinearLayout
        ├── TitleView (FrameLayout)
        └── ContentView (FrameLayout)
```

DecorView 是每一个可见Activity窗口的根 View,它本身是继承自 FrameLayout,是拓展的 FrameLayout 类，实现了窗口的一些操作，其对象内部有两个对象，分别是 TitleView 和 ContentView,也就是我们在 onCreate() 方法中用到的 `setContentView()`。我们在activity_main.xml 中定义的布局都是 addView 到了 ContentView 中。ActionBar 属于 TitleView,如果要去除 ActionBar 需要在 onCreate() 方法中调用 requestWindowFeature(Windwo.FEATURE_NO_TITLE)。 DecorView 将在调用 setContentView() 时被添加到 PhoneWindow 中，并显示出来，这也就是为什么 requestWindowFeature 需要在 setContentView 之前调用才有效的原因了，一旦执行了 setContentView, DecorView 已经被添加到了 PhoneWindow 中，requestWindowFeature 对其不发生作用。

```
setContentView() -> {
    getWindow().setContentView(){
        installDecor() -> {
            generateDecor() -> { mDecor = new DecorView() }
            mContentParent = generateLayout(mDecor)
        }
        mContentParent.addView()
    }
    initWindowDecorActionBar() -> {
        getWindow().getDecorView() -> {  
            mActionBar = new WindowDecorActionBar(this)
        }
    }
}
```
*注：此处是简化过的调用过程，并非具体过程。-> 表示调用或者实现*

可以看到，Activity 中的setContentView(v) 实际是将 v 添加到了 PhoneWindow 的 mContentParent 中。

## View 树

也就是所说的控件树。由多个 ViewGroup 和 View 组成。
