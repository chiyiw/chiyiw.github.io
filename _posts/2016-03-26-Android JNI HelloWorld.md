---
layout: post
categories: Android
---

# Android JNI HelloWorld

---

JNI即 Java Native Interface，支持java调用C和C++代码。
android使用c++的好处：

* 跨平台，比如`Cocos2d`、`Box2D`等
* 安全性高，java容易被反编译
* 性能高，执行效率高


本文以HelloWorld为例，学习JNI的基本使用，教程参考自 [极客学院wiki][1] 。

最终目录结构：

```
└─Helloworld
    ├─bin
    │      HelloWorld.class
    │
    ├─jni
    │      HelloWorld.c
    │      HelloWorld.dll
    │      HelloWorld.exp
    │      HelloWorld.h
    │      HelloWorld.lib
    │      HelloWorld.obj
    │
    └─src
            HelloWorld.java
```

### 1. java文件中使用`native`关键字声明要c/c++实现的方法。

```java
public class HelloWorld {
    // 声明native实现的方法
    public static native String sayHello(String name);
    public static void main(){
        // 调用native方法
        String result = HelloWorld.sayHello("chiyiw");
        System.out.println(result);
    }

    static {
        System.loadLibrary("HelloWorld"); // 加载类库
    }
}
```

### 2. javac编译java文件

```
javac src\HelloWorld.java -d .\bin
```

### 3. javah -jni 生成对应.h头文件

```
javah -jni -classpath .\src -d .\jni HelloWorld
```

此时查看jni目录，已经生成了包含了HelloWorld类的native方法的HelloWorld.h文件

```c
#include <jni.h>

#ifndef _Included_HelloWorld
#define _Included_HelloWorld

/*
 * Class:     HelloWorld
 * Method:    sayHello
 * Signature: (Ljava/lang/String;)Ljava/lang/String;
 */
JNIEXPORT jstring JNICALL Java_HelloWorld_sayHello
  (JNIEnv *, jclass, jstring);

#endif
```

这里的在`JNIEXPORT`和`JNICALL`之间的`jstring`代表返回值
在jni中 jstring对应于Java中的String，jclass 对应 Class

参数：

| 参数 | 含义 |
| --- | :--- |
| JNIEnv | 指向 VM 中的java方法的指针
| jclass | 调用 方法的对象或类（当方法为static时） |
| jstring | 传入参数 |

### 4. 编写.c文件实现native函数

```c
#include <HelloWorld.h>

JNIEXPORT jstring JNICALL Java_HelloWorld_sayHello
  (JNIEnv *env, jclass cla, jstring j_str){
    // jstring 转化为 char*
    const char* name = (*env)->GetStringUTFChars(env, j_str, NULL);
    printf("Hello %s\n");
    // char* 转化为 jstring
    return (*env)->NewStringUTF(env, "from jni");
  }
```

> 由于java默认使用Unicode编码，而c/c++默认使用UTF编码，所以要相互转化使用。

### 5. 编译.c文件为.so或.dll

动态库文件名命名规则：lib+动态库文件名+后缀（操作系统不一样，后缀名也不一样）

| 名称 | 平台 |
| ---- | :--- |
| libHelloWorld.so |    Linux |
| HelloWorld.dll |      Windows (不需要`lib`) |
| libHelloWorld.jnilib |   MacOS |


*这里的不同只是因为在不同平台的环境不同，Android属于Linux，所以在Android中使用.so*

以下在Windows 10 + VS2015 命令行下运行

```cmd
F:\Code\Android\JNI\Helloworld\jni>cl -I"%JAVA_HOME%\include" -I"%JAVA_HOME%\include\win32" -LD HelloWorld.c -FeHelloWorld.dll

F:\Code\Android\JNI\Helloworld\jni>
```

编译完成，jni目录下自动生成了.dll文件

Linux 下：

```
gcc -I$JAVA_HOME/include -I$JAVA_HOME/include/linux -fPIC -shared HelloWorld.c -o libHelloWorld.so
```

### 5. java运行HelloWorld

```java
java -Djava.library.path=F:\Code\Android\JNI\Helloworld\jni -classpath .\bin HelloWorld
Hello chiyiw
from jni
```

到此，HelloWorld就运行成功了！
java运行时要传入了动态库绝对路径，否则不能加载到动态库。
当然，也可以在代码中直接指定,此时要使用**完整路径和文件名**

```java
static {
    System.loadLibrary("F:\Code\Android\JNI\Helloworld\jni\HelloWorld.dll");
}
```

  [1]: http://wiki.jikexueyuan.com/project/jni-ndk-developer-guide/workflow.html
