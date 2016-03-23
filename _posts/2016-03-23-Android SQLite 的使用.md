# Android SQLite 的使用

---

## 打开数据库

Android系统提供了`SQLiteOpenHelper`用于打开数据库

继承`SQLiteOpenHelper`创建OpenHelper
```java
public class DBOpenHelper extends SQLiteOpenHelper {
    public DBOpenHeloer(Context context){
        // 参数：上下文，数据库名，？，版本
        super(context, "**.db", null, 1);
    }
    
    @Override // 初始化数据库
    protected void onCreate(SQLiteDatabase db){
        
    }
    
    @Override // 升级数据库，当数据库版本号改变时执行
    protected void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion){
        
    }
}
```

## 操作数据表
```java
public class DBOperator {
    
    DBOpenHelper openHelper;
    public DBOperator(Context context){
        // 打开数据库文件
        openHelper = new DBOpenHelper(context);
    }
    
    public void addPerson(){
        // 获取到数据库
        SQLiteDatabase db = openHelper.getWritableDatabase();
        db.exeSQL(...); // 执行sql语句
        db.close();
    }
}
```

## 调试查看数据库

使用File Explorer 打开 /data/data/包名/databases/ 可以找到建立的数据库，现在就要打开数据库

可以使用命令行或第三方软件打开*.db文件

命令行：
```
adb shell
root@.. > sqlite3 data/data/包名/databases/名称.db

sqlite> .help // 帮助
sqlite> .table // 查看所有的表
```