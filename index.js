console.log(game)
game.width = 800
game.height = 800
const ctx = game.getContext("2d")
console.log(ctx)

const BACKGROUND = "#101010"
const FOREGROUND = "#FFFF50"

const FPS = 600;
let dt_fps = 1 / FPS;

const point_pixels_width = 1
const point_half = point_pixels_width / 2

function clear() {
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, game.width, game.height)
}

function draw_point({x, y}) {
  let width = point_pixels_width;
  ctx.fillStyle = FOREGROUND
  x = x - point_half
  y = y - point_half
  ctx.fillRect(x, y, width, width)
}

function draw_line(p1, p2) {
  ctx.lineWidth = point_pixels_width
  ctx.strokeStyle = FOREGROUND
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

// coordinate translation system from:
//    0,0 at screen center & x/y directions -1,1
// to 
//    screen coordinate w/h
function screen_coordinate(point) {
// -1..1 => 0..w/h
//   translate coordinate system from center: -1,1
//   to screen coordinate w/h    

// conceptual step 1
// translate from negative coord to positive
  let x_screen_coord = point.x + 1;
  let y_screen_coord = point.y + 1;
// yields screen coordinates
//   -1..1 => 0..2 => 0..w/h

// dividing by 2 normalizes the result
  let x_normalized = x_screen_coord / 2;
  let y_normalized = y_screen_coord / 2;
// yields
//   -1..1 => 0..2 => 0..1 => 0..w/h

// then multiply by width and/or height gives screen w/h coordinate
// -1..1 => 0..2 => 0..1 => 0..w
//   (point.x + 1)/2  * game.width
  let x = x_normalized * game.width
  let y = y_normalized * game.height

  return {
    x: x,
    y: y
  }
}

function project_3d_to_2d({x, y, z}) {
  return {
    x: x / z,
    y: y / z
  }
}

function rotate_xz_shape({x, y, z}, theta) {
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

const shapes = [
  {x: 0.5, y: 0.5, z: 0.5},
  {x: -0.5, y: 0.5, z: 0.5},
  {x: 0.5, y: -0.5, z: 0.5},
  {x: -0.5, y: -0.5, z: 0.5},

  {x: 0.5, y: 0.5, z: -0.5},
  {x: -0.5, y: 0.5, z: -0.5},
  {x: 0.5, y: -0.5, z: -0.5},
  {x: -0.5, y: -0.5, z: -0.5}
]

const lines = [
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

let dz = 0;
let theta = 0

function draw_dynamic() {
  dz += dt_fps
  theta += 2 * Math.PI * dt_fps // rotation speed
  clear()
  // for (const shape of shapes) {
  //   draw_point(
  //       screen_coordinate(
  //           project_3d_to_2d(
  //               translate(
  //                   rotate_xz_shape(shape, theta), dz))))
  // }

  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      const start = shapes[line[i]]
      const end = shapes[line[(i + 1) % line.length]]
      draw_line(
          screen_coordinate(
              project_3d_to_2d(
                  translate(
                      rotate_xz_shape(start, theta), dz))),
          screen_coordinate(
              project_3d_to_2d(
                  translate(
                      rotate_xz_shape(end, theta), dz))))
    }
  }
  setTimeout(draw_dynamic, 500 / FPS)
}

setTimeout(draw_dynamic, 1000 / FPS)
