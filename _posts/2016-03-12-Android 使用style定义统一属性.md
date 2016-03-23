---
layout: post
---

# Android 使用style定义统一属性

### 在styles.xml中定义style

```xml
<style name="ButtonStyle">
    <item name="android:layout_width">wrap_content<item/>
    <item name="android:layout_height">wrap_content<item/>
    <item name="android:background">@drawable/button_bg_selector</item>
</style>
```

### 使用示例 

```xml
<Button style="@style/ButtonStyle"/>
```

### button_bg_selector.xml 设置点击颜色

```xml
<selector>
    <item android:state_pressed="true">
        <shape>
            <corners android:radius="10dp"/>
            <padding android:left="2dp"
                    android:right="2dp"
                    android:top="2dp"
                    android:bottom="2dp"/>
        </shape>
    <item>
</selector>
```
