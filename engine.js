console.log(canvas)
canvas.width = 800
canvas.height = 800

const ctx = canvas.getContext("2d")
console.log(ctx)

const canvasHalfWidth = canvas.width / 2

const BACKGROUND = "#101010"
const VERTICES_FOREGROUND = "#11FF50"
const VERTICES_TEXT = "#996666"
const LINES_FOREGROUND = "#FFFF50"
const point_pixels_width = 1

const line_pixels_width = 1
const vertexPixelWidth = point_pixels_width * 10
const dim_line_width = point_pixels_width / 5
const point_half = point_pixels_width / 2
const fixedTextWidth = 50
const legend_left_margin = 680

window.onload = function () {
  let interval = setInterval(main_bounce, timeout);
  window.addEventListener('keydown', function (event) {
    switch (event.key) {
      case "ArrowUp":
        square_width+=.025;
        intervalClearSet();
        break;
      case "ArrowDown":
        square_width -= .025;
        intervalClearSet();
        break;
    }
    
    function intervalClearSet() {
      clearInterval(interval)
      setInterval(event_bounce, timeout)
    }
  }, false);
}

function event_bounce() {
  let prev_dzz = dz
  let prev_theta_a = theta
  theta -= constRotation * square_width/4 // rotation speed

  let cos_dzz = Math.cos(dz);
  let cos_prev_dzz = Math.cos(prev_dzz)
  let cos_theta_a = Math.cos(theta).toPrecision(2);
  let cos_prev_theta_a = Math.cos(prev_theta_a).toPrecision(2);
  clear()

  // legend
  display_legend(
      display_legend_arrow("bdz", cos_dzz, cos_prev_dzz),
      cos_dzz.toPrecision(2),
      legend_left_margin, 50)
  display_legend(
      display_legend_arrow(String.fromCharCode(0x0398), cos_theta_a, cos_prev_theta_a),
      cos_theta_a,
      legend_left_margin, 100)
  display_legend("biter", iter++, 15, 780 - "iter".length)

  // draw general lines
  // draw_lines(generateRandomLines(10), dim_line_width)
  // draw_lines(data_single_lines, point_pixels_width)

  // draw square
  draw_square(cos_dzz, theta, square_width);
  display_legend("binc", square_width.toPrecision(2), 125, 780 - "binc".length)
}

function clear() {
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function draw_point({x, y}, pixels_width, foreground) {
  ctx.fillStyle = foreground
  ctx.fillRect(x - point_half, y - point_half, pixels_width, pixels_width)
}

function add_text(text, x, y, textWidth, foreground) {
  ctx.font = textWidth + "px monospace";

  ctx.fillStyle = foreground
  ctx.fillText(text, x, y, textWidth)

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
  return {x, y, z: -z + dz}
  // return {x, y, z: z + 2}
}

function get_vertices_unit_square(local_square_size) {
  /*
  {x: 0.5, y: -0.5, z: -0.5},
  {x: -0.5, y: -0.5, z: -0.5}
   */
  let side = local_square_size / 2
  let pos = side
  let neg = -side

  return [
    {x: pos, y: pos, z: pos},
    {x: neg, y: pos, z: pos},
    {x: pos, y: neg, z: pos},
    {x: neg, y: neg, z: pos},

    {x: pos, y: pos, z: neg},
    {x: neg, y: pos, z: neg},
    {x: pos, y: neg, z: neg},
    {x: neg, y: neg, z: neg}
  ]
}

function draw_square(cos_dz, theta, local_square_width) {
  let verticesUnitSquare = get_vertices_unit_square(local_square_width);
  draw_rotating_vertices(cos_dz, theta, verticesUnitSquare)
  draw_rotating_lines(cos_dz, theta, verticesUnitSquare)
}

function draw_rotating_vertices(dz, theta, vertices) {
  for (const vertex of vertices) {
    // draw vertices points
    let point = convertCenteredCoordinatesToCanvasCoordinates(
        project_3d_to_2d(
            translate(
                rotate(vertex, theta), dz)))

    let negative_bound = point.x <= canvasHalfWidth
    let color = negative_bound ? VERTICES_FOREGROUND : VERTICES_TEXT
    let cos_dz = Math.cos(dz);
    // draw corner points
    draw_point(point, cos_dz * vertexPixelWidth / 1.25, color)

    // draw corner labels
    let text = negative_bound ? "+" : "-"
    add_text(text, point.x, point.y, cos_dz * fixedTextWidth / 1.25, color)
  }
}

function draw_rotating_lines(dz, theta, vertices) {
  // array of vertices to connect == lines
  for (const line of vertex_connections) {
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

function draw_lines(lines, line_width) {
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

function display_legend(key, value, x_pos, y_pos) {
  add_text(key + " = ", x_pos, y_pos, fixedTextWidth, LINES_FOREGROUND)
  let theta_precision = value;
  add_text(
      theta_precision,
      x_pos + 50, y_pos,
      fixedTextWidth,
      theta_precision <= 0 ? VERTICES_TEXT : VERTICES_FOREGROUND)
}

function display_legend_arrow(label, dz, prev_dz) {
  let incrementing = prev_dz - dz <= 0;
  return label + " " + (incrementing ? upArrow : downArrow)
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
const DT_FPS = .005
let dz = 0
let theta = 0
let rotationDirection = -1 // positive direction
let constRotation = rotationDirection * 6 * DT_FPS % 360
let timeout = 10

let iter = 0
const upArrow = String.fromCharCode(0x2B06)

const downArrow = String.fromCharCode(0x2193)

function main_bounce() {
  let prev_dz = dz
  let prev_theta = theta
  dz += DT_FPS
  theta += constRotation // rotation speed

  let cos_dz = Math.cos(dz);
  let cos_prev_dz = Math.cos(prev_dz)
  let cos_theta = Math.cos(theta).toPrecision(2);
  let cos_prev_theta = Math.cos(prev_theta).toPrecision(2);
  clear()

  // legend
  display_legend(
      display_legend_arrow("dz", cos_dz, cos_prev_dz),
      cos_dz.toPrecision(2),
      legend_left_margin, 50)
  display_legend(
      display_legend_arrow(String.fromCharCode(0x0398), cos_theta, cos_prev_theta),
      cos_theta,
      legend_left_margin, 100)
  display_legend("iter", iter++, 15, 780 - "iter".length)

  // draw general lines
  // draw_lines(generateRandomLines(10), dim_line_width)
  // draw_lines(data_single_lines, point_pixels_width)

  // draw square
  draw_square(cos_dz, theta, square_width);
  display_legend("inc", square_width.toPrecision(2), 125, 780 - "dep".length)
}

let square_width = -.0625

const data_single_lines = [
  [0, 0, 100, 100],
  [50, 0, 200, 150],
  [100, 0, 300, 200]
]

// square sizes
const square_z = [
  1
]

const vertex_connections = [
  [0, 1], [0, 2], [0, 4],
  [1, 3], [1, 5], 
  [2, 3], [2, 6], 
  [3, 7],
  [4, 5], [4, 6],
  [5, 7], 
  [6, 7]
]
