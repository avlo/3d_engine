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

  // context.strokeStyle = foreground
  // context.strokeText(text, x, y, text_width)
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

// translate point (x,y) from screen center coordinates (0, 0) to HTML canvas top left coordinates (0, w/h), i.e,
//    -1..1 => 0..w/h
function convertCenteredCoordinatesToCanvasCoordinates(centered_point) {
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

function project_3d_to_2d({x, y, z}) {
  return {
    x: x / z,
    y: y / z
  }
}

function rotate({x, y, z}, theta) {
  // theta *= .01 * theta // rotation speed
  let cos_theta = Math.cos(theta);
  let sin_theta = Math.sin(theta);
  return {
    x: x * cos_theta - z * sin_theta,
    y,
    z: x * sin_theta + z * cos_theta
  }
}

function translate({x, y, z}, dz) {
  // return {x, y, z: -z + dz}
  return {x, y, z: -z + .1}
}

function draw_square(cos_dz, theta, local_square_width) {
  let verticesUnitCube = get_vertices_unit_cube(local_square_width);
  draw_rotating_polygons(cos_dz, theta, verticesUnitCube)
  draw_rotating_vertices(cos_dz, theta, verticesUnitCube)
  draw_rotating_lines(cos_dz, theta, verticesUnitCube)
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
  return rgb2hex(rgb[0]>>2, rgb[1]>>2, rgb[2])
}

function context_fill_polygon(poly, a,b,c,d,e,f,g,h, color, y_text) {
  context.fillStyle = color; // any css color
  context.font = 50 + "px monospace";

  context.fillText(color, 10, y_text, 100)
  context.beginPath();
  context.moveTo(poly[a], poly[b]);
  context.lineTo(poly[c], poly[d]);
  context.lineTo(poly[e], poly[f]);
  context.lineTo(poly[g], poly[h]);
  context.closePath();
  context.fill();
}

function draw_rotating_polygons(dz, theta, vertices) {
  let points = []
  for (const vertex of vertices) {
    // draw vertices points
    let point = convertCenteredCoordinatesToCanvasCoordinates(
        project_3d_to_2d(
            translate(
                rotate(vertex, theta), dz)))
    points.push(point.x, point.y)
  }

  fillPolygon(points, POLY_FILL_FRONT)
}

function draw_rotating_vertices(dz, theta, vertices) {
  for (const vertex of vertices) {
    // draw vertices points
    let point = convertCenteredCoordinatesToCanvasCoordinates(
        project_3d_to_2d(
            translate(
                rotate(vertex, theta), dz)))

    let negative_bound = point.x <= canvasHalfWidth
    let color = negative_bound ? VERTICES_FOREGROUND : VERTICES_TEXT
    let cos_dz = Math.cos(dz);
    // draw corner points
    draw_point(point, cos_dz * vertexPixelWidth / 1.25, color)

    // draw corner labels
    let text = negative_bound ? "+" : "-"
    add_text(text, point.x, point.y, cos_dz * fixedTextWidth / 1.25, color)
  }
}

function draw_rotating_lines(dz, theta, vertices) {
  // array of vertices to connect == lines
  for (const line of vertex_connections) {
    for (let i = 0; i < line.length; i++) {
      const start = vertices[line[i]] // first vertex
      const end = vertices[line[(i + 1) % line.length]] // % == last vertex wrap around 
      let p1 = convertCenteredCoordinatesToCanvasCoordinates(
          project_3d_to_2d(
              translate(
                  rotate(start, theta), dz)));
      let p2 = convertCenteredCoordinatesToCanvasCoordinates(
          project_3d_to_2d(
              translate(
                  rotate(end, theta), dz)));
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

function display_legend(key, value, x_pos, y_pos) {
  add_text(key + " = ", x_pos, y_pos, fixedTextWidth, LINES_FOREGROUND)
  let theta_precision = value;
  add_text(
      theta_precision,
      x_pos + 50, y_pos,
      fixedTextWidth,
      theta_precision <= 0 ? VERTICES_TEXT : VERTICES_FOREGROUND)
}

function display_legend_arrow(label, dz, prev_dz) {
  let incrementing = prev_dz - dz <= 0;
  return label + " " + (incrementing ? upArrow : downArrow)
}

function fillPolygon(poly, color) {
  let fillStyle = color;
  context_fill_polygon(poly, 0,1,2,3,4,5,6,7, "#EE2266", 50)
  context_fill_polygon(poly, 8,9,14,15,6,7,0,1, "#2266EE", 100)
  context_fill_polygon(poly, 2,3,10,11,12,13,4,5, "#EE6600", 150)
  context_fill_polygon(poly, 8,9,10,11,12,13,14,15, "#114400", 200)

  context_fill_polygon(poly, 4,5,6,7,14,15,12,13, "#3B0866", 250)
  context_fill_polygon(poly, 0,1,8,9,10,11,2,3, "#772211", 300)

  // for (let item = 2; item < poly.length - 1; item += 2) {
  //   context.lineTo(poly[item], poly[item + 1])
  // }
}
