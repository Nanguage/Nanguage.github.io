---
layout: default
title: 论制作 Slides 的几种姿势
tags: notes
date: 2018-07-23 16:25:00
---


制作 Slides，第一个想到的当然是 PPT。PPT 做 Slides 是很方便，毕竟人家是专业软件，
但还是有不少缺点，首先它不方便传播，每次使用前都要把文件先传给别人。
还有，版本不兼容的问题就不多说了，痛处大家都懂。
(虽然可以转 PDF 来解决，但转出来的 PDF 总是莫名其妙的大...)　
还有就是这个东西的定位是大众化软件，方便操作是好，但是如果你要做一个系列化的好几百张的
那种 Slides，PPT 很难做到灵活的工程化地对项目进行管理，毕竟是闭源格式，不方便脚本操作。
而且，还无法展示很多具有交互特性的动态效果，比如你写了个 JS 动画，是很难在里面展示的，
只能放个 Link 进去，看的时候在打开。

当然，做 Slides 不是只有 PPT 这一种姿势。下面就谈一谈我了解到的其他几种。

<!-- more -->

## LaTeX

LaTeX 的 beamer　包可以在一定程度上解决 PPT 的问题，它最大的好处就是可以工程化管理，
可以像写代码那样组织一个 Slides 项目的文件结构，可以用脚本、LaTeX 模板来对文件进行操作。
LaTeX 是专业排版工具，特别是对于数学公式排版，不仅排出来的公式美观而且它的语法对于表达公式也
很方便，个人感觉比 PPT　里的公式编辑器要强出很多。但 LaTeX 的定位是传统的纸质媒介排版，
所以很难嵌入动态效果。所以对于比较规范化的学术 Slides 排版或者是公式比较多的时候用 LaTeX 
会比较好。

我一般用 VS code 做编辑器，配合 LaTeX Workshop 这个插件来使用，可以一边写一边查看效果，
体验还是挺不错的。


![](/images/blog/beamer_example.png){:height="80%" width="80%"}


## Jupyter notebook

我原来也不知道，其实 Jupyter notebook 还可以用来做 Slide，直到上次看 PyData 上的
[演讲](https://www.youtube.com/watch?v=s0S6HFdPtlA)，
发现演讲者用的 Slides 好像有点像 Jupyter, 下去以后搜了一下才发现。
这简直太棒了，在 Jupyter 上做的分析上，加上一些文字说明和格式调整就能做成演讲用的 
Slides 真的是非常方便。对于上述说的问题几乎能完全解决，Jupyter nbconvert 可以把一个
notebook 直接输出成一个 HTML 可以直接 Host 在 GitPage 上，给别人展示的时候只要
优雅地点开一个网页就可以了，简直不能再酷了。而且对于 Jupyter 而言嵌入个 JS 什么的
压根不成问题，交互特性妥妥的。

而且输出网页的默认样式看着也挺好看，简单朴素（当然也可以自己用 CSS 修改样式）。
这里放一个[例子](https://ericmjl.github.io/bayesian-deep-learning-demystified/#/IntroductionSlide)
，可以点进去看看。具体怎么用 Jupyter 制作 Slides 可以参考
[这里](https://medium.com/learning-machine-learning/present-your-data-science-projects-with-jupyter-slides-75f20735eb0f)
。


## Mathematica

恩，既然 Jupyter notebook 都有这个功能，Mathematica 作为 notebook 的前辈肯定也是可以做
Slides 的，参考 Mma [相关文档](http://reference.wolfram.com/language/howto/CreateASlideShow.html)。
Mma 里面的交互特性当然是非常强大的，可以说是高配版的 Jupyter 了，但好像不能转
成 HTML 文件 (如果可以请评论区打脸)，在线展示需要在客户端安装一个 1G 多的 CDF 插件，
虽然比较大，但这个插件几乎能展示所有 Mma 里面内置的功能，还是很强大的。
从这个角度来说 Mma 比 Jupyter 强大，但可能确实不如 Jupyter 灵活。


## Markdown to slides

最近还发现了一种更加轻量级的解决方案，
[markdown-to-slides](https://github.com/partageit/markdown-to-slides) 
能够直接把 Markdown 文件转换成 HTML 格式的 Slides。当然只要能生成 HTML
直接部署、CSS修改格式、以及嵌入 JS 代码都是不成问题的。如果不需要展示 
代码的运行，它可能比 Jupyter 还要方便一些。这里非常推荐，只是这个项目似乎
没有在维护，不过暂时功能还够用，到时候实在不行就只能自己开发了，
它是对另一个项目 [remark](https://github.com/gnab/remark)　
的包装，remark 还在维护，所以应该是不用太发愁的。所以，这里比较推荐。

最后放一个我自己做的[例子](/slides/test/slideshow.html)。


