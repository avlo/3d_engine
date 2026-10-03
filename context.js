function clear() {
  canvas_2d_context.fillStyle = BACKGROUND
  canvas_2d_context.fillRect(0, 0, canvas.width, canvas.height)
}

function draw_point({x, y}, pixels_width, foreground) {
  canvas_2d_context.fillStyle = foreground
  canvas_2d_context.fillRect(x - point_half, y - point_half, pixels_width, pixels_width)
}

function add_text(text, x, y, textWidth, foreground) {
  canvas_2d_context.font = textWidth + "px monospace";
  canvas_2d_context.fillStyle = foreground
  canvas_2d_context.fillText(text, x, y, textWidth)
  // context.fillStyle = BACKGROUND
}

function draw_line(p1, p2, pixels_width, foreground, lineStyle) {
  canvas_2d_context.setLineDash(lineStyle)
  canvas_2d_context.lineWidth = pixels_width
  canvas_2d_context.strokeStyle = foreground
  canvas_2d_context.beginPath()
  canvas_2d_context.moveTo(p1.x, p1.y)
  canvas_2d_context.lineTo(p2.x, p2.y)
  canvas_2d_context.stroke()
}

function display_vertices_coordinates(point_1, point_2, surface_normal_theta, face) {
  let surface_normal_legend = surface_normal_theta > 0 ? `+${surface_normal_theta}` : surface_normal_theta;
  canvas_2d_context.fillText(surface_normal_legend, 10, face.y_text_coord, 100)

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

  canvas_2d_context.fillText("p1:" + p1_string, point_1.x - 50, point_1.y)
  canvas_2d_context.fillText("p2:" + p2_string, point_2.x - 50, point_2.y)

  canvas_2d_context.fillText(formula, 100, face.y_text_coord)
}

function paint_face(face, starting_coordinate_x, starting_coordinate_y) {
  let vertices_array = face.vertices_array
  canvas_2d_context.beginPath();
  canvas_2d_context.moveTo(starting_coordinate_x, starting_coordinate_y);
  let length = vertices_array.length;
  for (let i = 2; i < length; i += 2) {
    canvas_2d_context.lineTo(
        vertices_array[i],
        vertices_array[i + 1]);
  }
  canvas_2d_context.closePath();
  canvas_2d_context.fill();
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
