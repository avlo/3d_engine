function readWavefrontObj() {
  let input_vertices_array = [
    -1.000000, -1.000000, -1.000000
    , 1.000000, -1.000000, -1.000000
    , 1.000000, 1.000000, -1.000000
    , -1.000000, 1.000000, -1.000000

    , -1.000000, -1.000000, 1.000000
    , 1.000000, -1.000000, 1.000000
    , 1.000000, 1.000000, 1.000000
    , -1.000000, 1.000000, 1.000000
  ]

  let input_vertices = []
  for (let i = 0; i < input_vertices_array.length; i += 3) {
    input_vertices.push(
        {
          x: input_vertices_array[i],
          y: input_vertices_array[i + 1],
          z: input_vertices_array[i + 2]
        })
  }

  let input_faces = [
    ["0 3 2 1"]
    , ["4 5 6 7"]
    , ["0 1 5 4"]
    , ["1 2 6 5"]
    , ["2 3 7 6"]
    , ["3 0 4 7"]
  ]

  let faces_array = []
  for (let i = 0; i < input_faces.length; i++) {
    for (let inputFace of input_faces[i]) {
      let edges_array = []
      let face_indexes = inputFace.split(/\s*[\s,]\s*/);
      let number_of_vertices = face_indexes.length

      for (let j = 0; j < number_of_vertices - 1; j++) {
        let v0 = input_vertices[face_indexes[j]];
        let vertex_0 = {x: v0.x, y: v0.y, z: v0.z}
        let v1 = input_vertices[(face_indexes[j + 1])];
        let vertex_1 = {x: v1.x, y: v1.y, z: v1.z}
        let edge = {v0: vertex_0, v1: vertex_1,}
        // console.log("edge: " + JSON.stringify(edge))
        edges_array.push(edge)
        // console.log("edges_array: " + JSON.stringify(edges_array))
      }

      let face = {
        edges_array: edges_array,
        getVertices() {
          let local_vertices = []
          let numberOfEdges = edges_array.length;
          for (let k = 0; k < numberOfEdges; k++) {
            let v0 = edges_array[k].v0;
            local_vertices.push({x: v0.x, y: v0.y, z: v0.z})
          }
          // console.log("vertices.pushed: \n" + JSON.stringify(local_vertices, null, 1))
          return local_vertices
        }
      }
      let vertices = face.getVertices();
      console.log("face vertices[ " + i + " ]: \n" + JSON.stringify(vertices, null, 1))
      faces_array.push(face)
    }
  }

  let obj = {
    faces_array: faces_array,
  }
  return obj;
}
