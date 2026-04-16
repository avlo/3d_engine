let square_width = -.0625

function draw_square(cos_dz, theta, local_square_width) {
  let verticesUnitCube = get_vertices_unit_cube(local_square_width);
  draw_rotating_polygons(cos_dz, theta, verticesUnitCube)
  draw_rotating_vertices(cos_dz, theta, verticesUnitCube)
  draw_rotating_lines(cos_dz, theta, verticesUnitCube)
}

function fillPolygon(poly, color) {
  let fillStyle = color;

  let face_1_arr = [0, 1, 2, 3, 4, 5, 6, 7]
  let face_2_arr = [8, 9, 14, 15, 6, 7, 0, 1]
  let face_3_arr = [2, 3, 10, 11, 12, 13, 4, 5]
  let face_4_arr = [8, 9, 10, 11, 12, 13, 14, 15]

  let top = [4, 5, 6, 7, 14, 15, 12, 13]
  let bottom = [0, 1, 8, 9, 10, 11, 2, 3]

  // let faces_arr = [face_1_arr, face_2_arr, face_3_arr, face_4_arr, top, bottom]
  //
  // let faces = []
  // for (const face of faces_arr) {
  //   for (let i = 0; i < face.length / 2; i+=2) {
  //     faces.push({
  //       x: face[i],
  //       y: face[i + 1]
  //     })
  //   }
  // }

  context_fill_polygon_obj(poly, face_1_arr, "#EE2266", 50)
  context_fill_polygon_obj(poly, face_2_arr, "#2266EE", 100)
  context_fill_polygon_obj(poly, face_3_arr,"#EE6600", 150)
  context_fill_polygon_obj(poly, face_4_arr,"#114400", 200)

  context_fill_polygon_obj(poly, top,"#3B0866", 250)
  context_fill_polygon_obj(poly, bottom,"#772211", 300)

  // for (let item = 2; item < poly.length - 1; item += 2) {
  //   context.lineTo(poly[item], poly[item + 1])
  // }
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
