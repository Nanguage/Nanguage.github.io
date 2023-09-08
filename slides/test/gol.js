log = console.log.bind(console)

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

const randInit = (i, j) => {
    /**
     * init cell randomly, half chance alive, half chance dead
     */
    return Math.floor(Math.random() * 2)
}

const around = (matrix, y, x, borderSize=1) => {
    /**
     * get the sub-matrix which is around the cell 'matrix[y][x]'
     * borderSize: how many layers around the center, default 1
     */
    let b = borderSize
    let size = b * 2 + 1
    let center = b + 1
    let len_y = matrix.length
    let len_x = matrix[0].length
    let around = genMatrix(size, size, (i, j)=>{
        let pos_y = (y + (i + 1 - center)) % len_y
        let pos_x = (x + (j + 1 - center)) % len_x
        pos_y = (pos_y < 0) ? len_y + pos_y : pos_y
        pos_x = (pos_x < 0) ? len_x + pos_x : pos_x
        let alive = matrix[pos_y][pos_x]
        return alive
    })
    return around
}

const sum2D = (matrix) => {
    /**
     * get the sum value of 2D matrix.
     */
    let sum = 0
    for (let i = 0; i < matrix.length; i++) {
        for (let j =  0; j < matrix[i].length; j++) {
            sum += matrix[i][j]
        }
    }
    return sum
}

const getCenter2D = (matrix) => {
    /**
     * get the center element of matrix
     */
    h = matrix.length 
    w = matrix[0].length
    hc = Math.floor(h/2)
    wc = Math.floor(w/2)
    return matrix[hc][wc]
}

const printMatrix = (matrix) => {
    /**
     * print matrix in a easy to read format,
     * for debug
     */
    let str = ""
    for (let i = 0; i < matrix.length; i++) {
        for (let j =  0; j < matrix[i].length; j++) {
            str += matrix[i][j] + " "
        }
        str += "\n"
    }
    log(str)
}
const world = (canvas, width=100, height=100, fps=1) => {
    /**
     *  Conway's game of life
     */
    let context = canvas.getContext('2d')
    let status = genMatrix(width, height)

    let w = {
        canvas: canvas,
        context: context,
        width: width,
        height: height,
        status: status,
        fps: fps,
        stoped: false,
    }

    w.update = function() {
        /**
         * update the status according to the rule.
         */
        let next = genMatrix(this.width, this.height, (i, j) => {return 0})
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let neighbors = around(this.status, i, j)
                let alive = this.status[i][j]
                let n = sum2D(neighbors) - alive
                let nextAlive
                if (alive) {
                    if (n < 2) {
                        nextAlive = 0
                    } else if (n > 3) {
                        nextAlive = 0
                    } else {
                        nextAlive = 1
                    }
                } else {
                    if (n == 3) {
                        nextAlive = 1
                    } else {
                        nextAlive = 0
                    }
                }
                next[i][j] = nextAlive                
                //printMatrix(this.status)
                //printMatrix(neighbors)
                //log(i, j, nextAlive)
            }
        }
        //printMatrix(this.status)
        //printMatrix(next)
        //log('---------------')
        this.status = next.slice()
    }

    w.display = function(colors={ 0: 'white', 1: 'black', }) {
        /**
         * display the world's status in canvas
         */
        let [w, h] = [this.canvas.width/this.width,
                      this.canvas.height/this.height]
        let ctx = this.context
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let alive = this.status[i][j]
                ctx.fillStyle = colors[alive]
                ctx.fillRect(j*w, i*h, w, h)
            }
        }
    }

    w.run = function() {
        /**
         * runloop
         */
        if (!this.stoped) {
            this.update()
            this.display()
            setTimeout(() => {
                w.run()
            }, 1000/this.fps)
        } else {
            return
        }
    }

    w.pause = function() {
        /**
         * pause runloop
         */
        this.stoped = true
    }

    w.continue = function() {
        /**
         * revert to runloop
         */
        this.stoped = false
        w.run()
    }

    w.step = function() {
        /**
         * update just one step
         */
        this.update()
        this.display()
    }

    w.clear = function() {
        /**
         * clear status to an empty matrix
         */
        this.status = genMatrix(this.width, this.height,
             (i, j) => {return 0})
    }

    w.init = function(initFunc=randInit) {
        /**
         * init status use a init function
         */
        this.status = genMatrix(this.width, this.height, randInit)
    }

    return w
}

const eventHandler = (world) => {
    eh = {
        w: world,
    }
    document.querySelector("#pause").addEventListener("click", () => {
        eh.w.pause()
    })
    document.querySelector("#continue").addEventListener("click", () => {
        eh.w.continue()
    })
    document.querySelector("#step").addEventListener("click", () => {
        eh.w.step()
    })
    document.querySelector("#clear").addEventListener("click", () => {
        eh.w.clear()
        eh.w.display()
    })
    document.querySelector("#init").addEventListener("click", () => {
        eh.w.init()
        eh.w.display()
    })

    document.querySelector("button.set-fps").addEventListener("click", () => {
        let input = document.querySelector("input.set-fps")
        let fps = Number(input.value)
        eh.w.fps = fps
    })

    eh.w.canvas.addEventListener('mousedown', (event) => {
        // change the cell status which has been clicked
        let size = eh.w.canvas.width/eh.w.width
        let y = event.offsetY
        let x = event.offsetX
        let i = Math.floor(y/size) 
        let j = Math.floor(x/size) 
        alive = eh.w.status[i][j]
        eh.w.status[i][j] = alive ? 0 : 1
        eh.w.display()
    })
    return eh
}
const assert = (condition, message) => {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

const __test__ = () => {
    let m = [
        [0, 1, 0, 1],
        [1, 1, 0 ,1],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
    ]
    let m0 = around(m, 0, 1)
    let expect_m0 = [
        [0, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
    ]
    let m1 = around(m, 1, 0)
    let expect_m1 = [
        [1, 0, 1],
        [1, 1, 1],
        [1, 1, 1],
    ]
    assert(JSON.stringify(m0) == JSON.stringify(expect_m0),
           "around function error")
    assert(JSON.stringify(m1) == JSON.stringify(expect_m1),
           "around function error")
    assert(sum2D(m0) == 3, "sum2D function error")
    assert(getCenter2D(m0) == 1, "getCenter2D function error")

    //canvas = document.getElementById('world')
    //let w = world(canvas, 4, 4)
    //w.status = m
    //w.display()
    //w.run()
}

const __main__ = () => {
    canvas = document.getElementById('world')
    w = world(canvas, 200, 200)
    eh = eventHandler(w)
    w.fps = 10
    w.run()
}

//__test__()
__main__()
