let z_offset = 5

function fillPolygon(vertices_array, input_color, coordinate) {
  // side 1
  // let length = vertices_array.length;
  // let xy = []
  // for (let i = 0; i < length; i+=2) {
  //   xy.push(vertices_array[i], vertices_array[i+1])
  // }
  let polygonSurface = {
    vertices_array,
    color: input_color,
    y_text_coord: coordinate
  };
  context_fill_polygon(vertices_array, polygonSurface)
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
