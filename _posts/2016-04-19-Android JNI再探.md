---
layout: post
categories: Android
---

# Android JNI再探

---
 
这是第二次“入门”JNI了，比第一次认识的更深刻一些，思路更加清晰一些。

这次在 Linux 下实战，更接地气些。首先还是看目录结构：

```
└── jnitest
    ├── Helloworld.c
    ├── Helloworld.class
    ├── Helloworld.h
    ├── Helloworld.java
    └── libHelloworld.so
```

这次的目录清爽多了，简化了目录操作，后面的命令更加清爽。

本文用到的所有命令：

```
1. javac Helloworld.java // 编译生成Helloworld.class
2. javah -jni Helloworld // 生成 Helloworld.h
3. gcc -I$JAVA_HOME/include -I$JAVA_HOME/include/linux -fPIC -shared Helloworld.c -o libHelloworld.so // 生成 libHelloworld.so
4. java Helloworld
```

## 流程

### 1. 编写 `helloworld.java`

```java
public class Helloworld {

  public native void sayHello(String name); 
  public native String reverseString(String str);
  public native int sum(int[] array);

  public static void main(String[] args) {
    Helloworld hello = new Helloworld();
    hello.sayHello("chiyiw");
    
    String res = hello.reverseString("coding");
    System.out.println(res);

    int[] arr = new int[]{1,2,3,4,5,6};
    int sum = hello.sum(arr);
    System.out.println("sum = "+sum);
  }

  static {
    System.load("/home/chiyiw/dev/java/jnitest/libHelloworld.so");
  }
}
```

### 2. 生成 `Helloworld.class`

```
javac Helloworld.java
```

### 3. 生成 `Helloworld.h`

```
javah -jni Helloworld
```

### 4. 编写 `Helloworld.c`

```c
#include "Helloworld.h"

#ifdef __cplusplus
extern "C" {
#endif
/*
 * Class:     Helloworld
 * Method:    sayHello
 * Signature: (Ljava/lang/String;)V
 */
JNIEXPORT void JNICALL Java_Helloworld_sayHello
  (JNIEnv *env, jobject jobj, jstring jstr){
    const char* name = (*env)->GetStringUTFChars(env, jstr, NULL);
    printf("%s\n", name);
  }

/*
 * Class:     Helloworld
 * Method:    reverseString
 * Signature: (Ljava/lang/String;)Ljava/lang/String;
 */
 // 翻转字符串
JNIEXPORT jstring JNICALL Java_Helloworld_reverseString
  (JNIEnv *env, jobject jobj, jstring jstr){
    int i = 0;
    jint len = (*env)->GetStringUTFLength(env, jstr);
    char* origin = (*env)->GetStringUTFChars(env, jstr, NULL);
    char dist[len];
    for (i; i<len; i++){
      dist[i] = origin[len-1-i];
    }

    (*env)->ReleaseStringUTFChars(env, jstr, origin);
    return (*env)->NewStringUTF(env, dist);
  }

  // 计算数组元素之和
  JNIEXPORT jint JNICALL
  Java_Helloworld_sum(JNIEnv* env, jobject jobj, jintArray arr[]){
    int i = 0;
    int sum = 0;
    jint len = (*env)->GetArrayLength(env, arr);
    jint array[len];
    (*env)->GetIntArrayRegion(env, arr, 0, len,array);
    for (i; i < len; i++){
      sum += array[i];
      printf("%d\n", array[i]);
    }

    return sum;
  }

#ifdef __cplusplus
}
#endif
```

### 4. 生成 `libHelloworld.so`

```
gcc -I$JAVA_HOME/include -I$JAVA_HOME/include/linux -fPIC -shared Helloworld.c -o libHelloworld.so
```

这一个命令稍微复杂些，分三段来理解

* `-I$JAVA_HOME/include -I$JAVA_HOME/include/linux`包含了头文件，在windows下只要将后面的`linux`改为`win32`
* `-fPIC` 编译成与位置无关的独立代码 `-shared` 编译成动态库
* `Helloworld.c -o libHelloworld.so` 这个gcc常用的

### 5. 运行 

```
java Helloworld

// 如果前面使用的是 System.loadLibrary("Helloworld"),这里要指定动态库路径
java -Djava.library.path=/home/chiyiw/dev/java/jnitest/libHelloworld.so Helloworld
```

如果前面所有的命令没有输入错误（尤其是文件名），结果如下：

```
chiyiw
gnidoc
1
2
3
4
5
6
sum = 21
```

“书读百遍，其义自见”，每一次重新入门，对代码的认识就更加深刻了