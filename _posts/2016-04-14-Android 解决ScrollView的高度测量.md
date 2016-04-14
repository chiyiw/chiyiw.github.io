---
layout: post
---

# Android 解决ScrollView的高度测量

---

## 重写ListView的onMeasure方法

```
public class ListViewForScrollView extends ListView {
    ...
    @Override // 测量宽高的规则
    protected void onMeasure(int widthSpec, int heightSpec){
        // 重新定义高度测量规则(最大高度)
        int height = MeasureSpec.makeMeasureSpec(1000000, MeasureSpec.AT_MOST);
        super.onMeasure(widthSpec, height);
    }
}

// 测量规则
// android.view.View.MeasureSpec.UNSPECIFIED 不确定
// android.view.View.MeasureSpec.AT_MOST // 最大
// android.view.View.MeasureSpec.EXACTLY // 精确
```
