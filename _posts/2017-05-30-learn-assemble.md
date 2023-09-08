---
layout: default
title: 学习汇编语言
tags: notes
---

一直以来我都觉得汇编这种反人类的东西和我没什么关系。的确也是，一般的程序员是不需要写汇编的，
一方面，对于大多数人来说是不用下到计算机底层去的，我就建个网站或者分析个数据，至于么。
另一方面现在编译器已经很厉害了，在不清楚优化细节的情况下费劲写了一大堆，最后的效果可能还不如直接用C写，然后再编译出来的效果好。
但最近有一门涉及到了8086的汇编的课就要考试了。
恩，我觉得既然有这种机会的话去了解一下当然是不会有坏处的，至少是能满足一下好奇心，了解一下
从最微观的角度上看，CPU在做些什么，如何对它进行寄存器级别的操纵。这里就记录一下我是怎么学习
汇编和搭建一个汇编的开发环境的，

<!-- more -->

## 学习资源
经过在各个网站上一番浏览，看到王爽的《汇编语言》[这本书](https://book.douban.com/subject/25726019/)
在各个地方的风评都还挺不错的，就决定采用它了。
还有一个配套的[视频教程](http://www.bilibili.com/video/av2757100/)
，虽然视频很老了up主普通话不怎么好，但不想读书的时候把视频开到2倍速来看，感觉挺轻松的。

## 开发环境
书里面的环境是适用于XP或者Win7的虚拟8086环境的，Win10下默认情况是不行的，但
最近在寝室进行复习考试，寝室的这台电脑不怎么好，开虚拟机的话会比较卡，所以就只能用别的办法了，
google了一下，找到一个叫做[dosbox](http://www.dosbox.com/)
的程序能够模拟dos环境。恩，就用它了。有点需要注意的是，默认情况下，每次进入都需要将我们的某个
文件夹挂在到虚拟环境中才行，为了方便可以在安装以后，找到Options目录下双击DOSBox 0.74 Options
这个程序，然后会弹出来以notepad打开的一个配置文件，在最后的[autoexec]字段的最下面添加
```
MOUNT C PATH_TO_YOUR_DIR          
```
这样每次启动dosbox它就会自动把PATH_TO_YOUR_DIR这个路径挂载到虚拟环境的C盘了，这样就不用每次
都手动挂载了

然后写还需要汇编的编译器和连接器才能生产可执行的文件，这里我用了[masm32](http://masm32.com/)。
下载安装以后最好把安装目录下的bin文件夹添加到环境变量这样在敲命令的时候会方便一些。
除此之外为了方便调试程序，还需要下载Win7下自带但Win10里没有的汇编[debug程序](http://www.softpedia.com/get/Programming/Debuggers-Decompilers-Dissasemblers/DOS-Debug.shtml)。
用的时候，把需要把压缩包中的DEBUG.COM放在工作目录下。
最后需要一个文本编辑器，最好是带汇编语法高亮的，用notepad++就可以了。

然后就可以试着写个hello world然后编译运行一下了。
``` assemble
; 保存为 hello.asm
stack segment stack
	byte 64 dup(0)
stack ends

data segment
	msg byte 'hello world!$'
data ends

code segment
	assume cs:code,ss:stack,ds:data
	start:
	mov ax,data
	mov ds,ax
	mov dx,offset msg
	mov cx, 10
	mov ah,9
	L1: int 21h
	loop L1
	mov ax,4c00h
	int 21h
code ends
	end start
```

打开cmd或者PowerShell，切到工作目录下，`ml /c hello.asm`，然后就会生成hello.obj，为了
得到可执行文件，还要对obj进行连接，`link16 hello.obj`，然后会提示输入一些选项，
这里默认敲回车就行了。然后就会生成hello.exe这个可执行文件了。但这样的到的可执行文件在win10下
是不能执行的。需要打开Dosbox这个虚拟环境来执行。
如果没有出错的话程序会打印10个'hello world!'。也可以用debug来查看程序运行过程中寄存器的变化，
来进行单步调试和研究程序的运行过程。

![](http://op3kteb6u.bkt.clouddn.com/TIM%E6%88%AA%E5%9B%BE20170530202551.png)
