---
layout: default
title: 使用Scrapy爬取豆瓣相册
tags: notes
date: 2016-12-09 17:34:55
---

这篇的内容还是暑假学习Scrapy的时候造的轮子，一转眼4个月过去了，我都快忘了还有这么个东西，两个星期以前我想爬一爬[吊带袜天使的豆瓣相册](https://movie.douban.com/subject/4845425/photos?type=S)的时候才想起来。其实这个轮子是很多人造过的比如这位[大大](http://www.kylen314.com/archives/1529)，不过他的轮子看起来有些老了，不知道还能不能用。我还是把我的轮子拿出来吧，一方面再熟悉一下Scrapy，另一方面算是提供一个爬豆瓣相册的工具。[代码在这里](https://github.com/Nanguage/ScrapyDoubanImageDownloader)，需要的话请取用。
恩，下面结合这个例子简单写一下Scrapy怎么用。

<!-- more --> 
### 配置Scrapy

安装Scrapy:
``` bash
$ pip install scrapy```
新建一个爬虫项目：
``` bash
$ scrapy startproject douban
$ tree #看一下目录结构
.
├── douban_album
│   ├── __init__.py
│   ├── items.py
│   ├── pipelines.py
│   ├── settings.py
│   └── spiders
│       └── __init__.py
└── scrapy.cfg
```
我们可以看到上面我通过 scrapy startproject 这个命令新建了一个爬虫项目，它的目录结构如上。其中 items.py 这个module用来定义爬取结果的字段，也就是我们要从网页上得到的信息。而与页面解析的代码会放在spiders这个目录下。pilelines.py 里面的代码负责对 spider 爬取到的item进一步处理。一般来说除了上面这些我们还要写一些 middleware，来修改user-agent和添加代理来使我们的爬虫不会被ban。你可以把整个scrapy爬虫看成是一个想搞个大新闻的媒体，他们分工明确有人专门负责收集信息，跑得比谁都快，相当于spider。他得到新闻后会把消息后会把消息传递给另一个负责撰稿的人把消息加工成大新闻，这个撰稿人就相当于pipelines，但是spider不是很会谈笑风生有可能在采集消息的时候会被批判一番（被Ban，也就是被网站禁止访问），这时候他就需要有个姿势水平高的人替他谈笑，这个人就相当于是 download middleware。栗子举得可能不太好，<del>来人把这个年轻人拖出去续一续</del>，你可以看看官方文档里讲[架构](https://scrapy-chs.readthedocs.io/zh_CN/0.24/topics/architecture.html)的部分来理解它的工作原理。下面详细说一下各个模块怎么写。

### items.py

在这里我们定义四个字段分别表示图片的url、图片、图片所属相册的名字和id：
``` python
# -*- coding: utf-8 -*-

import scrapy

class DoubanPicItem(scrapy.Item):
    image_urls = scrapy.Field()
    images = scrapy.Field()
    album_id = scrapy.Field()
    album_name = scrapy.Field()
```

### spiders

首先我们通过命令 "scrapy genspider album douban.com" 创建一个爬虫。之后你会看到spiders目录下多了一个文件 album.py 。然后来编写这个负责解析页面的module：
``` python
# -*- coding: utf-8 -*-
import re
import os
import shutil
import logging

from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import Rule, CrawlSpider
from scrapy.selector import Selector

from douban_album.items import DoubanPicItem
from douban_album.settings import IMAGES_STORE
from douban_album.settings import ALBUMS

# 从settings中引入的相册名和url,创建两个字典方便url、name、id三者的相互转换
url2name = {url: name for name, url in ALBUMS.items()}
id2name = {re.match('.*/(\d+)/.*$', url).group(1): name for url, name in url2name.items()}

class AlbumSpider(CrawlSpider):
    name = "album" 
    allowed_domains = [] 

    # 设置下载延迟，防止被Ban，但0.1并没有什么卵用，只是演示一下
    download_delay = 0.1 

    start_urls = ALBUMS.values() # 起始 url 从ALBUM这个dict中获得,

    # 创建url跟进规则
    rules = (
            Rule(LinkExtractor(allow=(r'https://movie\.douban\.com/subject/\d+/.+')),
                callback='parse_item', follow=True),        
    )

    # 创建用来存储图片的文件夹
    for url in start_urls:
        album_name = url2name[url]
        path = os.path.join(IMAGES_STORE, album_name)
        if os.path.exists(path): 
            resp = raw_input("{path} already exist remove it? [n]/y ?".format(path=path))
            if resp == 'y' or 'yes':
                shutil.rmtree(path)
            else:
                raise OSError('{path} already exist! '.format(path=path))
        os.mkdir(path)

    # 提取页面信息，返回item
    def parse_item(self, response):
        album_id = re.match('.*/(\d+)/.*$', response.url).group(1)
        album_name = id2name[album_id]
        sel = Selector(response)
        # 这里我们从页面上抓图片的url，之后 image pipeline 会根据这个信息下载图片
        img_paths = sel.xpath('//li[@data-id]/div/a/img[@src]/@src').extract()
        print "+"*50

        for path in img_paths:
            item = DoubanPicItem()

            # thumb(缩略图) 替换成raw这样就能得到原始图片（大图）的地址
            img_path = path.replace('thumb', 'raw')
            # 如果需要小图可以把thumb替换为photo
            # img_path = path.replace('thumb', 'photo')
            print "="*30
            logging.log(logging.DEBUG, img_path)

            item['image_urls'] = [img_path]
            item['album_id'] = album_id
            item['album_name'] = album_name 
            yield item
```
这里我们用了CrawlSpider而不是默认的Spider，主要是因为它能够直接用正则表达式定义Rule，来直接处理url的跟进规则，不用我们去yeild请求。

### pipelines.py

spider返回的item会返回给这个模块，这里利用image pipelines下载item里的url来得到图片。这个ImagePipeline是Scrapy已经实现好的，直接继承过来改写一下就行。当然这只是一种从url获取图片的方法，其实也可以把url存在一个文件里交给别的下载软件来下载也是可以的
``` python
# -*- coding: utf-8 -*-

import re

import scrapy
from scrapy.http import Request
from scrapy.pipelines.images import ImagesPipeline

class DoubanPicPipeline(ImagesPipeline):

    def get_media_requests(self, item, info):
        return [Request(x, headers=self.get_headers(x), \
            meta={'album_id':item['album_id'], \
                'album_name':item['album_name']}) \
            for x in item.get(self.images_urls_field, [])]

    CONVERTED_ORIGINAL = re.compile('^full/[0-9,a-f]+.jpg$')

    def get_images(self, response, request, info):
        for key, image, buf, in super(DoubanPicPipeline, self).get_images(response, request, info):
            if self.CONVERTED_ORIGINAL.match(key):
                key = key.replace('full', response.meta['album_name'])
            yield key, image, buf

    headers = {
        'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36\
                     (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
        'referer': '',
    }

    def get_headers(self, url):
        headers = self.headers
        # 修改请求头，经我的试验这里比较关键，请求头不对的话会就不能下载
        aut = url.split('/')[2]
        path = url[25:]
        ref = re.sub(r'img\d\.doubanio\.com/view/photo/raw/public/p(.*)\.jpg', \
                r'movie.douban.com/photos/photo/\g/', url)
        headers['referer'] = ref
        return headers
```
image pipeline的详细使用方法在[这里](http://scrapy-chs.readthedocs.io/zh_CN/0.24/topics/images.html)。

### middlewares

为防止被ban，可以给爬虫加一个download middleware来不断修改请求头中的user-agent，这里就不贴代码了，这里我直接用了这篇[博文](http://blog.csdn.net/u012150179/article/details/35774323)里的代码，新建一个module放在把它放在里面就行了。

### settings.py

至此这个爬虫基本上已经写好了，最后只需要用settings把它们串联起来就可以工作了。
``` python
# -*- coding: utf-8 -*-

# 图片保存地址
IMAGES_STORE = '/home/nanguage/Pictures/douban' 

# 逐个填入待爬取相册的 name: url 键值对
ALBUMS = {
        #'吊带袜天使':"https://movie.douban.com/subject/4845425/photos?type=S"
        '飞跃巅峰2':"https://movie.douban.com/subject/1870140/photos?type=S"
        #'kill la kill':"https://movie.douban.com/subject/24532162/all_photos"
}

BOT_NAME = 'douban_album'

SPIDER_MODULES = ['douban_album.spiders']
NEWSPIDER_MODULE = 'douban_album.spiders'

USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64)AppleWebKit/537.22 \
             (KHTML, like Gecko) Chrome/25.0.1364.97 Safari/537.22 AlexaToolbar/alxg-3.1"

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

COOKIES_ENABLED = False

DOWNLOADER_MIDDLEWARES = {
        'scrapy.downloadermiddlewares.retry.RetryMiddleware': 90,
        'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware' : None, 
        'douban_album.middlewares.rotate_useragent.RotateUserAgentMiddleware': 543,
}

ITEM_PIPELINES = {
        # 'scrapy.pipelines.images.ImagesPipeline':1
        'douban_album.pipelines.DoubanPicPipeline':1
}

# Retry many times since proxies often fail
RETRY_TIMES = 3
# Retry on most error codes since proxies fail for different reasons
RETRY_HTTP_CODES = [500, 503, 504, 400, 403, 404, 408]
# PROXY_LIST = '/path/to/proxy/list.txt'
```
前两个变量是我们用来指定图片存储位置和待爬相册信息的。ITEM_PIPELINES和DOWNLOADER_MIDDLEWARES这两个字典的key是我们之前写好的pipelines和middleware，value是它们被开启的顺序，数字越大的越晚被开启。其它的你可以从字面意思上去理解每个变量，不多说。这里的设置还可以有很多，只是常用的就上面这些。

## 使用

至此，我们已经可以愉快的使用Scrapy来爬豆瓣相册了，如果你没有跟着上面的来写，可以直接从[这里](https://github.com/Nanguage/ScrapyDoubanImageDownloader)得到代码。
然后修改settings里面的ABLUMS和IMAGE_STORE，比如我现在要下攻壳机动队的图片，那就先在豆瓣上找到攻壳的相册url，然后像下面这样修改：
``` python
# 图片保存地址
IMAGES_STORE = '/home/nanguage/Pictures/douban' 

# 逐个填入待爬取相册的 name: url 键值对
ALBUMS = {
        '攻壳机动队SAC':"https://movie.douban.com/subject/1431615/all_photos"
}
```
然后：
``` bash
$ scrapy crawl album```
你会发现随着终端里不停打印出的大批大批的debug信息，指定的目录下出现了大量热腾腾可以食用的图片，真是太开心了！
![scrapy_0](http://op3kteb6u.bkt.clouddn.com/2016-12-09-17-18-28-%E7%9A%84%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE-1024x576.png)

## 结语

恩，Scrapy算是基本会用了...总的来说它的速度很快，但就是有点太重量级了，毕竟是个框架，很多东西并不透明，debug起来有些费神。说实话，对于一般定向采集，用requests + gevent + pyquery 写个小脚本就已经足够了，犯不着用一个这么完整的框架。不过如果遇到需要大规模爬取的情况（<del datetime="2016-12-09T08:59:16+00:00">虽然这可能是个伪需求</del>），我还是会考虑它的。
