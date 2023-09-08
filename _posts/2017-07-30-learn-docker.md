---
layout: default
title: 学习Docker
tags: notes
date: 2017-07-30 00:03:00
---

最经经常为在服务器上安装软件所困扰。软件依赖的问题有多麻烦，自然是不用我再
说了，所以有人为了解决这个问题发明了Docker，它在操作系统的级别上提供虚拟化，
简单来说就是提供一个“沙盒”或者“容器”，方便将软件与它的依赖打包成一个独立的
应用。
wikipedia上对Docker的定义：

> an open-source project that automates the deployment of software 
> applications inside containers by providing an additional layer of
> abstraction and automation of OS-level virtualization on Linux.

这种神奇又实用的东西当然是要学习一个的。

<!-- more -->

## 基本概念
* **Docker镜像(images)**: 用于创建Docker容器的模板，类似于面向对象语言中“类”的概念。
* **Docker容器(Container)**: 一个Docker容器的实例，一个独立的应用，类似于面向对象中的“对象”。对容器进行的更改不会影响到镜像。
* **Host**: 运行Docker守护进程的机器。
* **Daemon**: 运行于Docker Host 上的守护进程，用于监听API发来的请求，管理 Host 上的 Image 与 Container，可以与其他 deamon 间进行通信。 
* **Client**: 基于 Command Line 或者 GUI 的客户端程序，利用 API 与 Docker 守护进程进行通信。
* **Docker仓库**: 存放Docker镜像的仓库，类似于版本控制中Github的角色。[Docker Hub](https://hub.docker.com/)上提供了大量的镜像。
* **Docker Machine**: 一个简化 Docker 安装的命令行工具。

![Docker 架构](https://docs.docker.com/engine/images/architecture.svg)

## 安装

``` bash
wget -qO- https://get.docker.com/ | sh # 下载最新Docker安装包进行安装
```

然后为了能够在不使用root权限下使用docker，`sudo usermod -aG docker $(whoami)`，将自己添加
到 docker 用户组之中，然后`sudo service docker restart`，重新登录后运行
`docker run hello-world` 如果返回了带有 Hello from Docker 字样的信息，就说明已经安装完成了。

## 运行 docker 容器

安装之后可以尝试一下运行docker容器，

``` bash
docker run ubuntu:16.04 /bin/echo "Hello World!"
```

`docker run` 命令会新建一个容器，`ubuntu:16.04`指定了创建容器所采用的镜像，如果本地该镜像不存在，
docker 就会从公共仓库 docker hub 上下载对应的镜像。而`/bin/echo "Hello World"`指定了要运行的命令。

除了运行方式，还可以交互式运行，就像开启了一个shell那样。比如：

``` bash
docker run -i -t ubuntu:16.04 /bin/bash
```

以 ubuntu 16.04 为镜像建立一个容器，并运行 bash shell，`-t` 在容器内开启一个终端，`-i`允许与容器
进行交互。这时候就建立了一个新的容器并可以通过shell与之进行交互，此时打开另一个终端，
输入`docker ps`，可以看到列出了正在运行的 docker 容器的相关信息，比如容器ID、镜像、命令、状态等等。

```
⋊> ~/T/demo_docker docker ps                                                                                                                                            
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
d11ec4b0042b        ubuntu:16.04        "/bin/bash"         27 seconds ago      Up 26 seconds                           quirky_brahmagupta
```

然后可以通过`docker stop`或者是`docker kill`来关闭这个正在运行的容器。比如，`docker kill d11ec4b0042b`，
再运行`docker ps`就会发现刚才那个 docker 容器已经被关闭了。此外通过`-d`选项可以使容器在后台运行。
通过`attach`命令可以把应用的标准输入、输出切至当前终端。
比如：

``` bash
⋊> ~/T/demo_docker docker run -d -it ubuntu:16.04 bash                  
5bad84c67822971b0e8b37b745f6fa6ee2cb95aad05e554cb2801ef99147a950
⋊> ~/T/demo_docker docker ps                                            
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
5bad84c67822        ubuntu:16.04        "bash"              6 seconds ago       Up 5 seconds                            sleepy_saha
⋊> ~/T/demo_docker docker attach 5bad84c67822971b0e8b37b745f6fa6ee2cb95aad05e554cb2801ef99147a950 
root@5bad84c67822:/# ls
bin   dev  home  lib64  mnt  proc  run   srv  tmp  var
boot  etc  lib   media  opt  root  sbin  sys  usr
root@5bad84c67822:/# 
```

如果想从容器中切出(deattach)可以通过 `Ctrl+p+Ctrl+q` 快捷键。使用`docker logs`可以查看容器的输出记录。

## 容器管理
`docker ps -a` 查看所有镜像，包括已经关闭的镜像。如果容器已经不再需要，可以使用`docker rm`进行删除。
其中一个比较实用用法：

``` bash
docker rm $(docker ps -a -q -f status=exited)
```

删除掉所有已经退出的容器。

其它容器管理命令：

* **stats**  : 显示容器的资源利用情况
* **exec**   : 在容器内运行一条命令
* **pause**  : 暂停容器
* **unpause**: 从暂停状态恢复
* **create** : 生成一个新容器，运行后生成一个容器，但容器这时并未在运行
* **start**  : 开始运行一个或多个容器
* **export** : 导出容器文件系统到一个tarball
* **top**    : 显示一个容器中运行着的所有进程
* **update** : 更新容器的配置

`docker run` 实际上等价于 `docker create` + `docker start`, 例如：

``` bash
⋊> ~/T/demo_docker docker create -it ubuntu:16.04 bin/bash                                                                                                              
8c7c80016dbf2a1e8ceb6403ccf9de48735ade2517bad9388bba0ad5ba2df040
⋊> ~/T/demo_docker docker start -a -i 8c7c80016dbf2a1e8ceb6403ccf9de48735ade2517bad9388bba0ad5ba2df040                                                                  
root@8c7c80016dbf:/# 

```

## 镜像管理

首先，可以通过`docker images`列出所有镜像:

``` bash
⋊> ~/T/demo_docker docker images                                               
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu              16.04               d355ed3537e9        3 days ago          119 MB
busybox             latest              c30178c5239f        8 days ago          1.11 MB
hello-world         latest              1815c82652c0        9 days ago          1.84 kB
nginx               latest              958a7ae9e569        3 weeks ago         109 MB

```

获取一个新的镜像，比如获取nginx的镜像：

``` bash
⋊> ~/T/demo_docker docker pull nginx                                           
Using default tag: latest
latest: Pulling from library/nginx
ff3d52d8f55f: Pull complete 
226f4ec56ba3: Pull complete 
53d7dd52b97d: Pull complete 
Digest: sha256:41ad9967ea448d7c2b203c699b429abe1ed5af331cd92533900c6d77490e0268
Status: Downloaded newer image for nginx:latest

```

在 docker hub 上查找镜像，使用`docker search`命令，比如查找与 Python 有关的镜像：

``` bash
⋊> ~/T/demo_docker docker search python                                        
NAME                           DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
python                         Python is an interpreted, interactive, obj...   1935      [OK]       
kaggle/python                  Docker image for Python scripts run on Kaggle   64                   [OK]
google/python                  Please use gcr.io/google-appengine/python ...   35                   [OK]
dockershelf/python             Repository for docker images of Python. Te...   3                    [OK]
vimagick/python                mini python                                     3                    [OK]
...
```

### 创建镜像

如果没有现成的可供使用的镜像或者是要发布自己的应用时，可以创建自己的镜像。
创建新的镜像可以通过两种方式：1. 对已有的镜像进行修改，并提交修改。2. 使用一个指令序列即 Dockerfile 创建新的镜像。
这两种方式如果类比到对本地Host的操作，可以理解为通过 shell 对系统进行修改和通过脚本来对系统进行修改。

##### 更新镜像

首先，来看看第一种方式。比如我们要创建一个带有ipython的容器，可以先运行一个新的ubuntu容器，然后通过一些列命令安装 ipython：

``` 
⋊> ~/T/demo_docker docker run -i -t ubuntu:16.04 /bin/bash                     
root@b406d40315d3:/# apt-get update
...
root@b406d40315d3:/# apt-get install ipython
...
```

在对容器修改的一系列命令运行完毕之后，通过 `Ctrl+D` 或者 exit 退出之后，通过 ps 找到容器 ID 后，就可以通过
`docker commit` 进行修改的提交了。

``` bash
⋊> ~/T/demo_docker docker commit -m "install ipython" -a "nanguage" b406d40315d3 nanguage/ipython:v1
sha256:b2c33f8bf0d64fd84656bd445efa944263106c54a2ce4e212cd30eb1dd0a7d72
⋊> ~/T/demo_docker docker images                                               
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
nanguage/ipython    v1                  b2c33f8bf0d6        1 minutes ago       197 MB
ubuntu              16.04               d355ed3537e9        4 days ago          119 MB
busybox             latest              c30178c5239f        9 days ago          1.11 MB
hello-world         latest              1815c82652c0        10 days ago         1.84 kB
nginx               latest              958a7ae9e569        3 weeks ago         109 MB

```

可以看到 nanguage/ipython:v1 镜像已经被创建了。

#### Dockerfile 构建镜像
这里以 BioContainers Project 的 [base image](https://github.com/BioContainers/containers/blob/master/biocontainers/Dockerfile) 为例
展示 Dockerfile 的写法。

``` Dockerfile
# Base image
FROM ubuntu:16.04

# Metadata
LABEl base.image="ubuntu:16.04"
LABEL version="4"
LABEL software="Biocontainers base Image"
LABEL software.version="08252016"
LABEL description="Base image for BioDocker"
LABEL website="http://biocontainers.pro"
LABEL documentation="https://github.com/BioContainers/specs/wiki"
LABEL license="https://github.com/BioContainers/containers/blob/master/LICENSE"
LABEL tags="Genomics,Proteomics,Transcriptomics,General,Metabolomics"

# Maintainer
MAINTAINER Felipe da Veiga Leprevost <felipe@leprevost.com.br>

ENV DEBIAN_FRONTEND noninteractive

RUN mv /etc/apt/sources.list /etc/apt/sources.list.bkp && \
    bash -c 'echo -e "deb mirror://mirrors.ubuntu.com/mirrors.txt xenial main restricted universe multiverse\n\
deb mirror://mirrors.ubuntu.com/mirrors.txt xenial-updates main restricted universe multiverse\n\
deb mirror://mirrors.ubuntu.com/mirrors.txt xenial-backports main restricted universe multiverse\n\
deb mirror://mirrors.ubuntu.com/mirrors.txt xenial-security main restricted universe multiverse\n\n" > /etc/apt/sources.list' && \
    cat /etc/apt/sources.list.bkp >> /etc/apt/sources.list && \
    cat /etc/apt/sources.list

RUN apt-get clean all && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y  \
        autotools-dev   \
        automake        \
        cmake           \
        curl            \
        grep            \
        sed             \
        dpkg            \
        fuse            \
        git             \
        wget            \
        zip             \
        openjdk-8-jre   \
        build-essential \
        pkg-config      \
        python          \
	python-dev      \
        python-pip      \
        bzip2           \
        ca-certificates \
        libglib2.0-0    \
        libxext6        \
        libsm6          \
        libxrender1     \
        git             \
        mercurial       \
        subversion      \
        zlib1g-dev &&   \
        apt-get clean && \
        apt-get purge && \
        rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN echo 'export PATH=/opt/conda/bin:$PATH' > /etc/profile.d/conda.sh && \
    wget --quiet https://repo.continuum.io/miniconda/Miniconda2-4.0.5-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda && \
    rm ~/miniconda.sh

RUN TINI_VERSION=`curl https://github.com/krallin/tini/releases/latest | grep -o "/v.*\"" | sed 's:^..\(.*\).$:\1:'` && \
    curl -L "https://github.com/krallin/tini/releases/download/v${TINI_VERSION}/tini_${TINI_VERSION}.deb" > tini.deb && \
    dpkg -i tini.deb && \
    rm tini.deb && \
    apt-get clean

RUN mkdir /data /config

# Add user biodocker with password biodocker
RUN groupadd fuse && \
    useradd --create-home --shell /bin/bash --user-group --uid 1000 --groups sudo,fuse biodocker && \
    echo `echo "biodocker\nbiodocker\n" | passwd biodocker` && \
    chown biodocker:biodocker /data && \
    chown biodocker:biodocker /config

# give write permissions to conda folder
RUN chmod 777 -R /opt/conda/

# Change user
USER biodocker

ENV PATH=$PATH:/opt/conda/bin
ENV PATH=$PATH:/home/biodocker/bin
ENV HOME=/home/biodocker

RUN mkdir /home/biodocker/bin

RUN conda config --add channels r
RUN conda config --add channels bioconda

RUN conda upgrade conda

VOLUME ["/data", "/config"]

# Overwrite this with 'CMD []' in a dependent Dockerfile
CMD ["/bin/bash"]

WORKDIR /data
```

从上面的 Dockerfile 来看其实挺好理解的，基本就是普通的 bash command 加了一些关键字而已，我们来一条条看上面出现的关键字。
首先`FROM`指定了从哪个镜像为基础构建，这里指定的是 ubuntu:16.04。`MAINTAINER`这里提供的是镜像的维护者相关的信息，
接着是连续好几行以`LABEL`作为开头的行，这是一些对于该
镜像的描述性信息。接着是一系列`RUN`，这些是用于镜像构建的指令序列，相当于在一个容器内运行这些指令，然后commit。
`ENV`提供了一种设置环境变量的方法。`USER` 命令用于切换用户。`VOLUME`声明了在容器与 Host 间的共享文件夹。
`CMD`命令指定了`docker run` 时默认执行的程序。`WORKDIR`切换 Dockerfile 的工作路径。

有了上面的知识，可以自己写一个小的 Dockerfile ，然后构建一下试试：

```
⋊> ~/T/d/test cat Dockerfile                                                                                                                                            
FROM ubuntu:16.04
LABEL name="test"
MAINTAINER nanguage
RUN mkdir /data
RUN echo hello > /data/hello
CMD ["/bin/bash"]
⋊> ~/T/d/test docker build .                                                                                                                                           
Sending build context to Docker daemon 2.048 kB
Step 1/6 : FROM ubuntu:16.04
 ---> d355ed3537e9
Step 2/6 : LABEL name "test"
 ---> Running in f30e25bd7ab6
 ---> 82327e2bbae3
Removing intermediate container f30e25bd7ab6
Step 3/6 : MAINTAINER nanguage
 ---> Running in 84eff125a52f
 ---> 6c19f72c12e5
Removing intermediate container 84eff125a52f
Step 4/6 : RUN mkdir /data
 ---> Running in e023f378cfb5
 ---> 692fba194181
Removing intermediate container e023f378cfb5
Step 5/6 : RUN echo hello > /data/hello
 ---> Running in b3268fb15c34
 ---> 4b8ae579faa2
Removing intermediate container b3268fb15c34
Step 6/6 : CMD /bin/bash
 ---> Running in deeb2b9ce5a7
 ---> b23e55236ba1
Removing intermediate container deeb2b9ce5a7
Successfully built b23e55236ba1
⋊> ~/T/d/test docker images                                                                                                                                             
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
<none>              <none>              b23e55236ba1        3 hours ago         119 MB
nanguage/ipython    v1                  b2c33f8bf0d6        5 hours ago         197 MB
ubuntu              16.04               d355ed3537e9        4 days ago          119 MB
busybox             latest              c30178c5239f        9 days ago          1.11 MB
hello-world         latest              1815c82652c0        10 days ago         1.84 kB
nginx               latest              958a7ae9e569        3 weeks ago         109 MB
⋊> ~/T/d/test docker tag b23e55236ba1 test                                                                                                                              
⋊> ~/T/d/test docker images                                                                                                                                             
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
test                latest              b23e55236ba1        3 hours ago         119 MB
nanguage/ipython    v1                  b2c33f8bf0d6        5 hours ago         197 MB
ubuntu              16.04               d355ed3537e9        4 days ago          119 MB
busybox             latest              c30178c5239f        9 days ago          1.11 MB
hello-world         latest              1815c82652c0        10 days ago         1.84 kB
nginx               latest              958a7ae9e569        3 weeks ago         109 MB
⋊> ~/T/d/test docker run -it test:latest                                                                                                                                
root@15805ab06447:/# 
```

## 与外部联系
Dokcer使我们拥有了沙盒，但这些沙盒要发挥作用就必须具有从外界输入数据和向外界输出数据的能力。
下面看看Docker中的相关机制。

### 文件传输
`docker cp` 在容器与本地文件系统间进行文件拷贝，比如：
```
⋊> ~/PlayGround docker cp test.txt 1256cea0ee7d:/home # 拷入docker
⋊> ~/PlayGround docker cp 1256cea0ee7d:/home/test2.txt . # 拷回本地
```

### 端口映射
如果我们希望在容器内运行网络应用，就需要把容器内部的网络端口给映射到本地的某一端口上去。
举一个栗子，比如我们要运行一个flask的demo:
```
⋊> ~/PlayGround docker run -p 1111:80 p0bailey/docker-flask:latest # 将容器的80端口绑定到本地1111端口上。
```
然后用浏览器访问 `127.0.0.1:1111`就能看到一个 "Hello Flask!!!" 的页面了。这时用 `docker ps` 也能看到
端口映射的情况。
```
⋊> ~/D/h/blog docker ps                                                        
CONTAINER ID        IMAGE                          COMMAND                  CREATED             STATUS              PORTS                  NAMES
841dd3365eaf        p0bailey/docker-flask:latest   "/usr/bin/supervisord"   6 minutes ago       Up 6 minutes        0.0.0.0:1111->80/tcp   nifty_jepsen
```
