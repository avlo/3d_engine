console.log(canvas)
canvas.width = 800
canvas.height = 800

const context = canvas.getContext("2d")
console.log(context)

const canvasHalfWidth = canvas.width / 2
const canvasHalfHeight = canvas.height / 2

const BACKGROUND = "#101010"
const VERTICES_FOREGROUND = "#11FF50"
const VERTICES_TEXT = "#996666"
const POLY_FILL_FRONT = "#EE2266"
const POLY_FILL_2 = "#EE6600"
const LINES_FOREGROUND = "#FFFF50"
const point_pixels_width = 1

const line_pixels_width = 1
const vertexPixelWidth = point_pixels_width * 10
const dim_line_width = point_pixels_width / 5
const point_half = point_pixels_width / 2
const fixedTextWidth = 50
const legend_left_margin = 680

const DT_FPS = 0.0125
const rotation_factor = .0025
const rotationDirection = -1 // positive direction
const constRotation = rotationDirection * rotation_factor * 4

let square_width = -0.625
let dx = 0
let dy = 0
let dz = 0
let theta_z_camera = 90
let theta_z_surface = theta_z_camera
let timeout = 1
let iter = 0

const upArrow = String.fromCharCode(0x2B06)
const downArrow = String.fromCharCode(0x2193)

window.onload = function () {
  let increment = .05;
  let interval = setInterval(main_bounce, timeout);
  window.addEventListener('keydown', function (event) {
    switch (event.key) {
      case "ArrowUp":
        dz -= DT_FPS
        clearInterval(interval)
        setInterval(bounce, timeout, dz, theta_z_surface)
        break;
      case "ArrowDown":
        dz += DT_FPS
        clearInterval(interval)
        setInterval(bounce, timeout, dz, theta_z_surface)
        break;
      case "ArrowLeft":
        theta_z_surface -= increment
        clearInterval(interval)
        setInterval(bounce, timeout, dz, theta_z_surface)
        break;
      case "ArrowRight":
        theta_z_surface += increment
        clearInterval(interval)
        setInterval(bounce, timeout, dz, theta_z_surface)
        break;
      case "a":
        clearInterval(interval)
        interval = setInterval(bounce, timeout, dz, theta_z_surface)
        break;
      case "z":
        clearInterval(interval)
        interval = setInterval(main_bounce, timeout)
        break;
    }
  }, false);
}

function bounce(prev_dz, prev_dy, prev_dx, prev_theta_z_surface) {
  let cos_dx = Math.cos(dx);
  let cos_prev_dx = Math.cos(prev_dx)
  
  let cos_dy = Math.cos(dy);
  let cos_prev_dy = Math.cos(prev_dy)
  
  let cos_dz = Math.cos(dz);
  let cos_prev_dz = Math.cos(prev_dz)

  let cos_theta_z_surface = Math.cos(theta_z_surface).toPrecision(2);
  let cos_prev_theta_z_surface = Math.cos(prev_theta_z_surface).toPrecision(2);
  clear()

  // legend
  display_legend(
      display_legend_arrow("dx", cos_dx, cos_prev_dx),
      cos_dy.toPrecision(2),
      legend_left_margin, 50)
  display_legend(
      display_legend_arrow("dy", cos_dy, cos_prev_dy),
      cos_dy.toPrecision(2),
      legend_left_margin, 100)
  display_legend(
      display_legend_arrow("dz", cos_dz, cos_prev_dz),
      cos_dz.toPrecision(2),
      legend_left_margin, 150)
  display_legend(
      display_legend_arrow(String.fromCharCode(0x0398), cos_theta_z_surface, cos_prev_theta_z_surface),
      cos_theta_z_surface,
      legend_left_margin, 200)
  display_legend("iter", iter++, 15, 780 - "iter".length)

  // draw general lines
  // draw_lines(generateRandomLines(10), dim_line_width)
  // draw_lines(data_single_lines, point_pixels_width)

  // draw square
  draw_square(cos_dz, cos_dy, cos_dx, theta_z_surface, square_width);
  display_legend("inc", square_width.toPrecision(2), 125, 780 - "inc".length)
}

function main_bounce() {
  let prev_dx = dx
  let prev_dy = dy
  let prev_dz = dz
  
  let prev_theta = theta_z_surface
  dx += DT_FPS
  dy += DT_FPS
  dz += DT_FPS
  theta_z_surface += constRotation // rotation speed
  bounce(prev_dz, prev_dy, prev_dx, prev_theta)
}
