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
