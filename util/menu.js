function setupMenu() {
  const meshFileSelect = document.getElementById("mesh-file")
  const displayVerticesCoordinatesCheckbox = document.getElementById("display-vertices-coordinates")
  const displayLegendCheckbox = document.getElementById("display-legend")
  const displayFacesCheckbox = document.getElementById("display-faces")
  const displayHiddenWireframeCheckbox = document.getElementById("display-hidden-wireframe")
  const displayVisibleWireframeCheckbox = document.getElementById("display-visible-wireframe")

  displayVerticesCoordinatesCheckbox.checked = display_vertices_coordinates_bool
  displayLegendCheckbox.checked = display_legend_bool
  displayFacesCheckbox.checked = display_faces_bool
  displayHiddenWireframeCheckbox.checked = display_wireframe_hidden_surface_bool
  displayVisibleWireframeCheckbox.checked = display_wireframe_visible_surface_bool

  populateMeshFileSelect(meshFileSelect)

  meshFileSelect.addEventListener("change", function () {
    let file = meshFileSelect.value;
    loadMesh(file)
  })
  displayVerticesCoordinatesCheckbox.addEventListener("change", function () {
    display_vertices_coordinates_bool = displayVerticesCoordinatesCheckbox.checked
  })
  displayLegendCheckbox.addEventListener("change", function () {
    display_legend_bool = displayLegendCheckbox.checked
  })
  displayFacesCheckbox.addEventListener("change", function () {
    display_faces_bool = displayFacesCheckbox.checked
  })
  displayHiddenWireframeCheckbox.addEventListener("change", function () {
    display_wireframe_hidden_surface_bool = displayHiddenWireframeCheckbox.checked
  })
  displayVisibleWireframeCheckbox.addEventListener("change", function () {
    display_wireframe_visible_surface_bool = displayVisibleWireframeCheckbox.checked
  })
}

function openDirectory() {
  let directory = "./data/";
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', directory, false); // false for synchronous request
  xmlHttp.send(null);
  let ret = xmlHttp.responseText;
  let fileList = ret.split('\n');
  let fileArray = []
  for (let i = 0; i < fileList.length; i++) {
    let fileInfo = fileList[i].split(' ');
    if (fileInfo[0] === '201:') {
      fileArray.push(directory + fileInfo[1])
    }
  }
  return fileArray
}

function populateMeshFileSelect(meshFileSelect) {
  let files = openDirectory();

  for (let i = 0; i<=files.length; i++){
    let opt = document.createElement('option');
    let parsedName = parseObjName(files[i]);
    if (parsedName == null)
      continue
    opt.value = files[i];
    opt.innerHTML = parsedName;
    meshFileSelect.appendChild(opt);
  }
  
  // meshFileSelect.add(new Option(d.display,d.value))
  // meshFileSelect.value = './data/octahedron-with-faces-sans-normals.obj'
  
  loadMesh(meshFileSelect.value)
}

function parseObjName(path) {
  const prefix = './data/';
  const suffix = '.obj';

  if (path == null)
    return 
  
  let b = path.startsWith(prefix);
  let b1 = path.endsWith(suffix);
  if (!b || !b1) 
    return

  return path.slice(prefix.length, -suffix.length);
}

function loadMesh(file) {
  fetch(file)
      .then((response) => {
        if (!response.ok)
          throw new Error(`Failed to load ${file}: ${response.status} ${response.statusText}`)

        return response.text()
      })
      .then((data) => {
        mesh = readWavefrontObj(data)
      })
      .catch((error) => {
        console.error(error)
      })
}
