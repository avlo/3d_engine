let z_offset = 2.5

function draw_object(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube) {
  if (display_wireframe_bool) {
    draw_rotating_line(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
  }

  // draw_rotating_face(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
  // draw_rotating_polygons(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
  // if/when used, needs updating first -> draw_rotating_vertices(cos_dz, theta, verticesUnitCube, z_offset)
}

function draw_cube(cos_dz, cos_dy, cos_dx, theta, local_square_width) {
  let verticesUnitCube = get_vertices_unit_cube(local_square_width);
  if (display_wireframe_bool) {
    draw_rotating_lines(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
  }
  
  draw_rotating_polygons(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
  // if/when used, needs updating first -> draw_rotating_vertices(cos_dz, theta, verticesUnitCube, z_offset)
}

function fillFace(vertices_array, color) {
  // side 1
  context_fill_face(vertices_array, {
    xyz: [
      vertex_0.x, vertex_0.y, vertex_0.z,
      vertex_1.x, vertex_1.y, vertex_1.z,
      vertex_2.x, vertex_2.y, vertex_1.z
    ],
    color: color,
    y_text_coord: 20
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
    , {x: neg, y: pos, z: neg} // 7 = (top left rear)
  ]
}
