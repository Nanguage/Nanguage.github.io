---
layout: default
title: 如何在非校园网环境下使用学校文献数据库
tags: notes
date: 2017-05-05 00:13:32
---

基本上每个大学都会购买大量的文献数据库，但这些一般情况下都是只能在校园网环境下使用。
当然，学校一般也会提供给学生vpn和客户端什么的以便校外访问，但用起来其实挺不方便，
至少我们学校提供的易瑞客户端就挺不好用的，过一会儿就要重新登录来保持连接，查文献的
时候感觉非常不方便，有时候连续几次感觉都要抓狂了。
如果能够有一种办法能够像在校园网之中那样方便地直接ip登录就好了。


### 代理搭建篇
这当然是可以做到的，
直接在校园网内部搭建个代理就行了，和科学上网的原理是差不多的。
所需材料:

* 一台位于校园网内部的，安装有shadowsocks的机器
* 一台具有外网ip并且可以稳定访问的机器，我用的是阿里云的vps

首先，我们要找到一台可以长时间放在校园网内的机器，我还是用的树莓派，它比较小，不怎么显眼，
而且就算一直开着的话能耗也比较低。
然后我们就需要在这台机器上面开启起一个代理，通过它来转发我们的网页请求，这样，文献服务器那边看到的
就是我们校园网内代理机器的ip。 用shadowsocks可以轻松做到这一点
（如果你没有接触过ss，你可以看看[这里](https://github.com/shadowsocks/shadowsocks/wiki/Shadowsocks-%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)）
<!-- more -->
首先，登录代理机器，然后用shadowsocks开一个代理服务器：

``` bash
$ nohup ssserver -p 443 -k password -m aes-256-cfb >> ssserver.log &
```
接着，可以直接在这台机器上开shadowsocks的客户端：

```
$ nohup sslocal -s 127.0.0.1 -p 443 -b 0.0.0.0 -l 1080 -k password >> sslocal.log &
```
这里在代理机器上开ss客户端，而不是在使用的时候在本地开客户端，是
因为这样可以通过直接暴露代理机器的1080端口让更多的设备直接使用代理，而不需要
在每台设备上都进行配置，这样做只是考虑使用起来比较方便。

到这里，代理已经搭建起来啦，但还有一个问题是，在校园网内，你很难
得到一个公网ip，使得在外侧能够访问到，一种办法是使用[之前提到的zerotier](/20170308/zerotier.html),
但zerotier也有它的问题，就是不太稳定，本来我们就是想追求文献查询过程中的稳定体验才想
搭建代理的，再弄得不稳定那不就是本末倒置了嘛。

这里我们使用另一种方法，通过ssh将代理机器的端口映射到一台有外网ip机器的端口上去。
首先你需要确保，这台远程机器允许远程转发，需要做的是登录它，修改`/etc/ssh/sshd_config`文件，在
文件末尾添加`GatewayPorts yes`，然后用命令`sudo service ssh reload`重启ssh服务器。

然后登录<b>代理机器</b>，在终端内输入：
```
ssh -fNC -R 0.0.0.0:1080:localhost:1080 your-user-name@your-server-ip
```
这时候可能会报错，原因很可能是远程机器上的1080端口已经被占用。这时，你需要通过`netstat -plant | grep 1080`
看一下是哪个进程占用了1080端口，用`kill -9`把它杀掉即可。如果没有报错，大概已经成功啦，你可以用上面那条
netstat命令看到正在转发1080端口的sshd进程。

### 使用篇
代理搭建成功以后，使用起来就很简单啦，就和用shadowsocks科学上网是差不多的。直接将浏览器的代理设置为
你的远程主机ip，端口设置为1080即可。恩，还要注意代理类型为socks v5。
推荐使用
[Proxy SwitchySharp](https://chrome.google.com/webstore/detail/proxy-switchysharp/dpplabbmogkhghncfbfdeeokoefdjegm?hl=en)
这个 Chrome 插件，切换代理很方便。
之后就可以随时随地使用校园网的数据库下载文献了，可以说是非常方便。

### 补充： 解决 ssh 断连问题
后来发现原文所述方法还存在一个问题，这里补充一下：

#### autossh

在默认情况下，这样配置 ssh 可能过一段时间可能会自己断掉。
一种解决办法是使用 autossh 代替 ssh，首先在代理机器上下载 autossh

```
$ sudo apt-get install autossh
```

然后还需要修改一下 ssh 的配置文件，

```
$ vim .ssh/config
```
在你的公网服务器的配置项下面加两项配置: `ServerAliveInterval 10`， `ServerAliveCountMax 5`。
比如：

```
Host myserver
    Hostname xxx.xxx.xxx.xxx
    Port 22
    User xxxx
    ServerAliveInterval 10
    ServerAliveCountMax 5
```

然后用 autossh 代替 ssh 进行反向代理：

```
$ autossh -M20000 -fNC -R 0.0.0.0:1080:localhost:1080 your-user-name@your-server-ip
```

#### 使用 frp

[frp](https://github.com/fatedier/frp) 是一个非常好用的工具，其实可以用它来做很多事情。
这里只需要用它把我们代理机器上的 sslocal 暴露的端口(1080) 代理到公网服务器的某个端口上就可以了。
frp 的文档写的非常详细，这里就不多说了，可以参考
[这里](https://github.com/fatedier/frp/blob/master/README_zh.md#通过-ssh-访问公司内网机器)。

