---
layout: post
---

## 设置Activity主题

在Activity开头

    namespace NcuEveryDay
    {
    	[Activity (Label = "NcuEveryDay", MainLauncher = true, Icon = "@mipmap/icon",
    		Theme = "@android:style/Theme.Holo.Light.NoActionBar")]
    	public class MainActivity : Activity
    	{
    	...
    	}
    }
    
## 添加NuGet库

左侧“包”，右键添加

错误	1	Unzipping failed. Please download https://dl-ssl.google.com/android/repository/android_m2repository_r25.zip and extract it to the C:\Users\wangpeng\AppData\Local\Xamarin\Android.Support.v4\23.1.1.0\content directory.	NcuEveryDay


