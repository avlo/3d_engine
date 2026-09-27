function clear() {
  context.fillStyle = BACKGROUND
  context.fillRect(0, 0, canvas.width, canvas.height)
}

function draw_point({x, y}, pixels_width, foreground) {
  context.fillStyle = foreground
  context.fillRect(x - point_half, y - point_half, pixels_width, pixels_width)
}

function add_text(text, x, y, textWidth, foreground) {
  context.font = textWidth + "px monospace";
  context.fillStyle = foreground
  context.fillText(text, x, y, textWidth)
  // context.fillStyle = BACKGROUND
}

function draw_line(p1, p2, pixels_width, foreground) {
  context.lineWidth = pixels_width
  context.strokeStyle = foreground
  context.beginPath()
  context.moveTo(p1.x, p1.y)
  context.lineTo(p2.x, p2.y)
  context.stroke()
}

function positivize(centered_point) {
// yields
//   -1..1 => 0..2
  return {
    x: centered_point.x + 1,
    y: centered_point.y + 1
  }
}

function normalize(positivized_point) {
// yields
//   -1..1 => 0..2 => 0..1  
  return {
    x: positivized_point.x / 2,
    y: positivized_point.y / 2
  }
}

function canvasIze(normalized_point) {
// yields
//   -1..1 => 0..2 => 0..1 => 0..w/h
  return {
    x: normalized_point.x * canvas.width,
// (4of4) reorient y axis
    y: (1 - normalized_point.y) * canvas.height
  }
}

function project_3d_to_2d({x, y, z}) {
  return {
    x: x / z,
    y: y / z
  }
}

function rotate_x({x, y, z}, theta) {
  let cos_theta = Math.cos(theta);
  let sin_theta = Math.sin(theta);
  // return {x, y, z}
  return {
    x: x,
    y: y * cos_theta - z * sin_theta,
    z: y * sin_theta + z * cos_theta
  }
}

function rotate_y({x, y, z}, theta) {
  let cos_theta = Math.cos(theta);
  let sin_theta = Math.sin(theta);
  // return {x, y, z}
  return {
    x: x * cos_theta - y * sin_theta,
    y: x * sin_theta + y * cos_theta,
    z
  }
}

function rotate_z({x, y, z}, theta) {
  let cos_theta = Math.cos(theta);
  let sin_theta = Math.sin(theta);
  return {
    x: x * cos_theta - z * sin_theta,
    y,
    z: x * sin_theta + z * cos_theta
  }
}

function translate({x, y, z}, dz, z_offset) {
  return {x, y, z: (-z + dz) + z_offset}
  // return {x, y, z: -z + .1}
}

function cross_product_aka_surface_normal(point1, point2, point3) {
  // normalize fxn: (x - min(x)) / (max(x) - min(x))

  // let min_x = 0;
  // let max_x = canvas.width
  // let point1_x = ((point1.x - min_x) / (max_x - min_x))
  // simplifies to:
  let point1_x = point1.x / canvas.width
  // and similar for the rest:
  let point1_y = point1.y / canvas.height
  let point2_x = point2.x / canvas.width
  let point2_y = point2.y / canvas.height
  let point3_x = point3.x / canvas.width
  let point3_y = point3.y / canvas.height

  let line1_x1_x2 = point1_x - point2_x
  let line1_x3_x2 = point3_x - point2_x

  let line1_y1_y2 = point1_y - point2_y
  let line1_y3_y2 = point3_y - point2_y
  // let line1_x1_diff = line1_x1_x2 - line1_x2_x3;

  // vector cross_product_aka_surface_normal product === surface normal
  return line1_x1_x2 * line1_y3_y2 - line1_y1_y2 * line1_x3_x2
}

function display_vertices_coordinates(point_1, point_2, surface_normal_theta, y_text_coord) {

  let surface_normal_legend = surface_normal_theta > 0 ? `+${surface_normal_theta}` : surface_normal_theta;
  context.fillText(surface_normal_legend, 10, y_text_coord, 100)

  let p1_string = point_1.x + "," + point_1.y
  let p2_string = point_2.x + "," + point_2.y
  let formula =
      "p1(" + point_1.x +
      "," +
      +point_1.y +
      ") p2(" + point_2.x +
      "," +
      point_2.y
      + ")";

  context.fillText("p1:" + p1_string, point_1.x-50, point_1.y)
  context.fillText("p2:" + p2_string, point_2.x-50, point_2.y)

  context.fillText(formula, 100, y_text_coord)
}

