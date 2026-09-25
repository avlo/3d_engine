// let z_offset = 2
//
// function draw_pyramid_square(cos_dz, cos_dy, cos_dx, theta, local_square_width) {
//   let verticesUnitCube = get_vertices_unit_pyramid_square(local_square_width);
//   draw_rotating_lines(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
//   draw_rotating_polygons(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
//   draw_rotating_vertices(cos_dz, theta, verticesUnitCube, z_offset)
// }
//
// function get_vertices_unit_pyramid_square(local_square_size) {
//   let side = local_square_size / 2
//   let pos = side
//   let neg = -side
//
//   // x, y, z coords relative to center of unit cube
//   return [
//     {x: pos, y: pos, z: pos}, // 0 pyramid top
//
//     {x: neg, y: pos, z: pos}, // 1
//     {x: pos, y: pos, z: pos}, // 2
//     {x: pos, y: neg, z: neg}, // 3
//     {x: neg, y: neg, z: neg}  // 4
//   ]
// }
//
// function fillPolygon_pyramid_square(points) {
//   // side 1
//   context_fill_polygon(points, {
//     xy: [0, 1, 2, 3, 4, 5],
//     color: "#EE2266",
//     y_text_coord: 20
//   })
//   // // side 2
//   // context_fill_polygon(points, {
//   //   xy: [0, 1, 4, 5, 6, 7],
//   //   color: "#2266EE",
//   //   y_text_coord: 40
//   // })
//   // // side 3
//   // context_fill_polygon(points, {
//   //   xy: [0, 1, 6, 7, 8, 9],
//   //   color: "#EE6600",
//   //   y_text_coord: 60
//   // })
//   // // side 4
//   // context_fill_polygon(points, {
//   //   xy: [0, 1, 8, 9, 2, 3],
//   //   // xy: [12, 13, 14, 15, 8, 9, 10, 11],
//   //   color: "#114400",
//   //   y_text_coord: 80
//   // })
//   // //
//   // // bottom
//   // context_fill_polygon(points, {
//   //   xy: [2, 3, 4, 5, 6, 7, 8, 9],
//   //   color: "#772211",
//   //   y_text_coord: 100
//   // })
// }
//
// const vertex_connections_pyramid_cube = [
//   [0, 1], [0, 2], [0, 3], [0, 4], 
//   [1, 2], [1, 4], 
//   [2, 3], 
//   [3, 4] 
// ]
