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

View 的绘制要经过三个流程，measure、layout、draw。这三个方法分别调用onMeasure、onLayout、onDraw

关于 View 的 measure 流程，下面的文章总结的太好了，就不再赘述了。
[Android View体系（七）从源码解析View的measure流程](http://mojijs.com/2016/03/215007/index.html)

流程 

```
measure -> onMeasure(widthSpec, heightSpec)  
```

```
// 测量规则
1. MeasureSpec.EXACTLY // 精确
2. MeasureSpec.AT_MOST // 最大值
3. MeasureSpec.UNSPECIFIED //不确定

对应关系：
match_parent 或"固定值" -> EXACTLY -> 直接赋值父控件传递的值

                        / 给定了新值 -> min( 新值，父控件传递的值 )
wrap_content -> AT_MOST 
                        \ 没有给定新值 -> 直接赋值父控件传递的值
```

对于系统自带控件，内部实现了 测量新值的逻辑，自定义控件，需要自己写。下面以 TextView 为例，源码中这样写道：

```js
onMeasure(widthSpec, heightSpec){
    match_parent -> EXACTLY -> 直接赋值 width = widthSpec.getSize
    else {
        des = desired(mLayout) { max( TextView 中每一行文字的个数*cell )}
        width = des
        width = max( 
            width, 
            getSuggestMinimumWidth(){ min( 
                mMinWidth, // layout 中的 minWidth 属性，默认 0
                mBackgroud.getMinimumWidth() // layout 中的 background 属性
                )}
            )
        
        if (wrap_content -> AT_MOST) {
            width = min( width, widthSpec.getSize )
        }
    }
    
    ... // 此处省略了 height 的测量
    setMeasuredDimension(width, height);
}
```

而对于我们简单的使用 TextView, 不设置 minWidth,不设置背景(这也是最常用的设置),一下为简化流程

```js
onMeasure(widthSpec, heightSpec){
    int specSzie = widthSpec.getSize()
    
    if( match_parent || "?dp" -> EXACTLY ) { 
        width = specSzie 
    }else {
        width = max( TextView 每一行的字数 * 字宽) // 系统测量关键步骤
        if( wrap_content -> AT_MOST ) {
            width = min(width, specSzie)
        }
    } 
    setMeasuredDimension(width, height);
} 
```
