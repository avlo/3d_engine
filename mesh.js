let z_offset = 5

function draw_edge(dz, dy, dx, theta, mesh, z_offset) {
  let facesArray = mesh.faces_array;
  for (let i = 0; i < facesArray.length; i++) {
    let vertices = facesArray[i].getVertices();
    // console.log(JSON.stringify(vertices))
    for (let j = 0; j < vertices.length; j++) {
      let vertex_1 = vertices[j];
      let vertex_2 = vertices[(j + 1) % vertices.length];
      let p1 = getScreenCoordinate(vertex_1, theta, dz, z_offset)
      let p2 = getScreenCoordinate(vertex_2, theta, dz, z_offset);
      draw_line(p1, p2, line_pixels_width, EDGE_COLOR, SOLID_LINE)
    }
  }
}

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
          color: colors_array[i % colors_array.length],
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
    if (display_polygons_bool)
      paint_face(face, point_1_x, point_1_y)
    // draw_line(p1, p2, line_pixels_width, VERTICES_FOREGROUND, SOLID_LINE)
    if (display_wireframe_visible_surface_bool) {
      for (let i = 0; i < 4; i++) {
        let start = face.edges_array[i]
        let end = face.edges_array[(i + 1) % 4]
        draw_line(start, end, line_pixels_width / 2, EDGE_COLOR, SOLID_LINE)
      }
    }
  }

  if (surface_normal_theta <= 0) {
    if (display_wireframe_hidden_surface_bool) {
      for (let i = 3; i < 6; i++) {
        let start = face.edges_array[i]
        let end = face.edges_array[(i + 1) % 6]
        draw_line(start, end, line_pixels_width / 3, EDGE_COLOR, DASHED_LINE)
      }
    }
  }
}
