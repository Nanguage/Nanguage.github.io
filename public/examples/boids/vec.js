let randomVec = () => {
  return [Math.random(), Math.random()]
}


let randomPos = () => {
  max_x = app.renderer.width
  max_y = app.renderer.height
  y = Math.random() * max_y
  x = Math.random() * max_x
  return [y, x]
}


let vecSub = (a, b) => {
  let c = []
  for (let i = 0; i < a.length; i++) {
    c.push(a[i] - b[i])
  }
  return c
}


let vecNorm = (vec) => {
  let ss = vec.map((i) => i**2).reduce((a, b) => a + b, 0)
  return Math.sqrt(ss)
}


let diffAngle = (vec1, vec2) => {
  return Math.atan2(vec2[0], vec2[1]) - Math.atan2(vec1[0], vec1[1])
}


let vecsSum = (vecs) => {
  let total = vecs[0].slice()
  for (let i = 1; i < vecs.length; i++) {
    vec = vecs[i]
    for (let j = 0; j < total.length; j++) {
      total[j] += vec[j]
    }
  }
  return total
}


let vecsMean = (vecs) => {
  let res = vecsSum(vecs)
  for (let i = 0; i < res.length; i++) {
    res[i] = res[i] / vecs.length
  }
  return res
}


let limitVec = (vec) => {
  if (vec.every((i) => i === 0)) {
    return Array(vec.length).fill(0)
  } else {
    let norm = vecNorm(vec)
    let res = []
    for (i of vec) {
      res.push(i / norm)
    }
    return res
  }
}


let vecMulNum = (vec, n) => {
  return vec.map((i) => i*n)
}

