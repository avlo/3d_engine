function readWavefrontObj(data) {
  let verticesObjectsArray =
      asInputVerticesObjectArray(
          parseVertexLines(data));

  let facesArrayArray = indexTranslatedFaces(data, verticesObjectsArray);

  let faces_array = []
  for (let i = 0; i < facesArrayArray.length; i++) {
    let edges_array = []
    let number_of_vertices = facesArrayArray[i].face.length

    for (let j = 0; j < number_of_vertices; j++) {
      let edge = createEdge(verticesObjectsArray, facesArrayArray[i].face, j);
      // console.log("edge: " + JSON.stringify(edge))
      edges_array.push(edge)
      // console.log("edges_array: " + JSON.stringify(edges_array))
    }

    faces_array.push(
        createFace(
            edges_array,
            facesArrayArray[i].color))
  }

  return {faces_array: faces_array};
}

function indexTranslatedFaces(data, verticesObjectsArray) {
  let shiftIndexToZero = parseFaceLines(data).map(array =>
      array.map(value => value - 1));

  let set = []
  for (let i = 0; i < shiftIndexToZero.length; i++) {
    let face = shiftIndexToZero[i];
    let color = verticesObjectsArray[face[0]][1];
    set.push({face: face, color: color})
  }
  
  return set
}

function createFace(edges_array, color) {
  return {
    edges_array: edges_array,
    color: color,
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
}

function createEdge(input_vertices, face_indexes, j) {
  let v0 = input_vertices[face_indexes[j]][0];
  let vertex_0 = {x: v0.x, y: v0.y, z: v0.z}
  let v1 = input_vertices[face_indexes[(j + 1) % face_indexes.length]][0];
  let vertex_1 = {x: v1.x, y: v1.y, z: v1.z}
  return {v0: vertex_0, v1: vertex_1,};
}

function asInputVerticesObjectArray(input_vertices_array) {
  let input_vertices = []
  for (let i = 0; i < input_vertices_array.length; i++) {
    let innerArray = input_vertices_array[i];
    let x = innerArray[0];
    let y = innerArray[1];
    let z = innerArray[2];
    let xyz = {x: x, y: y, z: z}
    let rgb
    if (innerArray.length === 6) {
      let r = innerArray[3];
      let g = innerArray[4];
      let b = innerArray[5];
      rgb = rgb01_to_hex({r: r, g: g, b: b})
    }
    input_vertices.push([xyz, rgb])
    console.log(JSON.stringify(input_vertices))
    console.log("")
  }
  return input_vertices;
}

function rgb01_to_hex({r: r, g: g, b: b}) {
  return "#".concat(pad(r)).concat(pad(g)).concat(pad(b));
}

function pad(num) {
  return ('00' + Math.round(num * 255).toString(16)).slice(-2);
}