function context_fill_polygon(vertices_array, polygon_surface) {
  context.fillStyle = polygon_surface.color; // any css color
  context.font = 20 + "px monospace";
  let point_1_x = vertices_array[polygon_surface.xy[0]];
  let point_1_y = vertices_array[polygon_surface.xy[1]];
  let point_2_x = vertices_array[polygon_surface.xy[2]];
  let point_2_y = vertices_array[polygon_surface.xy[3]];
  let point_3_x = vertices_array[polygon_surface.xy[4]];
  let point_3_y = vertices_array[polygon_surface.xy[5]];

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
    display_vertices_coordinates(point_1_xy, point_3_xy, surface_normal_theta, polygon_surface.y_text_coord)
  }    

  if (surface_normal_theta > 0)
    paint_polygon_surface(vertices_array, point_1_x, point_1_y, polygon_surface)
}

function paint_polygon_surface(vertices_array, starting_coordinate_x, starting_coordinate_y, polygon_surface) {
  context.beginPath();
  context.moveTo(starting_coordinate_x, starting_coordinate_y);
  for (let i = 2; i < polygon_surface.xy.length; i += 2) {
    context.lineTo(vertices_array[polygon_surface.xy[i]], vertices_array[polygon_surface.xy[i + 1]]);
  }
  context.closePath();
  context.fill(); 
}

function draw_rotating_polygons(dz, dy, dx, theta, vertices, z_offset) {
  let vertices_array = []
  for (const vertex of vertices) {
    // draw vertices array
    let screen_coordinate = convertCubeCenteredCoordinatesToCanvasCoordinates(
        project_3d_to_2d(
            translate( // {x, y, z}, dz, z_offset
                rotate_z(
                    rotate_y(
                        rotate_x(vertex, theta),
                        theta),
                    theta),
                dz, z_offset)))
    vertices_array.push(screen_coordinate.x, screen_coordinate.y)
  }

  fillPolygon(vertices_array)
}

function draw_rotating_vertices(dz, theta, vertices, z_offset) {
  for (const vertex of vertices) {
    // draw vertices points
    let point = convertCubeCenteredCoordinatesToCanvasCoordinates(
        project_3d_to_2d(
            translate(
                rotate_z(vertex, theta), dz, z_offset)))

    let negative_bound_x = point.x <= canvasHalfWidth
    let color = negative_bound_x ? VERTICES_FOREGROUND : VERTICES_TEXT
    let cos_dz = Math.cos(dz);
    // draw corner points
    // draw_point(point, cos_dz * vertexPixelWidth / 1.25, color)

    // draw corner labels
    let text = negative_bound_x ? "+" : "-"
    let negative_bound_y = point.y <= canvasHalfHeight
    let point_y = negative_bound_y ? point.y : point.y + 20
    add_text(text, point.x - 10, point_y, cos_dz * fixedTextWidth / 1.25, color)
  }
}

function draw_rotating_lines(dz, dy, dx, theta, vertices, z_offset) {
  // array of vertices to connect == lines
  for (const line of cube_outline_lines) {
    for (let i = 0; i < line.length; i++) {
      const start = vertices[line[i]] // first vertex
      const end = vertices[line[(i + 1) % line.length]] // % == last vertex wrap around 
      let p1 = convertCubeCenteredCoordinatesToCanvasCoordinates(
          project_3d_to_2d(
              translate(
                  rotate_z(
                      rotate_y(
                          rotate_x(start, theta),
                          theta),
                      theta), dz, z_offset)));
      let p2 = convertCubeCenteredCoordinatesToCanvasCoordinates(
          project_3d_to_2d(
              translate(
                  rotate_z(
                      rotate_y(
                          rotate_x(end, theta),
                          theta),
                      theta), dz, z_offset)));
      draw_line(p1, p2, line_pixels_width, LINES_FOREGROUND)
    }
  }
}

function draw_lines(lines, line_width) {
  let colors = [VERTICES_FOREGROUND, LINES_FOREGROUND]
  let j = 0
  for (const line of lines) {
    // let color = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
    let color = colors[j++ % 2]
    for (let i = 0; i < line.length; i++) {
      draw_line({
        x: line[i],
        y: line[i + 1]
      }, {
        x: line[i + 2],
        y: line[i + 3]
      }, line_width, color)
      draw_line({
        x: canvas.width - line[i],
        y: canvas.height - line[i + 1]
      }, {
        x: canvas.width - line[i + 2],
        y: canvas.height - line[i + 3]
      }, line_width, color)
    }
  }
}

const hex2rgb = (hex) => {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16)]
}

const rgb2hex = (r, g, b) => {
  return '#' + (0x1000000 + ((r << 16) | (g << 8) | b)).toString(16).toUpperCase().slice(1) // #0080c0
}

function shift_color(css_color) {
  let rgb = hex2rgb(css_color);
  // return rgb2hex(rgb[1], rgb[2], rgb[0])
  return rgb2hex(rgb[0] >> 2, rgb[1] >> 2, rgb[2])
}
