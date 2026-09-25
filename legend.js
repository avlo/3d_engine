function do_legend(cos_dx, cos_prev_dx, cos_dy, cos_prev_dy, cos_dz, cos_prev_dz, cos_theta_z_surface, cos_prev_theta_z_surface) {
  display_legend(
      display_legend_arrow("dx", cos_dx, cos_prev_dx),
      cos_dy.toPrecision(2),
      legend_left_margin, 50)
  display_legend(
      display_legend_arrow("dy", cos_dy, cos_prev_dy),
      cos_dy.toPrecision(2),
      legend_left_margin, 100)
  display_legend(
      display_legend_arrow("dz", cos_dz, cos_prev_dz),
      cos_dz.toPrecision(2),
      legend_left_margin, 150)
  display_legend(
      display_legend_arrow(String.fromCharCode(0x0398), cos_theta_z_surface, cos_prev_theta_z_surface),
      cos_theta_z_surface,
      legend_left_margin, 200)
  display_legend("iter", iter++, 15, 780 - "iter".length)
}

function display_legend(key, value, x_pos, y_pos) {
  add_text(key + " = ", x_pos, y_pos, fixedTextWidth, LINES_FOREGROUND)
  let theta_precision = value;
  add_text(
      theta_precision,
      x_pos + 50, y_pos,
      fixedTextWidth,
      theta_precision <= 0 ? VERTICES_TEXT : VERTICES_FOREGROUND)
}

function display_legend_arrow(label, dz, prev_dz) {
  let incrementing = prev_dz - dz <= 0;
  return label + " " + (incrementing ? upArrow : downArrow)
}
