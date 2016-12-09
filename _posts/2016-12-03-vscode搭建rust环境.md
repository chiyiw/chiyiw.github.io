---
layout: post
categories: rust
---

# vscode搭建rust环境

## 目标

* 一键运行<br>
* 自动完成，智能提示<br>
* 源码查看<br>

## 效果
![](http://7xlguf.com1.z0.glb.clouddn.com/blog/vscode-rust.gif)

## 步骤

### 安装rust
下载最新的rust安装。

### 安装vscode
在[https://code.visualstudio.com/](https://code.visualstudio.com/)安装最新的vscode，安装即可。

### 安装rusty插件
在vscode中，Ctrl+Shift+X进入插件商店，搜索rusty,安装。

### 安装racer,rustfmt,rust source code
根据rusty插件的详细信息的提示，安装下列插件，下面作为参考。

在vscode中，Ctrl+`,进入命令行，依次安装上面的工具。

```bash
cargo install racer
cargo install rustfmt
cargo install rustsym
```
下载最新的源码
我下载的时候是[https://static.rust-lang.org/dist/rustc-1.13.0-src.tar.gz](https://static.rust-lang.org/dist/rustc-1.13.0-src.tar.gz),解压到自己的目录，我是放在rust安装目录下的source目录下的。

### 配置vscode
修改.vscode/settings.json, 这个文件是vscode的配置文件，同时它遵循“就近覆盖”原则，在当前目录下新建.vscode/settings.json会替换根目录下的相同配置,这一点用着非常方便，是否配置成全局的自己决定。
添加下面几行：

```json
{
    "rust.racerPath": "C:/Users/chiyiw/.cargo/bin/racer.exe", // racer 可执行文件的路径
    "rust.rustLangSrcPath": "D:/Software/Rust stable GNU 1.12/source/rust-1.12.0-src/rust-1.12.0/src", // Rust 源码路径
    "rust.rustfmtPath": "C:/Users/chiyiw/.cargo/bin/rustfmt.exe", // rustfmt 可执行文件路径
    "rust.rustsymPath": "C:/Users/chiyiw/.cargo/bin/rustsym.exe", // rustsym 可执行文件路径
    "rust.cargoPath": "D:/Software/Rust stable GNU 1.12/bin/cargo.exe", // cargo 可执行文件路径
    "rust.cargoHomePath": "C:/Users/chiyiw/.cargo", // cargo home 目录，主要是用于查找下载的缓存库等
    "rust.cargoEnv": null, // Specifies custom variables to set when running cargo. 
    "rust.formatOnSave": false, // 是否打开保存自动格式化选项
    "rust.checkOnSave": false, // 是否打开保存制动执行 `cargo check` 
    "rust.checkWith": "build", // Specifies the linter to use. (EXPERIMENTAL)
    "rust.useJsonErrors": false, // Enable the use of JSON errors (requires Rust 1.7+). 
    "rust.useNewErrorFormat": false 
}
```

### 编译rusty
理论上安装插件的时候可以自动编译，但是我的vscode没有效果，因此，按照rusty插件的介绍信息，我又执行了下面的命令。

```bash
cd ~/.vscode/extensions/saviorisdead.RustyCode-0.19.1
npm install
npm run-script compile  // 虽然编译失败了，但是没有影响
```

至此，搭建环境完成，虽然可能不是那么的完美，但是上面的目标都达到了,Ctrl+Shift+R运行。



