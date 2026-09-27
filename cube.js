let z_offset = 2.5

const vertex_0 = { x: 0 , y: 1 }
const vertex_1 = { x: 2 , y: 3 }
const vertex_2 = { x: 4 , y: 5 }
const vertex_3 = { x: 6 , y: 7 }
const vertex_4 = { x: 8 , y: 9 }
const vertex_5 = { x: 10 , y: 11 }
const vertex_6 = { x: 12 , y: 13 }
const vertex_7 = { x: 14 , y: 15 }

const cube_outline_lines = [
  // front face
    [vertex_0.x, vertex_0.y]  // front upper left   [0, 1]
  , [vertex_0.y, vertex_1.x]  // front bottom left  [1, 2]
  , [vertex_1.x, vertex_1.y]  // front bottom right [2, 3]
  , [vertex_1.y, vertex_0.x]  // front upper right  [3, 0]

  // rear face    
  , [vertex_2.x, vertex_2.y]  // rear upper left    [4, 5]
  , [vertex_2.y, vertex_3.x]  // rear bottom left   [5, 6]
  , [vertex_3.x, vertex_3.y]  // rear bottom right  [6, 7]
  , [vertex_3.y, vertex_2.x]  // rear upper right   [7, 4]

  // top
  , [vertex_3.x, vertex_0.y]  // [6, 1]
  , [vertex_3.y, vertex_0.x]  // [7, 0]

  // bottom
  , [vertex_1.x, vertex_2.y]  // [2, 5]
  , [vertex_2.x, vertex_1.y]  // [4, 3]    
]

function draw_cube(cos_dz, cos_dy, cos_dx, theta, local_square_width) {
  let verticesUnitCube = get_vertices_unit_cube(local_square_width);
  draw_rotating_lines(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
  draw_rotating_polygons(cos_dz, cos_dy, cos_dx, theta, verticesUnitCube, z_offset)
  // if/when used, needs updating first -> draw_rotating_vertices(cos_dz, theta, verticesUnitCube, z_offset)
}

function fillPolygon(vertices_array) {
  // side 1
  context_fill_polygon(vertices_array, {
    xy: [
      vertex_0.x, vertex_0.y,
      vertex_1.x, vertex_1.y,
      vertex_2.x, vertex_2.y,
      vertex_3.x, vertex_3.y,
    ],
    color: "#fAEE05",
    y_text_coord: 20
  })

  // side 2
  context_fill_polygon(vertices_array, {
    xy: [
      vertex_3.x, vertex_3.y,
      vertex_2.x, vertex_2.y,
      vertex_5.x, vertex_5.y,
      vertex_4.x, vertex_4.y,
    ],
    color: "#2266EE",
    y_text_coord: 40
  })
  
  // // // // side 3
  context_fill_polygon(vertices_array, {
    xy: [
      vertex_4.x, vertex_4.y,
      vertex_5.x, vertex_5.y,
      vertex_6.x, vertex_6.y,
      vertex_7.x, vertex_7.y,
    ],
    color: "#EE6600",
    y_text_coord: 60
  })
  
  // // // // // side 4
  context_fill_polygon(vertices_array, {
    xy: [
      vertex_7.x, vertex_7.y,
      vertex_6.x, vertex_6.y,
      vertex_1.x, vertex_1.y,
      vertex_0.x, vertex_0.y,
    ],
    color: "#59AD3C",
    y_text_coord: 80
  })
  
  // //
  // // // top
  context_fill_polygon(vertices_array, {
    xy: [
      vertex_0.x, vertex_0.y,
      vertex_3.x, vertex_3.y,
      vertex_4.x, vertex_4.y,
      vertex_7.x, vertex_7.y,
    ],
    color: "#3B0866",
    y_text_coord: 100
  })
  
  // // // bottom
  context_fill_polygon(vertices_array, {
    xy: [
      vertex_2.x, vertex_2.y,
      vertex_1.x, vertex_1.y,
      vertex_6.x, vertex_6.y,
      vertex_5.x, vertex_5.y,
    ],
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
