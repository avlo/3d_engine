function readWavefrontObj(data) {
  let verticesObjectsArray =
      asInputVerticesObjectArray(
          parseVertexLines(data));

  let facesArrayArray = indexTranslatedFaces(data);

  let faces_array = []
  for (let i = 0; i < facesArrayArray.length; i++) {
    let edges_array = []
    let number_of_vertices = facesArrayArray[i].length

    for (let j = 0; j < number_of_vertices; j++) {
      let edge = createEdge(verticesObjectsArray, facesArrayArray[i], j);
      // console.log("edge: " + JSON.stringify(edge))
      edges_array.push(edge)
      // console.log("edges_array: " + JSON.stringify(edges_array))
    }

    let face = createFace(edges_array);
    let vertices = face.getVertices();
    // console.log("face vertices[ " + i + " ]: \n" + JSON.stringify(vertices, null, 1))
    faces_array.push(face)
  }

  return {faces_array: faces_array};
}

function indexTranslatedFaces(data) {
  return parseFaceLines(data).map(array =>
      array.map(value => value - 1))
}

function createFace(edges_array) {
  return {
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
  };
}

function createEdge(input_vertices, face_indexes, j) {
  let v0 = input_vertices[face_indexes[j]];
  let vertex_0 = {x: v0.x, y: v0.y, z: v0.z}
  let v1 = input_vertices[face_indexes[(j + 1) % face_indexes.length]];
  let vertex_1 = {x: v1.x, y: v1.y, z: v1.z}
  return {v0: vertex_0, v1: vertex_1,};
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
