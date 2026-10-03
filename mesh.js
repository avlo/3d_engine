let z_offset = 5

function draw_mesh(dz, dy, dx, theta, mesh, z_offset) {
  let facesArray = mesh.faces_array;
  for (let i = 0; i < facesArray.length; i++) {
    let vertices_array = []
    let vertices = facesArray[i].getVertices();
    for (let j = 0; j < vertices.length; j++) {
      let screen_coordinate_p1 = getScreenCoordinate(vertices[j], theta, dz, z_offset)
      vertices_array.push(screen_coordinate_p1.x, screen_coordinate_p1.y)

      if (display_wireframe_bool) {
        // % == last vertex wrap around
        let p2 = getScreenCoordinate(vertices[(j + 1) % vertices.length], theta, dz, z_offset);
        draw_line(screen_coordinate_p1, p2, line_pixels_width, LINES_FOREGROUND)
      }
    }
    fillFace(
        {
          vertices_array,
          color: colors_array[i%colors_array.length],
          y_text_coord: 20 })
    // draw_line(p1, p2, line_pixels_width, LINES_FOREGROUND)
  }
}

function fillFace(face) {
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

  if (!display_polygons_bool)
    return

  if (surface_normal_theta > 0)
    paint_face(face, point_1_x, point_1_y)
}
