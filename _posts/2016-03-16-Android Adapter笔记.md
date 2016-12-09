---
layout: post
categories: Android
---

# Android Adapter笔记

---

## 分类
viewpager 

* pageradapter
* fragmentpageradapter

listview 

* arrayadapter 文字
* simpleadapter
* simplecursoradapter 数据库
* baseadapter 灵活使用（最常用）

## listview 的 item 布局

命名： item_listview_**.xml

```java
@Override
public View getView(int position, View convertView, ViewGroup parent){
    View view = View.inflate(context, R.layout.item_listview_**,null);
    // 获取控件
    view.findViewById(R.id.textView);
}
```






