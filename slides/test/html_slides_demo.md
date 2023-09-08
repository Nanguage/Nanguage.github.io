class: center, middle

# HTML Slides example
## by Nanguage

![](./018.gif)

---
## Examples

Create Slides easily with markdown.

---
### 1.1 Code block

Python code.

```python
def fetch_pixels(self, genome_range1,
                       genome_range2=None,
                       join=True):
    mat = self.cool.matrix(as_pixels=True, join=join)
    chrom1, start1, end1 = split_genome_range(genome_range1)

    if chrom1 not in self.cool.chromnames:
        chrom1 = change_chrom_names(chrom1)

    if genome_range2 is not None:
        chrom2, start2, end2 = split_genome_range(genome_range2)
        if chrom2 not in self.cool.chromnames:
            chrom2 = change_chrom_names(chrom2)
        pixels = mat.fetch(str(GenomeRange(chrom1, start1, end1)),
                           str(GenomeRange(chrom2, start2, end2)))
    else:
        pixels = mat.fetch(str(GenomeRange(str(GenomeRange(chrom1, start1, end1)))))

    return pixels

```

---
### 1.2 Code block

JS code.

```javascript
const genMatrix = (width, height, initFunc=randInit) => {
    /**
     * generate matrix(2D Array)
     * initFunc(i, j) : init function of cell in position (i, j),
     *     default random init.
     */
    let m = new Array()
    for (let i = 0; i < height; i++) {
        m[i] = new Array()
        for (let j = 0; j < width; j++) {
            m[i][j] = initFunc(i, j)
        }
    }
    return m
}
```

---
## 2. Images

![](https://img.moegirl.org/common/6/66/Shoujo_Shuumatsu_Ryokou_Vol_6ll.jpg)

---
## 3. Video
<iframe width="560" height="315" src="https://www.youtube.com/embed/9lNZ_Rnr7Jc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

---
## 4. JS Cavas

<html lang="en">
    <head>
        <title>game-of-life</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            h1#title {
                text-align: center;
            }
            canvas#world {
                border: 1px solid black;
                margin: auto;
                padding: 0;
                display: block;
            }
            div.control {
                padding-top: 10px;
                text-align: center;
            }
            div.control .basic {
                padding-bottom: 10px;
            }
        </style>

        <script> log = console.log.bind(console) </script>
    </head>
    <body>
        <div class="app">
            <h1 style="font-size:16pt" id="title">Conway's Game of Life</h1>
            <canvas id="world" width=400 height=400></canvas>
            <div class="control">
                <div class="basic">
                    <button id="pause">pause</button>
                    <button id="continue">continue</button>
                    <button id="step">step</button>
                    <button id="clear">clear</button>
                    <button id="init">init</button>
                </div>
                <div class="fps">
                    fps (default 10):
                    <input class="set-fps" type="text">
                    <button class="set-fps">OK</button>
                </div>
            </div>
        </div>
    </body>
</html>

---
## And so on...
