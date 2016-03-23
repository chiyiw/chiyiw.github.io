---
layout: post
---

# Android ListView 优化

---

## 原理 

getView 在每个Item出现在视图中时都要执行，其中的`inflate`过程耗时，优化即对`inflate`过程进行重用

## 实现
```java
@Override
public View getView(...){
    if (convertView == null){
        convertView = View.inflate(...);
    }
}
```
## 原理2

每次`getView()`被调用，子控件都要重新`new`,即分配内存，优化即对子控件进行重用
ViewHolder对象可以看作一块内存地址

## 实现

```java
@Override
public View getView(...){
   
    ViewHolder holder = null;
    if (convertView == null){
        convertView = View.inflate(...);
        
        holder = new ViewHolder();
        holder.imgv = convertView.findeViewById(...);
        holder.tv = convertView.findViewById(...);
        
        convertView.setTag(holder); // 给convertView设置tag，将holder的地址与之绑定
    }else {
        holder = convertView.getTag(); // 获取到convertView绑定的holder，避免重新分配内存
    }
    
    holder.imgv.setBitmap(...);
}

class ViewHolder{
    ImageView imgv;
    TextView tv;
}
```
## 思考

如果界面每次只能显示三个Item

1. 前三次 `convertView == null`， `holder` 也要 `new`
> 这里的`convertView == null`？ 
> * 并非简单的convertView为空，实际上内存中已经有了`convertView`（第2个item出现时第1个的convertView已经存在），只是它们都在被使用（对应布局还在视图中可见），故

2. 当第四个Item出现时，是要查找是否有未被使用的`convertView`，当未查找到时，`new`一个

3. 当第五个Item出现时，第一个Item已经不再可视范围了，此时要重用第一个Item
> 此时是如何找到第一个convertView而不是第2、3、4个？
> * 猜想应该是使用栈来保存所有存在的convertView，此时优先复用最先的convertView。

