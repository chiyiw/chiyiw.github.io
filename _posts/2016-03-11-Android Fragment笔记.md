---
layout: post
---

# Android Fragment 笔记

### 获取 View 布局

在onCreate方法中：
View view = LayoutInflate

### 实现点击接口

```java
// 1.定义事件接口
public interface OnFragmentClickListener{
	void onFragmentClick();
}
// 2.定义接口对象
OnFragmentClickListener mOnFragmentClickListener;
// 3.提供对外访问函数
public void setOnFragmentClickListener(OnFragmentClickListener mOnFragmentClickListener){
	this.mOnFragmentClickListener = mOnFragmentClickListener;
}
// 4.内部事件调用
@Override
public void onClick(View v){
    // 
	OnFragmentClickListener.onFragmentClick();
}
```

### 使用示例

```java
Fragment mFragment = new Fragment();
mFragment.setOnFragmentClickListener(new OnFragmentClickListener{
    @Override
    void onFragmentClick(){
        
    }
});
```
