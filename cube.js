 let z_offset = 2

function draw_cube(cos_dz, cos_dy, cos_dx, theta, local_square_width) {
  let verticesUnitCube = get_vertices_unit_cube(local_square_width);
  draw_rotating_lines(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
  // draw_rotating_polygons(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
  // draw_rotating_vertices(cos_dz, theta, verticesUnitCube, z_offset)
}

function fillPolygon(points) {
  top_left_x = 0;
  top_left_y = 1;

  bottom_left_x = 2;
  bottom_left_y = 3;

  bottom_right_x = 4;
  bottom_right_y = 5;

  top_right_x = 6;
  top_right_y = 7;
  
  // side 1
  context_fill_polygon(points, {
    xy: [
      top_left_x, top_left_y,
      bottom_left_x, bottom_left_y,
      bottom_right_x, bottom_right_y,
      top_right_x, top_right_y
    ],
    // xy: [0, 1, 2, 3],
    color: "#EE2266",
    y_text_coord: 20
  })
  // side 2
  // context_fill_polygon(points, {
  //   xy: [0, 1, 8, 9, 12, 13, 4, 5],
  //   color: "#2266EE",
  //   y_text_coord: 40
  // })
  // // // // side 3
  // context_fill_polygon(points, {
  //   xy: [10, 11, 2, 3, 6, 7, 14, 15],
  //   color: "#EE6600",
  //   y_text_coord: 60
  // })
  // // // // // side 4
  // context_fill_polygon(points, {
  //   xy: [14, 15, 12, 13, 8, 9, 10, 11],
  //   // xy: [12, 13, 14, 15, 8, 9, 10, 11],
  //   color: "#114400",
  //   y_text_coord: 80
  // })
  // //
  // // // top
  // context_fill_polygon(points, {
  //   xy: [4, 5, 12, 13, 14, 15,  6, 7],
  //   color: "#3B0866",
  //   y_text_coord: 100
  // })
  // // // bottom
  // context_fill_polygon(points, {
  //   xy: [8, 9, 0, 1, 2, 3, 10, 11],
  //   color: "#772211",
  //   y_text_coord: 120
  // })
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
  // right hand rule => counterclockwise
  // starting at upper left
  return [
    // front face
    {x: neg, y: pos, z: pos} // 0 (top left front)
    , {x: neg, y: neg, z: pos} // 1 (bottom left front)
    , {x: pos, y: neg, z: pos} // 2 (bottom right front)
    , {x: pos, y: pos, z: pos} // 3 (top right front)

    // rear face
    // below coords mirror as if spun 180 along y-axis
    , {x: pos, y: pos, z: neg} // 4 = (top right rear)
    , {x: pos, y: neg, z: neg} // 5 = (bottom right rear)
    , {x: neg, y: neg, z: neg} // 6 = (bottom left rear)
    , {x: neg, y: pos, z: neg}  // 7 = (top left rear)
  ]
}

const cube_outline_lines = [
  [0, 1], [1, 2], [2, 3], [3, 0] // front face
  , [4, 5], [5, 6], [6, 7], [7, 4] // rear face
  , [6, 1], [7, 0] // left face
  , [2, 5], [4, 3]  // right face
]
