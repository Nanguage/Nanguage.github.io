---
layout: default
title: Hi-C 数据分析结果应该怎么存？
tags: bioinformatics
date: 2018-11-10 16:22:00
---

目前 3D 或者说 4D 基因组学是生物学里面比较前沿，研究火热的领域。
研究者们开发了很多各种各样用于染色体三维结构研究的方法、工具。
（可以参考 4DN 总结的
[Protocol 列表](https://www.4dnucleome.org/protocols.html)）
目前，其中应用最广泛的实验技术就是 Hi-C 了。
各种各样的研究产生了大量的 Hi-C 数据，
当然研究者们也围绕着这些数据开发了各种各样的计算方法、软件。
（见 [4DN Software list](https://www.4dnucleome.org/software.html)）

但这就出现了一些问题，Hi-C 相对于其他的 NGS 实验来说相对比较新，
关于结果数据怎么储存这件事，软件之间并没有达成比较一致的共识，
规范尚未形成。软件之间交换数据往往需要进行格式转换，非常不方便。

<!-- more -->

## Hi-C 分析中的文件格式

首先 Hi-C 以及相关的变种都是基于二代测序的实验，
下机的数据和其他二代数据没有差别，都是 fastq 格式存储的 reads。
然后经过一些预处理和比对生成用来表示比对结果的 bam 文件。
到这一步为止所有软件的数据格式基本上都是一样的，没有问题。

然后下一步就是把两端的比对结果进行配对了，
这一步为了后续处理，软件会把配对的结果保存起来，
这里不同的软件的做法上就存在差别了。
大多数软件都是保存成一个文本文件的 Pairs 列表，
也有的软件比如 [hiclib]() 这一步的结果也会存在 hdf5 文件里,见
[这里](https://mirnylab.bitbucket.io/hiclib/fragment.html#api-documentation)
。因为并不是最终的结果，
一般也不是很关心这里的数据格式。

然后会进行一些列针对噪声数据的过滤，生成
过滤后的 Pairs 列表。
然后根据所设置的分辨率进行 bin 分割
（就是把染色体分成很多个区块，每个区块的大小为设置的分辨率）。
然后根据 Pairs 列表和划好的 bin，就可以生成最终的
Contact Map 也就是互作矩阵了（这个矩阵往往还需要做一些标准化、矩阵平衡）。

Hi-C 的上游分析指的就是到这个 Contact Map 之前的部分，
很多 Hi-C 分析的流程默认就是做到这里。
Contact Map 的文件格式就有很多了，不同流程间非常不统一，
比如说 Aiden Lab 开发的 Juicer 输出的是 .hic 文件，
MIT mirnylab 的 hiclib 输出的是他们自己搞出来的基于 hdf5 的文件，
HiC-Pro 是一种文本文件（具体的格式不记得了）。
下游分析、可视化的软件就更是如此，输入的 Contact Map 格式要求千奇百怪，
很多时候为了使用某种软件就必须要做数据格式转换，非常麻烦。

总之，目前的状况就是，Hi-C 相关的分析软件对于数据格式缺乏一个统一的标准，
给研究者带来了很多不便。

## 所以到底怎么存？

假如说我要开发一个 Hi-C 相关的分析软件/流程，在这么多的选择中我应该怎么去选择呢？
首先，我们考虑一下数据存储的几个方面：

+ 数据压缩程度: 文件存储不能太过于低效以至于浪费太多的存储空间。
+ 数据的结构化程度: 数据应该按照一定的组织结构存储，以方便于程序的读写。
+ 标准化程度: 是否有明确的标准，该标准是否被社区所广泛接受，是否有较统一的 API 。
+ 工具支持: 现有的上下游工具的数量、质量。
+ 格式转换: 是否能够很容易地向其他文件格式进行转换，是否有转换工具。
+ ...

更具体地，根据文件的类型，还应该将 Reads Pairs 和 Contact Map 分开进行讨论。

### Reads Pairs 数据

Reads Pairs 数据，即从测序数据处理所得到的原始的以及处理后的互作对。
数据在还是 Reads Pairs 的时候，由于还未进行划 bin，所以相对于 Contact Map
保留了互作对两端 Reads 在染色体上位置的具体信息。

根据对于目前软件中实现的不完全统计，Reads Pairs 有这几种储存方式：

* 直接用 paired-end 的 BAM 文件
* 使用 bgzip + tabix 索引的 TSV 文件
    + valid-pairs (Dekker lab)
    + pre file (juicebox)
* HDF5
    + fragmentHiC (hiclib)
* SQLite
* [Pairs format](https://github.com/4dn-dcic/pairix/blob/master/pairs_format_specification.md)

综合来看，BAM 是设计用来专门存储比对信息的，
如果后续的处理用不到具体的序列以及比对过程中的一些信息的话，
在进行格式转换后 BAM 就不用再留着占地方了。
HDF5 是一种数据容器，压缩比和读写效率都比较好，
各种编程语言的接口也比较完善，但格式比较自由，
还需要具体的标准来维持格式的统一。
SQLite 是一种比较轻量级的关系型数据库，和 HDF5 一样也需要有比较明确的
schema 标准才行，没有用过这样的软件，这里不做评价。
TSV 和 Pairs 都是文本文件，但可以通过 tabix/pairix + bgzip 对其进行
压缩和索引，减少存储空间并且方便读取一定染色体区域内的数据。
相较于其他存储方式，文本文件的好处是更容易编写程序处理。
并且对于 Pairs 数据，4DN-DCIC 已经制定了比较完善的标准，并提供了相应的工具。
目前来看可以考虑把 Reads Pairs 存成 pairix + bgzip 压缩索引过的 Pairs 文件。

### Contact Map

Contact Map 数据是 Reads Pairs 经过划 bin 后转换为矩阵得到的，
所以会有一定程度的信息损失。 Contact Map 从数据结构上来看其实就是一个矩阵，
但在存储形式上可以是稠密的矩阵也可以是稀疏矩阵。 根据划取的 bin 的大小 (binsize)
Contact Map 有不同的分辨率 (resolution) 之分，越高的 resolution 意味着
越小的 binsize，从中能观察出更精细的互作结构，但同时占用的存储空间也越大。
所以需要根据测序深度的大小来选取合适的 binsize。

对于 Contact Map 的存储，现有的格式：

* 文本文件
    + tab-delimited text
    + coordinated list
* Numpy 矩阵 (.npy)
* Dekker Lab HDF5
* Cooler
* .hic file (Aiden Lab)
* BUTLR (Yue lab)

综合上面所说的几个方面来考量这些存储格式，
文本文件，无论是稠密的 tab-delimited text 还是稀疏的 coordinated
显然是不够好的，一是占用空间大，二是不够结构化，不方便 random access，
对于很多软件的功能实现来说不是很方便。
还有一些软件使用的格式是 Numpy 矩阵，比如 pastis。
Numpy 矩阵相比于文本文件，访问和压缩上可能稍微好一点，
但单单用一个 Numpy 来存放 Contact Map 显得也太随便了一些，
存放的结构化信息也不够，而且 Numpy 矩阵本身就有很多种组织方式，不够标准化。
剩下的 4 种格式，总的来说其实也都还 OK，没有太大的毛病，也各有各的工具链。
但如果要做比较的话，
可能 .hic 和 Cooler 会稍微强一些。
首先数据压缩、多分辨率矩阵存储、数据访问做的都比较好，而且工具链的完善程度也比较高。
.hic 文件就不用多说了，首先有官方的 juicer 和第三方的 HiC-Pro 作为上游分析流程的支持，
juicebox 以及 juicebox.js 作为可视化工具也很好用，
而且官方也给出了多种语言访问文件的 API 以及一些其它的下游分析的工具比如 HiCCUPS，整个体系比较完整。
而 Cooler 在的标准制定上做的算是最好的，虽然目前只有 Python API，但本身是基于
HDF5 文件的，只要其它语言有 HDF5 的接口，加上有明确说明的格式标准，
实现一个数据接口并不困难。
而且 Cooler 有一个非常惊艳的可视化工具 [higlass](http://higlass.io/)，
可以点进它的页面看看，真的非常棒！
目前 Cooler 还比较新，很多软件还没有提供，但很有潜力成为未来 Contact Map 存储的通用标准。

## 参考资料

+ [Data Standards \| 4DN DCIC](http://dcic.4dnucleome.org/data%20standards/)
+ [Portable storage strategies](https://docs.google.com/document/d/1Ts9Hcvo-33UK3_pdRLLkMGiU04S7AA-26FM2MdkQw-g/edit)
+ [http://promoter.bx.psu.edu/hi-c/butlr.html](http://promoter.bx.psu.edu/hi-c/butlr.html)
+ [AidenLab](http://aidenlab.org/documentation.html)