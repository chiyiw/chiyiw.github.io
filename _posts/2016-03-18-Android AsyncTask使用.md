---
layout: post
---

# Android AsyncTask使用

---

## 介绍

AsyncTask是子线程

```java
/**
 * 第一个参数 是外界传入的参数，与调用时的 execute() 传入参数对应
 * 第二个参数 类型与onProgressUpdate()对应
 * 第三个参数 是内部操作doInBackground()返回类型
 * 
 * doInBackground() 的返回值直接传入了 onPostExecute()
 */
class mTask extends AsyncTask<String, Void, Integer>{

    @Override // 不可以更改UI，可以做耗时操作
    protected Integer doInBackground(String... params) {
        
        String url = params[0];
        return null;
    }

    @Override // 更新界面
    protected void onPostExecute(Integer integer) {
        super.onPostExecute(integer);
    }

    @Override // 更新进度条
    protected void onProgressUpdate(Void... values) {
        super.onProgressUpdate(values);
    }
}

// 调用
new mTask().execute("1","2");
```

## 进度条

在`doInBackground()`中调用`publishProgress(int)`会自动调用`onProgressUpdate()`

```java
@Override 
protected Integer doInBackground(String... params) {
    publishProgress(95); // 发送进度
    return null;
}

@Override 
protected void onProgressUpdate(Integer... values) {
    super.onProgressUpdate(values);
    ... // 更新UI进度条
}
```

## 实例

### 使用AsyncTask获取网络图片

```java
class mTask extends AsyncTask<String, Integer, Bitmap>{
    
    ImageView icon;
    public mTask(ImageView icon){
        this.icon = icon;
    }
    
    @Override 
    protected Bitmap doInBackground(String... params) {
        String url = params[0];
        ...
        Bitmap bitmap = BitmapFactory.decode(inputStream);
        return bitmap;
    }

    @Override 
    protected void onPostExecute(Bitmap bitmap) {
        super.onPostExecute(bitmap);
        icon.setImageBitmap(bitmap);
    }
}

// 使用
ImageView imgv = findViewById(R.id.imgv);
new mTask(imgv).execute("http://www.baidu.com/*.png");
```
