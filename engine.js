console.log(canvas)
canvas.width = 800
canvas.height = 800
const ctx = canvas.getContext("2d")
console.log(ctx)

const BACKGROUND = "#101010"
const VERTICES_FOREGROUND = "#11FF50"
const LINES_FOREGROUND = "#FFFF50"

const FPS = 600;
let dt_fps = 1 / FPS;

const point_pixels_width = 10
const line_pixels_width = 1
const point_half = point_pixels_width / 2

function clear() {
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function draw_point({x, y}, pixels_width, foreground) {
  let width = pixels_width;
  ctx.fillStyle = foreground
  x = x - point_half
  y = y - point_half
  ctx.fillRect(x, y, width, width)
}

function draw_line(p1, p2, pixels_width, foreground) {
  ctx.lineWidth = pixels_width
  ctx.strokeStyle = foreground
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()

  let height = p2.x
  let heightPx = height/4
  ctx.font = heightPx + "px verdana";

  // ctx.fillText("test", p1.x, p1.y, maxWidth)
  ctx.strokeText("test", p2.x, p2.y, heightPx)
  // ctx.fillText("x: "+ ~~(p1.x-(p1.x*.88)), 2, 50, 300)
  // ctx.fillText("y: "+ ~~p1.y, 2, 100, 300)
}

function positivize(centered_point) {
// yields
//   -1..1 => 0..2
  return {
    x: centered_point.x + 1,
    y: centered_point.y + 1
  }
}

function normalize(positivized_point) {
// yields
//   -1..1 => 0..2 => 0..1  
  return {
    x: positivized_point.x / 2,
    y: positivized_point.y / 2
  }
}

function canvasIze(normalized_point) {
// yields
//   -1..1 => 0..2 => 0..1 => 0..w/h
  return {
    x: normalized_point.x * canvas.width,
// (4of4) reorient y axis
    y: (1 - normalized_point.y) * canvas.height
  }
}

// translate point (x,y) from screen center coordinates (0, 0) to HTML canvas top left coordinates (0, w/h), i.e,
//    -1..1 => 0..w/h
function translateCenterPointToCanvasPoint(centered_point) {
// (1of3) translate negative coord to positive coord
  let positivized_point = positivize(centered_point);
// (2of3) divide by 2 normalizes the result
  let normalized_point = normalize(positivized_point)
// (3of3) multiply by width & height gives HTML canvas w/h coordinate
  let canvas_point = canvasIze(normalized_point)
  return {
    x: canvas_point.x,
    y: canvas_point.y
  }
}

function project_3d_to_2d({x, y, z}) {
  return {
    x: x / z,
    y: y / z
  }
}

function rotate({x, y, z}, theta) {
  // theta *= .01 * theta // rotation speed
  let cos_theta = Math.cos(theta);
  let sin_theta = Math.sin(theta);
  return {
    x: x * cos_theta - z * sin_theta,
    y,
    z: x * sin_theta + z * cos_theta
  }
}

function translate({x, y, z}, dz) {
  // return {x, y, z: z + dz}
  return {x, y, z: z + 2}
}

let dz = 0;
let theta = 0

function draw_lines(dz, theta, vertices, lines) {
  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      const start = vertices[line[i]] // first vertex
      const end = vertices[line[(i + 1) % line.length]] // % == last vertex wrap around 
      draw_line(
          translateCenterPointToCanvasPoint(
              project_3d_to_2d(
                  translate(
                      rotate(start, theta), dz))),
          translateCenterPointToCanvasPoint(
              project_3d_to_2d(
                  translate(
                      rotate(end, theta), dz))),
          line_pixels_width,
          LINES_FOREGROUND)
    }
  }
}

function draw_vertices(dz, theta, vertices) {
  for (const vertex of vertices) {
    draw_point(
        translateCenterPointToCanvasPoint(
            project_3d_to_2d(
                translate(
                    rotate(vertex, theta), dz))),
        point_pixels_width,
        VERTICES_FOREGROUND)
  }
}

function draw_line_2() {
  draw_line(p1, p2, pixels_width, foreground)
}

function draw_rotating_cube_with_vertices() {
  dz += dt_fps
  theta += 2 * Math.PI * dt_fps // rotation speed
  clear()
  draw_vertices(dz, theta, data_vertices);
  draw_lines(dz, theta, data_vertices, data_lines);
  setTimeout(draw_rotating_cube_with_vertices, 500 / FPS)
}

setTimeout(draw_rotating_cube_with_vertices, 1000 / FPS)

// vertices for square
const data_vertices = [
  {x: 0.5, y: 0.5, z: 0.5},
  {x: -0.5, y: 0.5, z: 0.5},
  {x: 0.5, y: -0.5, z: 0.5},
  {x: -0.5, y: -0.5, z: 0.5},

  {x: 0.5, y: 0.5, z: -0.5},
  {x: -0.5, y: 0.5, z: -0.5},
  {x: 0.5, y: -0.5, z: -0.5},
  {x: -0.5, y: -0.5, z: -0.5}
]

// array of vertices to connect == lines
const data_lines = [
  [0, 1],
  [0, 2],
  [0, 4],
  [1, 3],
  [1, 5],
  [2, 3],
  [2, 6],
  [3, 7],
  [4, 5],
  [4, 6],
  [5, 7],
  [6, 7]
]
