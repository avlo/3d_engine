function generateRandomLines(num_lines) {
  let array = [[]]
  for (let i = 0; i < num_lines; i++) {
    let p1x = canvas.width - (canvas.width * Math.random())
    let p1y = canvas.height - (canvas.height * Math.random())
    let p2x = canvas.width - (canvas.width * Math.random())
    let p2y = canvas.height - (canvas.height * Math.random())
    let internal_array = [p1x, p1y, p2x, p2y]
    array.push(internal_array)
  }
  // let values = data_single_lines.values();
  // values.forEach(value => array.push(value))
  return array
}

const data_single_lines = [
  [0, 0, 100, 100],
  [50, 0, 200, 150],
  [100, 0, 300, 200]
]
