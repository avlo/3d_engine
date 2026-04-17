console.log(canvas)
canvas.width = 800
canvas.height = 800

const context = canvas.getContext("2d")
console.log(context)

const canvasHalfWidth = canvas.width / 2

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
const rotation_factor = 1.5

let dz = -2
let theta = 0
let rotationDirection = -1 // positive direction
let constRotation = rotationDirection * DT_FPS * rotation_factor
let timeout = 10
let iter = 0

const upArrow = String.fromCharCode(0x2B06)
const downArrow = String.fromCharCode(0x2193)

window.onload = function () {
  let interval = setInterval(main_bounce, timeout);
  window.addEventListener('keydown', function (event) {
    switch (event.key) {
      case "ArrowUp":
        square_width += .025;
        intervalClearSet();
        break;
      case "ArrowDown":
        square_width -= .025;
        intervalClearSet();
        break;
      case "ArrowLeft":
        square_width += .025;
        intervalClearSet();
        break;
      case "ArrowRight":
        square_width -= .025;
        intervalClearSet();
        break;
    }

    function intervalClearSet() {
      clearInterval(interval)
      setInterval(key_event_bounce, timeout)
    }
  }, false);
}

function bounce(prev_dz, prev_theta) {
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
  display_legend("inc", square_width.toPrecision(2), 125, 780 - "inc".length)
}

function key_event_bounce() {
  let prev_theta = theta
  // theta -= constRotation * square_width / 4 // rotation speed
  theta += constRotation // rotation speed
  bounce(dz, prev_theta)
}

function main_bounce() {
  let prev_dz = dz
  let prev_theta = theta
  // dz += DT_FPS
  theta += constRotation // rotation speed
  bounce(prev_dz, prev_theta)
}
