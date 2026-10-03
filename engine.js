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

const colors_array_literal = ["YELLOW", "BLUE", "ORANGE", "GREEN", "PURPLE", "BROWN"]

let display_vertices_coordinates_bool = false
let display_legend_bool = false
let display_polygons_bool = true
let display_wireframe_bool = true

const displayVerticesCoordinatesCheckbox = document.getElementById("display-vertices-coordinates")
const displayLegendCheckbox = document.getElementById("display-legend")
const displayPolygonsCheckbox = document.getElementById("display-polygons")
const displayWireframeCheckbox = document.getElementById("display-wireframe")

displayVerticesCoordinatesCheckbox.checked = display_vertices_coordinates_bool
displayLegendCheckbox.checked = display_legend_bool
displayPolygonsCheckbox.checked = display_polygons_bool
displayWireframeCheckbox.checked = display_wireframe_bool

displayVerticesCoordinatesCheckbox.addEventListener("change", function () {
  display_vertices_coordinates_bool = displayVerticesCoordinatesCheckbox.checked
})
displayLegendCheckbox.addEventListener("change", function () {
  display_legend_bool = displayLegendCheckbox.checked
})
displayPolygonsCheckbox.addEventListener("change", function () {
  display_polygons_bool = displayPolygonsCheckbox.checked
})
displayWireframeCheckbox.addEventListener("change", function () {
  display_wireframe_bool = displayWireframeCheckbox.checked
})

const canvas_2d_context = canvas.getContext("2d")
canvas_2d_context.font = 20 + "px monospace";
// console.log(context)

const canvasHalfWidth = canvas.width / 2
const canvasHalfHeight = canvas.height / 2

const SOLID_LINE = [];
const DASHED_LINE = [5, 15];

const BACKGROUND = "#101010"
const VERTICES_FOREGROUND_GREEN = "#11FF50"
const VERTICES_FOREGROUND_WHITE = "#FFFFFF"
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

let mesh;

cubeSingleFace = './data/cube-single-face-sans-normals.obj';
cubeTriangulated = './data/triangulated-cube-with-faces-sans-normals.obj';
octahedron = './data/octahedron-with-faces-sans-normals.obj';
squareFacedCube = './data/cube-with-faces-sans-normals.obj';
fetch(octahedron)
    .then(response => response.text())
    .then((data) => {
      mesh = readWavefrontObj(data)
    });

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

  // if (display_wireframe_bool)
  //   draw_edge(cos_dz, cos_dy, cos_dx, theta_z_surface, mesh, z_offset);

  // console.log(JSON.stringify(mesh.getVertices(), null, 1))
  // if (display_polygons_bool)
    draw_mesh(cos_dz, cos_dy, cos_dx, theta_z_surface, mesh, z_offset);
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
