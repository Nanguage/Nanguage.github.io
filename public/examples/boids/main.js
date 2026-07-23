//Create a Pixi Application
let app = new PIXI.Application({
    antialias: true,
    transparent: false,
    resolution: 1
  }
);
app.renderer.view.id = "view";
PIXI.AbstractRenderer.autoDensity = true;
app.renderer.resize(window.innerWidth-1, window.innerHeight-1);
app.renderer.backgroundColor = 0x00bfff;


//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


let getMousePos = (evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}


let Carrot = (pos) => {
  return {
    pos: pos,
    vel: [0, 0],
  }
}

let World = (n) => {
  let self = {
    boids: [],
    carrotPos: [0, 0]
  }
  for (i of Array(n).keys()) {
    let boid = Boid()
    boid.draw()
    self.boids.push(boid)
  }

  // add mouse movement event handle
  let getMousePos = (evt) => {
    let rect = evt.target.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  let canvas = document.getElementById('view')
  canvas.addEventListener('mousemove', (canvas, evt) => {
    let pos = getMousePos(canvas, evt)
    self.carrotPos = [pos.y, pos.x]  // update carrot position
    let message = document.getElementById("message")
    message.textContent = "carrot x: " + pos.x + " y: " + pos.y
  })

  // Update world
  self.step = () => {
    for (boid of self.boids) {
      boid.move(self.boids, Carrot(self.carrotPos))
    }
  }
  return self
}


let ArrowShape = () => {
  let self = new PIXI.Graphics
  self.beginFill(0x000000)
  self.drawPolygon([
    -12, 36,             //First point
    12, 36,              //Second point
    0, 0                 //Third point
  ]);
  self.endFill()
  self.rotateTo = (vel) => {
    let angle = diffAngle([-1, 0], vel)
    self.rotation = angle
  }
  return self
}


let Boid = () => {
  let self = {
    pos: randomPos(),
    vel: limitVec(randomVec()),
    body: undefined
  }

  self.draw = () => {
    let body = ArrowShape(self.pos)
    app.stage.addChild(body)
    self.body = body
  }

  self.getNeighbors = (boids, radius, angle) => {
    let neighbors = []
    for (boid of boids) {
      if (boid === self) {
        continue
      }
      // if out of range, skip
      let offset = vecSub(boid.pos, self.pos)
      if (vecNorm(offset) > radius) {
        continue
      }
      // if not within viewing angle, skip
      if (Math.abs(diffAngle(self.vel, offset)) > angle) {
        continue
      }
      neighbors.push(boid)
    }
    return neighbors
  }

  self.vecTorwardCenter = (vecs) => {
    if (vecs.length > 0) {
      let center = vecsMean(vecs)
      let toward = vecSub(center, self.pos)
      return limitVec(toward)
    } else {
      return [0, 0]
    }
  }

  self.center = (boids, radius, angle) => {
    let neighbors = self.getNeighbors(boids, radius, angle)
    let vecs = neighbors.map((b) => b.pos)
    return self.vecTorwardCenter(vecs)
  }

  self.avoid = (boids, carrot, radius, angle) => {
    let objs = boids.concat([carrot])
    let neighbors = self.getNeighbors(objs, radius, angle)
    let vecs = neighbors.map((b) => b.pos)
    return vecMulNum(self.vecTorwardCenter(vecs), -1)
  }

  self.align = (boids, radius, angle) => {
    let neighbors = self.getNeighbors(boids, radius, angle)
    let vecs = neighbors.map((b) => b.vel)
    return self.vecTorwardCenter(vecs)
  }

  self.love = (carrot) => {
    let toward = vecSub(carrot.pos, self.pos)
    return limitVec(toward)
  }

  self.setGoal = (boids, carrot) => {
    let w_avoid = 10,
        w_center = 5,
        w_align = 4,
        w_love = 10;
    let vecs = [vecMulNum(self.center(boids, 100, 1), w_center),
                vecMulNum(self.avoid(boids, carrot, 50, Math.PI), w_avoid),
                vecMulNum(self.align(boids, 100, 1), w_align),
                vecMulNum(self.love(carrot), w_love),]
    let goal = vecsSum(vecs)
    self.goal = limitVec(goal)
  }

  self.move = (boids, carrot) => {
    self.setGoal(boids, carrot)
    let mu = 0.1, dt = 1
    let vel = vecsSum([vecMulNum(self.vel, (1-mu)), vecMulNum(self.goal, mu)])
    self.vel = limitVec(vel)
    self.pos = vecsSum([self.pos, vecMulNum(self.vel, dt)])
    self.body.y = self.pos[0]
    self.body.x = self.pos[1]
    self.body.rotateTo(self.vel)
  }

  self.update = () => {
    //console.log(self.body.position, self.pos)
    //console.log(self.pos, self.vel)
  }

  return self
}

let world

let setup = () => {
  world = World(60)
  gameLoop()
}


let gameLoop = (delta) => {
  requestAnimationFrame(gameLoop)
  state(delta)
}

let play = (delta) => {
  world.step()
}

let state = play;

PIXI.Loader.shared.load(setup)
