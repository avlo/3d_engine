console.log(canvas)
canvas.width = 800
canvas.height = 800
const ctx = canvas.getContext("2d")
console.log(ctx)

const BACKGROUND = "#101010"
const VERTICES_FOREGROUND = "#11FF50"
const VERTICES_TEXT = "#996666"
const LINES_FOREGROUND = "#FFFF50"
const FPS = 600
const DT_FPS = 1 / FPS

const point_pixels_width = 1
const line_pixels_width = 1
const point_half = point_pixels_width / 2

function clear() {
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function draw_point({x, y}, pixels_width, foreground) {
  ctx.fillStyle = foreground
  ctx.fillRect(x - point_half, y - point_half, pixels_width, pixels_width)
}

function add_text(text, x, y, foreground) {
  let text_width = 100 / 2
  ctx.font = text_width + "px monospace";
  
  ctx.fillStyle = foreground
  ctx.fillText(text, x, y, text_width)

  // ctx.strokeStyle = foreground
  // ctx.strokeText(text, x, y, text_width)
}

function draw_line(p1, p2, pixels_width, foreground) {
  ctx.lineWidth = pixels_width
  ctx.strokeStyle = foreground
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
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
function convertCenteredCoordinatesToCanvasCoordinates(centered_point) {
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

function draw_rotating_lines(dz, theta, vertices, lines) {
  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      const start = vertices[line[i]] // first vertex
      const end = vertices[line[(i + 1) % line.length]] // % == last vertex wrap around 
      let p1 = convertCenteredCoordinatesToCanvasCoordinates(
          project_3d_to_2d(
              translate(
                  rotate(start, theta), dz)));
      let p2 = convertCenteredCoordinatesToCanvasCoordinates(
          project_3d_to_2d(
              translate(
                  rotate(end, theta), dz)));
      draw_line(p1, p2, line_pixels_width, LINES_FOREGROUND)
    }
  }
}

function draw_rotating_vertices(dz, theta, vertices) {
  for (const vertex of vertices) {
    let point = convertCenteredCoordinatesToCanvasCoordinates(
        project_3d_to_2d(
            translate(
                rotate(vertex, theta), dz)));

    let decrement = point.x <= canvas.width / 2
    let color = decrement ? VERTICES_FOREGROUND : VERTICES_TEXT
    let text = decrement ? "+" : "-"
    draw_point(point, point_pixels_width * 10, color)
    add_text(text, point.x, point.y, color)
  }
}

function draw_lines(lines, line_width) {
  // clear()
  let colors = [VERTICES_FOREGROUND, LINES_FOREGROUND]
  let j = 0
  for (const line of lines) {
    // let color = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
    let color = colors[j++ % 2]
    for (let i = 0; i < line.length; i++) {
      draw_line({
        x: line[i],
        y: line[i + 1]
      }, {
        x: line[i + 2],
        y: line[i + 3]
      }, line_width, color)
      draw_line({
        x: canvas.width - line[i],
        y: canvas.height - line[i + 1]
      }, {
        x: canvas.width - line[i + 2],
        y: canvas.height - line[i + 3]
      }, line_width, color)
    }
  }
}

let dz = 0;
let theta = 0

function display_theta_legend(theta) {
  add_text(String.fromCharCode(0x0398) + " =", 680, 50, LINES_FOREGROUND)
  add_text(
      Math.cos(theta).toPrecision(2),
       740, 50,
      Math.cos(theta).toPrecision(2) <= 0 ? VERTICES_FOREGROUND : VERTICES_TEXT)
}

function generateRandomLines(num_lines) {
  let array = [[]]
  for (let i = 0; i < num_lines; i++) {
    let p1x = canvas.width - (canvas.width * Math.random())
    let p1y = canvas.height - (canvas.height * Math.random())
    let p2x = canvas.width - (canvas.width * Math.random())
    let p2y = canvas.height - (canvas.height * Math.random())
    let internal_array = [p1x, p1y, p2x, p2y]
    array.push(internal_array)
  }
  // let values = data_single_lines.values();
  // values.forEach(value => array.push(value))
  return array
}

function main() {
  dz += DT_FPS
  theta += 2 * Math.PI * DT_FPS // rotation speed
  clear()
  display_theta_legend(theta);
  draw_lines(generateRandomLines(10), point_pixels_width / 5)
  draw_lines(data_single_lines, point_pixels_width)
  draw_rotating_vertices(dz, theta, data_vertices);
  draw_rotating_lines(dz, theta, data_vertices, data_lines);
  setTimeout(main, 500 / FPS)
}

setTimeout(main, 1000 / FPS)
// draw_lines(data_single_lines, point_pixels_width/10)

const data_single_lines = [
  [0, 0, 100, 100],
  [50, 0, 200, 150],
  [100, 0, 300, 200]
]

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
