// console.log(canvas)
canvas.width = 800
canvas.height = 800

const YELLOW = "#fAEE05"
const BLUE = "#2266EE"
const ORANGE = "#EE6600"
const GREEN = "#59AD3C"
const PURPLE = "#3B0866"
const RED_DARK = "#772211"
const colors_array = [YELLOW, BLUE, ORANGE, GREEN, PURPLE, RED_DARK]
const colors_array_literal = ["YELLOW", "BLUE", "ORANGE", "GREEN", "PURPLE", "RED_DARK"]

let display_vertices_coordinates_bool = false
let display_legend_bool = false
let display_polygons_bool = true
let display_wireframe_bool = false

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

const context = canvas.getContext("2d")
// console.log(context)

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

let square_width = 1 // -0.625
let dx = 0
let dy = 0
let dz = 0
let theta_z_camera = 90
let theta_z_surface = theta_z_camera
let timeout = 1
let iter = 0
let increment = .05;
let interval = setInterval(bounce_entrypoint, timeout);

const upArrow = String.fromCharCode(0x2B06)
const downArrow = String.fromCharCode(0x2193)

let input_vertices_array = [
  -1.000000, -1.000000, -1.000000
  , 1.000000, -1.000000, -1.000000
  , 1.000000, 1.000000, -1.000000
  , -1.000000, 1.000000, -1.000000

  , -1.000000, -1.000000, 1.000000
  , 1.000000, -1.000000, 1.000000
  , 1.000000, 1.000000, 1.000000
  , -1.000000, 1.000000, 1.000000
]

let input_vertices = []
for (let i = 0; i < input_vertices_array.length; i += 3) {
  input_vertices.push(
      {
        x: input_vertices_array[i],
        y: input_vertices_array[i + 1],
        z: input_vertices_array[i + 2]
      })
}

let input_faces = [
  ["0 3 2 1"]
  ,["4 5 6 7"]
  ,["0 1 5 4"]
  ,["1 2 6 5"]
  ,["2 3 7 6"]
  ,["3 0 4 7"]
]

let faces_array = []
for (let i = 0; i < input_faces.length; i++) {
  for (let inputFace of input_faces[i]) {
    let edges_array = []
    let face_indexes = inputFace.split(/\s*[\s,]\s*/);
    let number_of_vertices = face_indexes.length

    for (let j = 0; j < number_of_vertices-1; j++) {
      let v0 = input_vertices[face_indexes[j]];
      let vertex_0 = {x: v0.x, y: v0.y, z: v0.z}
      let v1 = input_vertices[(face_indexes[j + 1])];
      let vertex_1 = {x: v1.x, y: v1.y, z: v1.z}
      let edge = {v0: vertex_0, v1: vertex_1,}
      // console.log("edge: " + JSON.stringify(edge))
      edges_array.push(edge)
      // console.log("edges_array: " + JSON.stringify(edges_array))
    }

    let face = {
      edges_array: edges_array,
      getVertices() {
        let local_vertices = []
        let numberOfEdges = edges_array.length;
        for (let k = 0; k < numberOfEdges; k++) {
          let v0 = edges_array[k].v0;
          local_vertices.push({x: v0.x, y: v0.y, z: v0.z})
        }
        // console.log("vertices.pushed: \n" + JSON.stringify(local_vertices, null, 1))
        return local_vertices
      }
    }
    let vertices = face.getVertices();
    console.log("face vertices[ " + i + " ]: \n" + JSON.stringify(vertices, null, 1))
    faces_array.push(face)
  }
}

let obj = {
  faces_array: faces_array,
}

window.onload = function () {
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

  // legend
  if (display_legend_bool) {
    display_legend(cos_dx, cos_prev_dx, cos_dy, cos_prev_dy, cos_dz, cos_prev_dz, cos_theta_z_surface, cos_prev_theta_z_surface);
  }

  // draw general lines
  // draw_lines(generateRandomLines(10), dim_line_width)
  // draw_lines(data_single_lines, point_pixels_width)

  // console.log(JSON.stringify(obj.getVertices(), null, 1))
  draw_object(cos_dz, cos_dy, cos_dx, theta_z_surface, obj);
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
