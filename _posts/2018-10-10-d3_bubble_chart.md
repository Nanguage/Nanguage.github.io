---
layout: default
title: 用 D3.js 画一个 bubble chart
tags: bioinformatics
---

在展示 GO 富集分析的结果的时候经常会使用 bubble chart，
因为它的信息量相对来说比较大，bubble 的位置(x, y) ，大小和颜色，
每个属性都可以用来展示数据的某一维度信息。

<!--more-->

比方说，我可以这样建立数据到图形属性的映射关系：
```
Gene ratio -> x
GO item name -> y
-log2(Pvalue) -> size
mean log2(FoldChange) -> color
```

可以通过这四个属性把我想展示的 GO 富集的结果信息都放在一张图上。

为了学习 D3.js 试用它来做了一个 bubble char。

做出来的效果是这样的：

<html>
<script type="text/javascript" src="https://d3js.org/d3.v4.js"></script>
<style>
    #tooltip {
        position: absolute;
        width: auto;
        height: auto;
        padding: 10px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        pointer-events: none;
    }

    #tooltip.hidden {
        display: none;
    }

    #tooltip p {
        margin: 0;
        font-family: sans-serif;
        font-size: 16px;
        line-height: 20px;
    }
</style>
        <div class="figure">
        <div id="tooltip" class="hidden">
            <div id="value"></div>
        </div>
        </div>
        <script type="text/javascript">

            var dataset = [{'term': 'defense response', 'log2Pvalue': 71.0437, 'GOType': 'P', 'count': 186, 'ratio': 0.20852, 'log2fc': 2.524810647917315}, {'term': 'immune system process', 'log2Pvalue': 65.414, 'GOType': 'P', 'count': 248, 'ratio': 0.278027, 'log2fc': 2.3277763018614333}, {'term': 'immune response', 'log2Pvalue': 64.6232, 'GOType': 'P', 'count': 186, 'ratio': 0.20852, 'log2fc': 2.519873045077976}, {'term': 'response to external stimulus', 'log2Pvalue': 56.6091, 'GOType': 'P', 'count': 210, 'ratio': 0.235426, 'log2fc': 2.416689680230685}, {'term': 'response to organic substance', 'log2Pvalue': 51.5985, 'GOType': 'P', 'count': 247, 'ratio': 0.276906, 'log2fc': 2.1673254588535165}, {'term': 'regulation of cell differentiation', 'log2Pvalue': 6.1193, 'GOType': 'P', 'count': 83, 'ratio': 0.106003, 'log2fc': -2.171376617354984}, {'term': 'cell proliferation', 'log2Pvalue': 5.80914, 'GOType': 'P', 'count': 103, 'ratio': 0.131545, 'log2fc': -2.218731079456651}, {'term': 'regulation of developmental process', 'log2Pvalue': 5.36019, 'GOType': 'P', 'count': 107, 'ratio': 0.136654, 'log2fc': -2.3008876543327164}, {'term': 'neural precursor cell proliferation', 'log2Pvalue': 5.29832, 'GOType': 'P', 'count': 13, 'ratio': 0.0166028, 'log2fc': -2.287330229906211}, {'term': 'negative regulation of developmental process', 'log2Pvalue': 4.42285, 'GOType': 'P', 'count': 41, 'ratio': 0.0523627, 'log2fc': -2.2817255999353763}]

            // (data) - (graphic element) mapping:
// 
//     gene ratio    ->> x pos
//     term name     ->> y pos
//     -log2(PValue) ->> circle size
//     log2(fc)      ->> circle color

// sort dataset by gene ratio
dataset = dataset.sort(function(a, b) {return a.ratio - b.ratio})

var dim = {
    w: 900,
    h: 600,
}

var margin = {
    top: 10,
    bottom: 50,
    left: 350,
    right: 200,
}

var padding = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
}

var w = dim.w - margin.left - margin.right,
    h = dim.h - margin.top - margin.bottom

