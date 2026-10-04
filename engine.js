let mesh;

let display_vertices_coordinates_bool = false
let display_legend_bool = false
let display_faces_bool = true
let display_wireframe_hidden_surface_bool = true
let display_wireframe_visible_surface_bool = true

// console.log(canvas)
canvas.width = 800
canvas.height = 800

const YELLOW = "#fAEE05"
const BLUE = "#2266EE"
const ORANGE = "#EE6600"
const GREEN = "#3c7428"
const PURPLE = "#3B0866"
const BROWN = "#836953"
const PINK = "#ff69b4"
const RED_BRIGHT = "#e70028"
const TEAL = "#4ECDC4"

const colors_array = [
  YELLOW,
  // YELLOW,
  BLUE,
  // BLUE,
  ORANGE,
  // ORANGE,
  GREEN,
  // GREEN,
  PURPLE,
  // PURPLE,
  BROWN,
  PINK,
  RED_BRIGHT,
  TEAL]

const OPACITY = .6;

setupMenu()

const canvas_2d_context = canvas.getContext("2d")
canvas_2d_context.font = 20 + "px monospace";
// console.log(context)

const canvasHalfWidth = canvas.width / 2
const canvasHalfHeight = canvas.height / 2

const SOLID_LINE = [];
const DASHED_LINE = [5, 15];

const BACKGROUND = "#101010"
const EDGE_COLOR = "#FFFFFF"
const VERTICES_TEXT = "#996666"
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

let square_width = 1 // -0.625
let dx = 0
let dy = 0
let dz = 0
let theta_z_camera = 90
let theta_z_surface = theta_z_camera
let timeout = 1
let iter = 0
let increment = .05;

const upArrow = String.fromCharCode(0x2B06)
const downArrow = String.fromCharCode(0x2193)

console.log("checkpoint")

window.onload = function () {
  let interval = setInterval(bounce_entrypoint, timeout);

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
        interval = setInterval(bounce_entrypoint, timeout)
        break;
    }
  }, false);
}

function bounce(
    prev_dz,
    prev_dy,
    prev_dx,
    prev_theta_z_surface) {

  let cos_dx = Math.cos(dx);
  let cos_prev_dx = Math.cos(prev_dx)

  let cos_dy = Math.cos(dy);
  let cos_prev_dy = Math.cos(prev_dy)

  let cos_dz = Math.cos(dz);
  let cos_prev_dz = Math.cos(prev_dz)

  let cos_theta_z_surface = Math.cos(theta_z_surface).toPrecision(2);
  let cos_prev_theta_z_surface = Math.cos(prev_theta_z_surface).toPrecision(2);
  clear()

  if (display_legend_bool)
    display_legend(cos_dx, cos_prev_dx, cos_dy, cos_prev_dy, cos_dz, cos_prev_dz, cos_theta_z_surface, cos_prev_theta_z_surface);

  render(cos_dz, cos_dy, cos_dx, theta_z_surface, mesh, z_offset);
}

function bounce_entrypoint() {
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
