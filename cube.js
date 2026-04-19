let z_offset = 2

function draw_square(cos_dz, cos_dy, cos_dx, theta, local_square_width) {
  let verticesUnitCube = get_vertices_unit_cube(local_square_width);
  draw_rotating_lines(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
  draw_rotating_polygons(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
  // draw_rotating_vertices(cos_dz, theta, verticesUnitCube, z_offset)
}

function fillPolygon(points) {
  // side 1
  context_fill_polygon(points, {
    xy: [0, 1, 2, 3, 4, 5, 6, 7],
    // xy: [0, 1, 2, 3],
    color: "#EE2266",
    y_text_coord: 20
  })
  // side 2
  context_fill_polygon(points, {
    xy: [8, 9, 0, 1, 6, 7, 14, 15],
    color: "#2266EE",
    y_text_coord: 40
  })
  // // // side 3
  context_fill_polygon(points, {
    xy: [2, 3, 10, 11, 12, 13, 4, 5],
    color: "#EE6600",
    y_text_coord: 60
  })
  // // // // side 4
  context_fill_polygon(points, {
    xy: [10, 11, 8, 9, 14, 15, 12, 13],
    // xy: [12, 13, 14, 15, 8, 9, 10, 11],
    color: "#114400",
    y_text_coord: 80
  })
  //
  // // top
  context_fill_polygon(points, {
    xy: [4, 5, 12, 13, 14, 15,  6, 7],
    color: "#3B0866",
    y_text_coord: 100
  })
  // // bottom
  context_fill_polygon(points, {
    xy: [0, 1, 8, 9, 10, 11, 2, 3],
    color: "#772211",
    y_text_coord: 120
  })
}

// translate point (x,y) from screen center coordinates (0, 0) to HTML canvas top left coordinates (0, w/h), i.e,
//    -1..1 => 0..w/h
function convertCubeCenteredCoordinatesToCanvasCoordinates(centered_point) {
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

function get_vertices_unit_cube(local_square_size) {
  let side = local_square_size / 2
  let pos = side
  let neg = -side

  // x, y, z coords relative to center of unit cube
  return [
    {x: neg, y: pos, z: pos}, // 0
    {x: pos, y: pos, z: pos}, // 1
    {x: pos, y: neg, z: pos}, // 2
    {x: neg, y: neg, z: pos}, // 3

    {x: neg, y: pos, z: neg}, // 4 =  8,  9
    {x: pos, y: pos, z: neg}, // 5 = 10, 11
    {x: pos, y: neg, z: neg}, // 6 = 12, 13
    {x: neg, y: neg, z: neg}  // 7 = 14, 15
  ]
}

const vertex_connections = [
  [0, 1], [0, 3], [0, 4], // 0
  [1, 2], [1, 5], // 1
  [2, 3], [2, 6], // 2
  [3, 7], // 3
  [4, 5], [4, 7], // 4
  [5, 6], // 5
  [6, 7]  // 6
  // 7
]
