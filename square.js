// console.log(canvas)
// canvas.width = 800
// canvas.height = 800
// const ctx = canvas.getContext("2d")
// console.log(ctx)
//
// const BACKGROUND = "#101010"
// const VERTICES_FOREGROUND = "#11FF50"
// const LINES_FOREGROUND = "#FFFF50"
//
// const FPS = 600;
// let dt_fps = 1 / FPS;
//
// const point_pixels_width = 10
// const line_pixels_width = 1
// const point_half = point_pixels_width / 2
//
// function clear() {
//   ctx.fillStyle = BACKGROUND
//   ctx.fillRect(0, 0, canvas.width, canvas.height)
// }
//
// function draw_point({x, y}, pixels_width, foreground) {
//   let width = pixels_width;
//   ctx.fillStyle = foreground
//   x = x - point_half
//   y = y - point_half
//   ctx.fillRect(x, y, width, width)
// }
//
// function draw_line(p1, p2, pixels_width, foreground) {
//   ctx.lineWidth = pixels_width
//   ctx.strokeStyle = foreground
//   ctx.beginPath()
//   ctx.moveTo(p1.x, p1.y)
//   ctx.lineTo(p2.x, p2.y)
//   ctx.stroke()
// }
//
// // translate point (x,y) from screen center coordinates (0, 0) to HTML canvas top left coordinates (0, w/h), i.e,
// //    -1..1 => 0..w/h
// function canvas_coordinate(point) {
// // (1of4) translate negative coord to positive coord
//   let x_canvas_coord = point.x + 1;
//   let y_canvas_coord = point.y + 1;
// // yields
// //   -1..1 => 0..2
//
// // (2of4) dividing by 2 normalizes the result
//   let x_normalized = x_canvas_coord / 2;
//   let y_normalized = y_canvas_coord / 2;
// // yields
// //   -1..1 => 0..2 => 0..1
//
// // (3of4) multiply by width & height gives HTML canvas w/h coordinate
// //   -1..1 => 0..2 => 0..1 => 0..w/h  
//   let x = x_normalized * canvas.width
//  
// // (4of4) reorient y axis
//   let y = (1 - y_normalized) * canvas.height
//
//   return {
//     x: x,
//     y: y
//   }
// }
//
// function project_3d_to_2d({x, y, z}) {
//   return {
//     x: x / z,
//     y: y / z
//   }
// }
//
// function rotate({x, y, z}, theta) {
//   // theta *= .01 * theta // rotation speed
//   let cos_theta = Math.cos(theta);
//   let sin_theta = Math.sin(theta);
//   return {
//     x: x * cos_theta - z * sin_theta,
//     y,
//     z: x * sin_theta + z * cos_theta
//   }
// }
//
// function translate({x, y, z}, dz) {
//   // return {x, y, z: z + dz}
//   return {x, y, z: z + 2}
// }
//
// // vertices of a square
// const vertices = [
//   {x: 0.5, y: 0.5, z: 0.5},
//   {x: -0.5, y: 0.5, z: 0.5},
//   {x: 0.5, y: -0.5, z: 0.5},
//   {x: -0.5, y: -0.5, z: 0.5},
//
//   {x: 0.5, y: 0.5, z: -0.5},
//   {x: -0.5, y: 0.5, z: -0.5},
//   {x: 0.5, y: -0.5, z: -0.5},
//   {x: -0.5, y: -0.5, z: -0.5}
// ]
//
// // array of vertices to connect == lines
// const lines = [
//   [0, 1],
//   [0, 2],
//   [0, 4],
//   [1, 3],
//   [1, 5],
//   [2, 3],
//   [2, 6],
//   [3, 7],
//   [4, 5],
//   [4, 6],
//   [5, 7],
//   [6, 7]
// ]
//
// let dz = 0;
// let theta = 0
//
// function draw_lines(dz, theta) {
//   for (const line of lines) {
//     for (let i = 0; i < line.length; i++) {
//       const start = vertices[line[i]] // first vertex
//       const end = vertices[line[(i + 1) % line.length]] // % == last vertex wrap around 
//       draw_line(
//           canvas_coordinate(
//               project_3d_to_2d(
//                   translate(
//                       rotate(start, theta), dz))),
//           canvas_coordinate(
//               project_3d_to_2d(
//                   translate(
//                       rotate(end, theta), dz))),
//           line_pixels_width,
//           LINES_FOREGROUND)
//     }
//   }
// }
//
// function draw_vertices(dz, theta) {
//   for (const shape of vertices) {
//     draw_point(
//         canvas_coordinate(
//             project_3d_to_2d(
//                 translate(
//                     rotate(shape, theta), dz))),
//         point_pixels_width,
//         VERTICES_FOREGROUND)
//   }
// }
//
// function draw_dynamic() {
//   dz += dt_fps
//   theta += 2 * Math.PI * dt_fps // rotation speed
//   clear()
//   draw_vertices(dz, theta);
//   draw_lines(dz, theta);
//   setTimeout(draw_dynamic, 500 / FPS)
// }
//
// setTimeout(draw_dynamic, 1000 / FPS)
