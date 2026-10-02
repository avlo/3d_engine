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

function getScreenCoordinate(vertex1, theta, dz, z_offset) {
  return convertCubeCenteredCoordinatesToCanvasCoordinates(
      project_3d_to_2d(
          translate( // {x, y, z}, dz, z_offset
              rotate_z(
                  rotate_y(
                      rotate_x(vertex1, theta),
                      theta),
                  theta),
              dz, z_offset)));
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
