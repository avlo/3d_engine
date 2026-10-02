function createFace(edges_array) {
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
  return face;
}

function createEdge(input_vertices, face_indexes, j) {
  let v0 = input_vertices[face_indexes[j]];
  let vertex_0 = {x: v0.x, y: v0.y, z: v0.z}
  let v1 = input_vertices[(face_indexes[j + 1])];
  let vertex_1 = {x: v1.x, y: v1.y, z: v1.z}
  let edge = {v0: vertex_0, v1: vertex_1,}
  return edge;
}

function readWavefrontObj() {
  let input_vertices =
      asInputVerticesObjectArray(
          inputVerticesArray());
  
  let input_faces = indexTranslatedFaces()

  let faces_array = []
  for (let i = 0; i < input_faces.length; i++) {
    for (let inputFace of input_faces[i]) {
      let edges_array = []
      let face_indexes = inputFace.split(/\s*[\s,]\s*/);
      let number_of_vertices = face_indexes.length

      for (let j = 0; j < number_of_vertices - 1; j++) {
        let edge = createEdge(input_vertices, face_indexes, j);
        // console.log("edge: " + JSON.stringify(edge))
        edges_array.push(edge)
        // console.log("edges_array: " + JSON.stringify(edges_array))
      }

      let face = createFace(edges_array);
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

function indexTranslatedFaces() {
  // below as read from obj file...
  /*
  let original_input_faces = [
    ["1 4 3 2"],
    ["5 6 7 8"],
    ["1 2 6 5"],
    ["2 3 7 6"],
    ["3 4 8 7"],
    ["4 1 5 8"]
  ]
  */
  // has each value-1 so can work with 0-index start array (instead of 1-index)
  return [
    ["0 3 2 1"]
    , ["4 5 6 7"]
    , ["0 1 5 4"]
    , ["1 2 6 5"]
    , ["2 3 7 6"]
    , ["3 0 4 7"]
  ]
}

function asInputVerticesObjectArray(input_vertices_array) {
  let input_vertices = []
  for (let i = 0; i < input_vertices_array.length; i += 3) {
    input_vertices.push(
        {
          x: input_vertices_array[i],
          y: input_vertices_array[i + 1],
          z: input_vertices_array[i + 2]
        })
  }
  return input_vertices;
}

function inputVerticesArray() {
  return [
    -1.000000, -1.000000, -1.000000
    , 1.000000, -1.000000, -1.000000
    , 1.000000, 1.000000, -1.000000
    , -1.000000, 1.000000, -1.000000

    , -1.000000, -1.000000, 1.000000
    , 1.000000, -1.000000, 1.000000
    , 1.000000, 1.000000, 1.000000
    , -1.000000, 1.000000, 1.000000
  ]
}
