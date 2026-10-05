let z_offset = 5

function render(dz, dy, dx, theta, mesh, z_offset) {
  let facesArray = mesh.faces_array;
  for (let i = 0; i < facesArray.length; i++) {
    let vertices_array = []
    let edges_array = []
    let vertices = facesArray[i].getVertices();
    for (let j = 0; j < vertices.length; j++) {
      let vertex_1 = vertices[j];
      let vertex_2 = vertices[(j + 1) % vertices.length];
      let p1 = getScreenCoordinate(vertex_1, theta, dz, z_offset)
      let p2 = getScreenCoordinate(vertex_2, theta, dz, z_offset);
      vertices_array.push(p1.x, p1.y)
      edges_array.push(p1, p2)
    }
    fill(
        {
          vertices_array,
          edges_array,
          color: facesArray[i].color,
          y_text_coord: 20
        })
    // draw_line(p1, p2, line_pixels_width, LINES_FOREGROUND)
  }
}

function fill(face) {
  canvas_2d_context.fillStyle = face.color; // any css color
  let point_1_x = face.vertices_array[0];
  let point_1_y = face.vertices_array[1];
  let point_2_x = face.vertices_array[2];
  let point_2_y = face.vertices_array[3];
  let point_3_x = face.vertices_array[4];
  let point_3_y = face.vertices_array[5];

  let point_1_xy = {
    x: point_1_x.toPrecision(3),
    y: point_1_y.toPrecision(3)
  }
  let point_2_xy = {
    x: point_2_x.toPrecision(3),
    y: point_2_y.toPrecision(3)
  }
  let point_3_xy = {
    x: point_3_x.toPrecision(3),
    y: point_3_y.toPrecision(3)
  }

  let surface_normal_theta = cross_product_aka_surface_normal(point_1_xy, point_2_xy, point_3_xy).toPrecision(2);
  if (display_vertices_coordinates_bool) {
    display_vertices_coordinates(point_1_xy, point_3_xy, surface_normal_theta, face)
  }

  if (surface_normal_theta >= 0) {
    if (display_faces_bool)
      paint_face(face, point_1_x, point_1_y)
    
    if (display_wireframe_visible_surface_bool)
      paint_edge(face, point_1_x, point_1_y, SOLID_LINE)
    return
  }

  if (display_wireframe_hidden_surface_bool)
    paint_edge(face, point_1_x, point_1_y, DASHED_LINE)
}

function paint_edge(face, starting_coordinate_x, starting_coordinate_y, lineStyle) {
  let vertices_array = face.vertices_array
  let length = vertices_array.length;
  for (let i = 0; i < length-1; i += 2) {
    let v1_x = vertices_array[i];
    let v1_y = vertices_array[i + 1];
    let p1 = { x: v1_x, y: v1_y }
    let v2_x = vertices_array[(i + 2) % length];
    let v2_y = vertices_array[(i + 3) % length];
    let p2 = { x: v2_x, y: v2_y }
    draw_line(p1, p2, line_pixels_width / 2, EDGE_COLOR, lineStyle)
  }
}