var circleConfig = {
    size: {
        min:10,
        max:20
    },
    color: {
        min: "#66ccff",
        max: "#ff9c9c",
    },
    padding: h / dataset.length,
}

var svg = d3.select("div.figure")
            .append("svg")
            .attr("width", dim.w)
            .attr("height", dim.h)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var xScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {return d.ratio}),
             d3.max(dataset, function(d) {return d.ratio})])
    .range([padding.left, w-padding.right])

var yScale = d3.scaleBand()
    .domain(dataset.map(function(d) {return d.term}))
    .range([h-padding.bottom, padding.top])
    .paddingInner(circleConfig.padding)

var rScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {return d.log2Pvalue}),
             d3.max(dataset, function(d) {return d.log2Pvalue})])
    .range([circleConfig.size.min, circleConfig.size.max])

var log2fc_min = d3.min(dataset, function(d) {return d.log2fc}),
    log2fc_max = d3.max(dataset, function(d) {return d.log2fc})

var cScale = d3.scaleLinear()
    .domain([log2fc_min, log2fc_max])
    .interpolate(d3.interpolateHcl)
    .range([circleConfig.color.min, circleConfig.color.max])

var circles = svg.append("g")
    .attr("id", "circles")
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
        return xScale(d.ratio)
    })
    .attr("cy", function(d) {
        return yScale(d.term)
    })
    .attr("r", function(d) {
        return rScale(d.log2Pvalue)
    })
    .attr("fill", function(d) {
        return cScale(d.log2fc)
    })
    .attr("opacity", 0.8)


var formatPercent = d3.format(".0%");

var numXTicks = 5
var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(numXTicks)
    .tickFormat(formatPercent)

var xTickFontSize = 18
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .style("font-size", xTickFontSize)
    .call(xAxis)

var yAxis = d3.axisLeft()
    .scale(yScale)

var yTickFontSize = 15
svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + 0 + ", 0)")
    .style("font-size", yTickFontSize)
    .call(yAxis)

var xAxisLabelSize = 20
svg.append("text")
    .attr("class", "x axis lable")
    .attr("transform", "translate(" + w/2 + "," + (h + 40) + ")")
    .text("Gene Ratio")
    .style("font-size", xAxisLabelSize)
    .attr("text-anchor", "middle")

var numStop = 10
svg.append("defs")
    .append("linearGradient")
    .attr("id", "color-gradient")
    .attr("x1", "0%").attr("y1", "100%")
    .attr("x2", "0%").attr("y2", "0%")
    .selectAll("stop")
    .data(d3.range(numStop))
    .enter().append("stop")
    .attr("offset", function(d, i) {
        return i / (numStop - 1)
    })
    .attr("stop-color", function(d, i) {
        return cScale( log2fc_min + (log2fc_max - log2fc_min) * (i / (numStop - 1)) )
    })

var colorBarConfig = {
    height: 100,
    width: 30,
    pos: {
        x: w + 20,
        y: 0.7 * h,
    },
    title: {
        content: "Mean log2(FC)",
        fontSize: 16,
    },
    space: 5,
    ticks: {
        num: 3,
        fontSize: 14,
    }
}

svg.append("text")
    .text(colorBarConfig.title.content)
    .style("font-size", colorBarConfig.title.fontSize)
    .style("font-weight", "bold")
    .attr("transform", "translate(" + colorBarConfig.pos.x + "," +
                                      colorBarConfig.pos.y + ")")

svg.append("rect")
    .attr("width", colorBarConfig.width)
    .attr("height", colorBarConfig.height)
    .attr("transform", "translate(" + colorBarConfig.pos.x + "," +
                       (colorBarConfig.pos.y + colorBarConfig.space) + ")")
    .style("fill", "url(#color-gradient)")

var cbScale = d3.scaleLinear()
    .domain(cScale.domain())
    .range([colorBarConfig.height, 0])

