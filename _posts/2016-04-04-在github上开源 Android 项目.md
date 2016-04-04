---
layout: post
---

# 在github上开源 Android 项目

---

之前也将几个项目放到了github上，实际上主要是为了使用git版本管理。本地也有很多git仓库了，这些天突发奇想，打算把我的github向开源的方向迈进。

这些天在github上逛发现了一个开源项目，项目结构清新简洁，readme.md 美观耐看。看完了代码，也打算学习国外的牛人们来“开源”项目。

好看的目录结构：
![](http://ww2.sinaimg.cn/large/74311666jw1f2l4iqcg6sj210l0hq42w.jpg)

这个项目向我展示了如何开源一个第三方库，并提交到jitpack.io，项目中包含了两个module: `library`和`app`

## gitignore

.gitignore 文件用于在版本管理中忽略部分文件，编写.gitignore不妥，将造成文件冗余、文件丢失、文件目录可读性差等问题。

Android Studio项目的 .gitignore
```
#gradle
.gradle/

#built files
build/
out/
gen/

# IntelliJ Idea/Android Studio files
.idea/
*.iml

#proguard
proguard_logs/

# Local configuration file (sdk path, etc)
local.properties

# Mac system files
.DS_*
```

这里列出的可能并不完全，如果从eclipse导入的项目可能还包括 import-summary.txt等等，其实我们可以使用Android Studio的`.ignore`插件，当用AS打开.gitignore文件时，对于编写有问题的部分，将用灰色提示，根据提示可以定制出比较理想的忽略规则。

## README.md

README.md 是描述整个项目的介绍文档，也是浏览者的第一印象。README应该遵循以下几点：
1. 简洁
2. 突出重点
3. 效果图，图胜于文字，程序员更相信眼见为实。

对于图片，写在markdown中也许并不好办，可能还需要使用外部图床。更多的人是这样做的：
1. 在项目根目录下新建一个`screenshots`或`arts`文件夹，将使用到的图片存入
2. 使用`<img>`标签来插入图片，`<img>`标签的好处是可以任意调节宽高,其实markdown最终解释为html，所以对html是兼容的。例：

```html
<img src="screenshots/example.png" width="300px">
```

## 遇到的问题

1. .gitignore规则失效
当我们发现之前.gitignore文件写得比较乱，修改后（一般是添加了新的过滤规则）没有作用，文件还是没有被忽略。此时如果编写的规则没有问题，就是因为目标文件已经存在于之前的版本中，对于已经加入到版本控制的文件，新添加的规则对其不生效。
解决方案：清除缓存，重新提交
```
git rm -r --cached .
git add .
git commit
```
