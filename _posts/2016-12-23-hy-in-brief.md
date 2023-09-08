---
layout: default
title: Python生态下的Lisp方言
tags: notes
date: 2016-12-23 20:40:12
---

前几天我在这篇[Python函数式编程从入门到走火入魔](http://blog.rainy.im/2016/12/04/fp-with-py/)里看到了这样一门Python生态下的Lisp方言---[Hy](https://github.com/hylang/hy)，惊为天人，原来还有这么好玩的东西！虽然我没什么Lisp水平吧，SICP断断续续的读了不知道多长时间了，现在处于一种从入门到放弃的状态中，但我一直还是非常想深入了解一下Lisp和函数式编程的，而且令人兴奋的是它是根植于Python生态的，也就是说可以用Lisp写requests爬虫，写Flask网站，用Pandas分析数据，所有Python生态下极具生产力的库还可以用！还是原来的味道！这是多么cool的事情啊～

![https://xkcd.com/224/](https://camo.githubusercontent.com/2ea3c517525377dbb66d22c6e27dd2334af4731e/68747470733a2f2f7261772e6769746875622e636f6d2f68796c616e672f73687974652f313866363932356530383638346230653166353262326363326338303339383963643632636439312f696d67732f786b63642e706e67)

关于Lisp这门语言的一些情况这里也不多说了，如果你不是特别了解建议阅读这篇[Lisp的本质](http://www.cnblogs.com/Leap-abead/articles/762180.html)和阮一峰翻译的[这篇博文](http://www.ruanyifeng.com/blog/2010/10/why_lisp_is_superior.html)。Hy是众多Lisp方言中的一种，将代码编译成Python的字节码后交给解释器解释运行，Hy之于Python类似于[Clojure](https://en.wikipedia.org/wiki/Clojure)（另一种基于JVM的Lisp方言）之于Java，它们都是作为目标语言虚拟机的前端来利用目标语言的生态。
<!-- more --> 

## 环境配置

安装很简单只需要
``` bash
$ pip install git+https://github.com/hylang/hy.git
# 注意 这里不要直接 pip install hy 这样从pypi直接安装，有坑...我已经踩过了
```
安装之后可以尝试一下在终端里输入hy然后敲回车就能进入它的REPL，就和Python的REPL一样，你可以通过在里面尝试敲一下代码来学习它的语法和调试代码。
至于编辑器，用vim的话推荐[vim-hy](https://github.com/hylang/vim-hy)这个插件，除了提供语法高亮和缩进外，还能把一些符号排版成类似数学符号的Unicode字符。

## 动手写

在大概看了一下文档之后，写了一段用matplotlib绘图的hy代码，感觉意外的轻松，比原来写别的Lisp的时候感觉好多了，可能是因为它的语义是和Python完全一致的，不好写的地方都可以转换成Python的思路来解决吧，给人的感觉还是在写Python，只不过把函数和方法调用前缀表达式（不熟悉Lisp可能不清楚，就是把表达式的操作符放在最前面，比如 “a+b” 用前缀表达式来写就是 “+ a b” ）写在了括号里而已，就像官方文档的Style Guild部分说的“Keep in mind we’re not Clojure. We’re not Common Lisp. We’re Homoiconic Python, with extra bits that make sense.” 不要把它当成其他的什么语言，只要把它当成长得有点不一样的Python就行了。

``` clojure
(import [matplotlib [pyplot :as plt]])
(import time)

(.xkcd plt)
(setv (, fig, ax) (.subplots plt))

(defn draw-circle [r0 r-max r-step]
  (setv r r0)
  (if (< r r-max) (do (-> (.Circle plt (, 0.5 0.5) r :color "black" :fill False) (ax.add-artist))
      (setv r (+ r r-step))
      (draw-circle r r-max r-step))))

(draw-circle 0.2 1 0.02)
(.text plt 0.5 0.5 (.upper "happy hack with hy!") :va "center" :ha "center")
(.show plt)
```

运行后就能得到这样一副xkcd风格的图像，好像线条有点太密集了...

![happyhackwhy](/images/blog/happyhackwithhy.png)

接下来，我们就来比较详细地了解一下这门语言吧，你不需要懂Lisp（实际上我也不懂( ´･ω) ...），只要对Python有所了解，那么你看完接下来的文字后，一定是能够理解它的。

### 伪装成Lisp的Python

之所以这么说是因为Python中的数据结构、语法特性在Hy中都能找到对应物，首先举几个数据结构的例子(下文示例中的“=>”符号代表Hy解释器的提示符)：
``` clojure
;字符串
;Hy的字符机制和Python3是一致的，统一使用Unicode，摒弃了Python2的错误
;Hy的字符串有两种写法,第一种在Hy中称为Symbol,语法是在字母前加一个单引号：
=>'hello
u"hello"
=> '你好
u'\u4f60\u597d'

;第二种是双引号括起来的字符串，可以表示多行字符类似于Python中的三引号
=> "[Q]:what is hy?
... [A]:A dialect of Lisp 
... that's embedded in Python"
u"[Q]:what is hy?\n[A]:A dialect of Lisp \nthat's embedded in Python"

;列表
;Python中最常用的数据结构在Hy中还是用方括号括起来只不过不用写中间的逗号了
=> [1 2 3 4]
[1L, 2L, 3L, 4L]
=> (def data ["panty" "stocking" "garterbelt"])
=> (get data 1)
u"stocking"

;元组
;用S表达式来表达，操作符是逗号
=> (, "hello" "hy")
(u'hello', u'hy')

;字典
=> {'Sunday '星期天 'Saturday '星期天}
{u'Sunday': u'\u661f\u671f\u5929', u'Saturday': u'\u661f\u671f\u5929'}
=> (print (get _ 'Sunday))
星期天
```
赋值、控制流、函数定义：
``` clojure
;赋值可用 def 或者 setv 但一般def用于定义全局变量,setv用于定义局部变量
=> (def n 41)
=> (print n)
41
=> (setv n (inc n))
=> (print n)
42
;除了这些，还有Lisp中的let，可以用来显式地创建词法作用域
=> (let [n 'nana
...      q 'haqi]
...     (print (+ n " " q)))
nana haqi
=> n
42L
=> q
Traceback (most recent call last):
  File "<input type="text" />", line 1, in 
NameError: name 'q' is not defined

;条件语句
=> (print (if (< n 0.0) "negative" ... (= n 0.0) "zero" ... (> n 0.0) "positive"
...            "not a number"))
positive
;或者用cond
=> (print (cond [(< n 0.0) "negative"] ... [(= n 0.0) "zero"] ... [(> n 0.0) "positive"]
...              [True "not a number"]))
positive
;for循环
=> (for [x (range 3)] (print x))
0
1
2
;while循环
(while True (print 'hy))
hy
hy
hy
...

;函数定义，没有显式的return，最后一条表达式的求值结果就是返回值
=> (defn fizzbuzz [i]
...   (cond [(= 0 (% i 15)) 'FizzBuzz]
...         [(= 0 (% i 3)) 'Fizz]
...         [(= 0 (% i 5)) 'Buzz]
...         [True i]))
;函数调用
=> (fizzbuzz 15)
u'FizzBuzz'

```
上面的例子是基本的数据结构和控制流，此外Python中的列表推导、with语句、生成器函数等高级语法特性在Hy中也有实现。
``` clojure
;列表推导
=> (list-comp (** x 2) [x (range 10)])
[0L, 1L, 4L, 9L, 16L, 25L, 36L, 49L, 64L, 81L]
;带条件后缀的列表推导
=> (list-comp (** x 2) [x (range 10)] (odd? x))
[1L, 9L, 25L, 49L, 81L]
;字典推导
=> (dict-comp x (* x 2) [x (range 10)] (odd? x))
{1: 2, 3: 6, 9: 18, 5: 10, 7: 14}
;genexpr ；类似于列表推导但产生的是一个generator
=> (def filtered (genexpr x [x (range 10)] (even? x)))
=> (list filtered)
[0, 2, 4, 6, 8]

;with
=> (with [f (open "./test.txt")] (print (.read f)))
first line
second line

;生成器函数(yield)
=> (defn fib []
...   (setv (, a b) (, 0 1))
...   (while True
...     (yield a)
...     (setv (, a b) (, b (+ a b)))))
=> (list (take 10 (fib)))
[0L, 1L, 1L, 2L, 3L, 5L, 8L, 13L, 21L, 34L]
```
当然也少不了面向对象。
``` clojure
;这样定义类
=> (defclass FooBar [object]
...   "Yet Another Example Class"
... 
...   (defn --init-- [self x]
...     (setv self.x x))
... 
...   (defn get-x [self]
...     "Return our copy of x"
...     self.x))
;创建对象
=> (def foobar (FooBar 42))
=> foobar

=> foobar.x
42L
;方法调用
=> (foobar.get-x)
42L
;你也可以用前缀表达式调用类方法，并且更建议这么做
=> (.get-x foobar)
42L
```

## 函数式编程

虽然在Hy里所有的东西还是可以用Python的思路来搞，不过既然是Lisp方言，那么在这里一定会比Python有更多的对函数式编程的支持了。根据对函数式编程肤浅的理解，函数式编程的思路是通过函数间的耦合组建数据处理的管道，在写法上尽量少定义中间变量，尽量控制函数副作用。下面举几个Hy中与函数式编程有关的语法特性。

``` clojure
;首先Python中的 map、reduce、filter 以及 lambda 这些函数式编程的基本组件在Hy中还是一样的
;lambda算子(匿名函数) 和可以使用fn或者lambda来表示
=> (fn [x] (+ x 1))
=> (lambda [x] (+ x 1))
<function <lambda> at 0x7f9b61fe1de8>
=> (_ 1)
2L

;Hy中的map、filter和Python3是一致的，返回的是一个可迭代的延迟求值的对象，而非Python2那样直接返回列表
;map
=> (map (fn [x] (* x x)) (range 1 11))

=> (list _) ;这时把它转换成list的时候才会对map进行求值
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
;filter
=> (filter odd? (range 1 11))

=> (list _)
[1, 3, 5, 7, 9]
;reduce
=> (reduce (fn [a b] (* a b)) (range 1 11)) ;从1开始累乘到10
3628800
```

##### 尾递归优化

![](https://imgs.xkcd.com/comics/functional.png)


函数式编程尽量不修改状态而使用函数的参数来传递状态所以会使用递归的写法，为了避免递归带来的爆栈问题，很多函数是编程语言都会引入了[尾递归优化](http://www.ruanyifeng.com/blog/2015/04/tail-call.html)，Hy中没有那种直接的对函数的尾递归优化，尾递归需要借助外部宏来完成，而且经我测试尾递归优化代码的执行速度比较慢...这还是挺遗憾的。
``` clojure
(require [hy.contrib.loop [loop]]) ;导入外部宏

(defn factorial [n]
  (loop [[i n] [acc 1]]
  ;通过loop创建递归的开始点，并初始化递归参数
    (if (zero? i)
      acc
      ;通过recur进入下一轮递归，如果recur不写在结尾位置就会报错
      (recur (dec i) (* acc i)))))

(factorial 1000)
```

##### 管道

函数式编程中为了尽量不去使用中间变量经常需要对函数进行组合使用，这时就要使用嵌套调用的写法，举一个简单的例子，比如我们要把从0到99的所有数字进行乘方后加1然后再筛选出其中的奇数。用函数式的写法，不使用中间变量，可以这样一行搞定：
``` clojure
=> (filter odd? (map inc (map (fn [x] (* x x)) (range 100))))

=> (list _)
[1L, 5L, 17L, 37L, 65L, 101L, 145L, 197L, 257L, 325L, 401L, ...]
```
虽然这样一行就能表达这样的计算过程写起来很爽，但是连续好几层的函数嵌套使得可读性比起命令式编程那样每一步都清楚地写出中间变量的写法差了不少。为了解决这个问题Hy与Clojure一样引入了threading macro，以上面的计算为例，使用threading macro可以这样写:
``` clojure
=> (->> (range 100) (map (fn [x] (* x x))) (map inc) (filter odd?))

=> (list _)
[1L, 5L, 17L, 37L, 65L, 101L, 145L, 197L, 257L, 325L, 401L, ...]
```
这里表达式中的操作符“->>”（这里不妨称之为管道操作符）表示该表达式为一个threading，你可以把它看成一个处理数据的流水线或者说是管道(pipeline)，其后的第一个表达式会产生产生即将要流经管道的数据，后面的每一个参数都是一个负责加工数据的函数，数据会从左至右流过管道经过加工最后产生输出。可以看到还是一行代码，但这种写法比起函数的嵌套调用要好理解多了。
如果你对Unix shell有所了解，那么你应该很快能理解。没错，这和shell中的管道很像，而且的确可以通过threading macro来组合命令行调用，就像在shell中做的那样：
``` clojure
=> (import [sh [cat grep wc]]) ;需要事先安装sh模块: pip install sh
=> (-> (cat "/usr/share/dict/words") (grep "-E" "^hy") (wc "-l"))
210
```
你也许注意到了Hy中默认的管道操作符有两种:"->"和"->>"，前者会把数据作为后续函数的第一个参数来传递，而后者会将其作为最后一个参数来传递。那如果想让数据从任意的位置流入函数的话应该怎么办呢？这时可以使用外部宏[Anaphoric Macros](http://docs.hylang.org/en/latest/contrib/anaphoric.html)来实现:
``` clojure
(require [hy.contrib.anaphoric [ap-pipe]])

=> (ap-pipe 3 (+ it 1) (/ 5 it))
1.25
=> (ap-pipe [4 5 6 7] (list (rest it)) (len it))
3
```
此外还有面向对象的版本：
``` clojure
=> (doto [] (.append 1) (.append 2) .reverse)
[2L, 1L]
```

## 来自Lisp的力量:宏

![《画手》 埃舍尔](https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/DrawingHands.jpg/300px-DrawingHands.jpg)

宏(Macro)是什么呢？你可能在C语言中使用过宏来对变量进行替换，在Lisp中宏是一种更为强大的机制，它不像C那样通过预处理器来工作而是直接使用Lisp解释器对其进行解释（这意味着宏的地位和其它程序代码是相同的），在Lisp中宏能像函数那样接受参数，得到参数后会对原来的S表达式按照特定方式展开成新的S表达式。在代码被解释的过程中经历了两个阶段，第一个阶段代码本身被当做数据被宏进行展开，第二个阶段才被解释器当做“代码”来进行解释，这体现“代码即数据”这一思想。简单来说宏就是用来生成代码的代码，也就是所谓的元编程，经常有人拿埃舍尔的《画手》中的描绘的场景来进行比喻元编程，用来写代码的代码就仿佛埃舍尔画中那正在画手的手。
接下来开始说一说Hy中的宏。实际上你可能注意到了之前提到的语法特性比如threading还有loop recur和ap-pipe都是通过宏来实现的。除了使用语言内建的宏和用require导入外部宏，我们也可以自己定义宏，举一个例子，我们现在有以下四种计算fibonacci数列的函数写法，需要检验它们的运行效率：
``` clojure
(require [hy.contrib.loop [loop]])
(import time)
(import sys)

(.setrecursionlimit sys 1000) ;放宽递归深度限制

(defn fib-recur [n] ;递归的写法
  (if (in n '(0 1))
    (long n)
    (+ (fib-recur (- n 1)) (fib-recur (- n 2)))))

(defn fib-iter [n &optional [a 0] [b 1]] ;迭代的写法，但形式上还是递归的
  (if (zero? n)
    a
    (fib-iter (dec n) b (+ a b))))

(defn fib-tco [n] ;使用尾调用优化的写法
  (loop [[i n] [a 0] [b 1]]
    (if (zero? i)
      a
      (recur (dec i) b (+ a b)))))

(defn fib-gen [] ;使用生成器的写法
  (setv (, a b) (, 0 1))
  (while True
    (yield a)
    (setv (, a b) (, b (+ a b)))))
```
按照一般的方法检查运行效率，我们需要在目标代码的前后记录当前时刻，然后计算目标代码的运行时间，就像下面这样。
``` clojure
(def s (.time time))
(-> (fib-iter 500) print)
(-> (- (.time time) s) print)
```
但我们有四个函数，所以上面的代码就要重复四遍，如果这样做就会显得十分冗长。这时我们就能通过宏来解决这个问题：
``` clojure
(defmacro timeit [code &optional [label "code"]]
  `(do 
      (setv s (.time time))
      ~code
      (print (.format "{l} run cost {t}s.\n" :l ~label :t (- (.time time) s)))))
```
上面这段宏以一个S表达式作为参数，在调用时会被自动展开成其两侧被加上了计时相关代码的形式。然后只需要一行代码就能对代码进行性能分析了：
``` clojure
;递归写法的fib计算实在太慢，这里就不考虑它了...
(timeit (-> (fib-iter 500) print) 'fib-iter)
(timeit (-> (fib-tco 500) print) 'fib-tco)
(timeit (-> (nth (fib-gen) 500) print) 'fib-gen)
;运行结果：
;139423224561697880139724382870407283950070256587697307264108962948325571622863290691557658876222521294125
;fib_iter run cost 0.000308990478516s.
;
;139423224561697880139724382870407283950070256587697307264108962948325571622863290691557658876222521294125
;fib_tco run cost 0.000863075256348s.
;
;139423224561697880139724382870407283950070256587697307264108962948325571622863290691557658876222521294125
;fib_gen run cost 0.000124216079712s.
```
甚至可以通过[reader macro](http://docs.hylang.org/en/latest/language/readermacros.html)让代码变得更加魔性:
``` clojure
(defreader t [code]
  `(do
      (setv s (.time time))
      ~code
      (print (.format "code run cost {t}s.\n" :t (- (.time time) s)))))

#t(-> (nth (fib-gen) 500) print)
;结果:
;139423224561697880139724382870407283950070256587697307264108962948325571622863290691557658876222521294125
;code run cost 0.000133037567139s.
```

## 迈向实用：与Python交互

Hy根植于Python生态，可以与Python之间无缝衔接，使用Python的库只需要import就行，与Python中存在的那几种import方式是相对应的，比如:
``` clojure
(import requests) ;相当于 import requests
(import [Bio [Seq Align]]) ;from Bio import Seq, Align
(import [Bio [*]]) ;from Bio import *
(import [matplotlib [pyplot :as plt]]) ;from matplotlib import pyplot as plt
```
在Python中调用Hy代码也是非常容易的，以上面那四个计算fib的函数为例，我把它们保存在名为"fib_bench.hy"的文件里，然后进入Python的REPL:
``` python
>>> import hy # 在导入Hy模块前需要先import hy
>>> from fib_bench import *
>>> [fib_iter(i) for i in range(10)]
[0L, 1L, 1L, 2L, 3L, 5L, 8L, 13L, 21L, 34L]
```
到这里已经可以写可以用于生产的Hy代码了，虽然我目前还没试过，但已经有人这么做了，比如之前提到的hy的vim插件就是用hy本身实现的，还有官方文档上提到的几个例子，比如这个[IRC机器人](https://github.com/hylang/hygdrop)，还有这个[django项目](https://github.com/paultag/djlisp/tree/master/djlisp)，实际上，你到github上搜一下还能找到不少。

## 结语

个人感觉还是挺喜欢这门语言的，虽然它的社区规模目前还很小，如果程序规模一大还不知道会踩什么坑，但以lisp的语法来组织带有Python语义的代码，以及使用宏来进行更高阶的抽象对于我来说，这所带来的新鲜感实在是太强了。当然以我目前的水平还没有办法成为开发者来直接为它贡献力量，但我是十分乐意用Hy来写一些数据处理和系统管理脚本和为它做一些小小的安利工作的。相信，如果你坚持读到了这里，你也许也会这么想吧。
