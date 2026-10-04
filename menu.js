function setupMenu() {
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
