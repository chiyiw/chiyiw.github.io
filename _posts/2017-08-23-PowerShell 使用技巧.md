# PowerShell 使用技巧

## tail -f

tail -f 是 linux 下很好用的跟踪打印文件的命令，经常用于查看日志，powershell 中可以这样来实现：

```powershell
get-content <file> -wait -tail 1 | select-string -pattern "<string>"
```