var cAxis = d3.axisRight()
    .scale(cbScale)
    .ticks(colorBarConfig.ticks.num)

var cbTicks = svg.append("g")
    .attr("class", "c axis")
    .attr("transform", "translate(" + (colorBarConfig.pos.x + colorBarConfig.width) +
                       "," + (colorBarConfig.pos.y + colorBarConfig.space) + ")")
    .style("font-size", colorBarConfig.ticks.fontSize)
    .call(cAxis)

cbTicks.selectAll("path")
    .style("fill", "none")
    .style("stroke", "none")


sizeBarConfig = {
    num: 3,
    pos: {
        x: w + 20,
        y: h * 0.3,
    },
    title: {
        content: "-log2(pvalue)",
        fontSize: 16
    },
    space: 5,
    stops: {
        start: 0.25,
        end: 1,
    }
}

var sizeBarTitle = svg.append("text")
    .attr("class", "sizebar")
    .text(sizeBarConfig.title.content)
    .style("font-size", sizeBarConfig.title.fontSize)
    .style("font-weight", "bold")
    .attr("transform", "translate(" + sizeBarConfig.pos.x + "," +
                                      sizeBarConfig.pos.y + ")")

var getCircleExamples = function() {
    var ratio, size;
    var circleExamples = [],
        rs = sizeBarConfig.stops.start,
        re = sizeBarConfig.stops.end,
        smin = rScale.range()[0],
        smax = rScale.range()[1],
        logp_max = d3.max(dataset, function(d) {return d.log2Pvalue}),
        logp_min = d3.min(dataset, function(d) {return d.log2Pvalue})
    for (var i = 0; i < sizeBarConfig.num; i++) {
        ratio = rs + (re - rs) / (sizeBarConfig.num - 1) * i
        size = smin + (smax - smin) * ratio
        log2Pvalue = logp_min + (logp_max - logp_min) * ratio
        circleExamples.push({size: size, log2Pvalue: log2Pvalue})
    }
    return circleExamples
}

circleExamples = getCircleExamples()

var sizeBarCircles = svg.append("g")
    .attr("class", "sizebar")
    .attr("transform", "translate(" + sizeBarConfig.pos.x + "," +
                                      sizeBarConfig.pos.y + ")")
    .selectAll("circle")
    .data(circleExamples).enter()
    .append("circle")
    .attr("cx", function(d, i) {
        return rScale.range()[1]
    })
    .attr("cy", function(d, i) {
        return rScale.range()[1] + i * 2 * rScale.range()[1]
    })
    .attr("r", function(d, i) {
        return d.size
    })
    .attr("fill", "#555555")
    .attr("opacity", 0.8)

var sizeBarLabels = svg.append("g")
    .attr("class", "sizebar")
    .attr("transform", "translate(" + sizeBarConfig.pos.x + "," +
                                      sizeBarConfig.pos.y + ")")
    .selectAll("text")
    .data(circleExamples).enter()
    .append("text")
    .attr("x", function(d, i) {
        var rmax = rScale.range()[1]
        return 2 * rmax
    })
    .attr("y", function(d, i) {
        var rmax = rScale.range()[1]
        return rmax + i * 2 * rmax + 5
    })
    .text(function(d) {
        return d.log2Pvalue.toFixed(2)
    })

        </script>
</html>

具体的代码放到了这个
[repo](https://github.com/Nanguage/D3-bubble-chart-example) 里面，

D3.js 非常强大的绘图库，可以创建具有强动态效果的交互式
网页 SVG 图像。
交互式图像可以说是未来数据绘图的一种趋势，
而且用这种 html 模板渲染 D3.js 做图表的方式，
非常适合用来做生信软件或者 pipeline 的报告。
虽然现在也有一些其他语言的绘图库也可以做这类事情，
比如 Python 的 Plotly、Bokeh、Pygal 等等，
但总体来看，这些包还是不如 D3.js 强大、灵活。
所以 D3.js 还是非常值得研究一下的。
