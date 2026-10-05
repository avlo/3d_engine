/**
 * Returns the numeric values from every OBJ vertex line.
 *
 * @param {string} text OBJ file contents.
 * @returns {number[]} A flat array of vertex values.
 */
function parseVertexLines(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Expected OBJ file contents to be a string');
  }

  const vertices = [];

  text.split(/\r?\n/).forEach((line, lineIndex) => {
    const content = line.split('#', 1)[0].trim();
    if (!/^v\s+/.test(content)) {
      return;
    }

    const tokens = content.slice(1).trim().split(/\s+/);
    const floatPattern = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;
    if (tokens.some((token) => !floatPattern.test(token))) {
      throw new SyntaxError(`Invalid vertex value on line ${lineIndex + 1}`);
    }

    const values = tokens.map((token) => Number.parseFloat(token).toPrecision(7));
    vertices.push(values)
  });

  return vertices;
}

/**
 * Returns the integer indices from every OBJ face line.
 *
 * @param {string} text OBJ file contents.
 * @returns {number[][]} One array of indices per face.
 */
function parseFaceLines(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Expected OBJ file contents to be a string');
  }

  const faces = [];

  text.split(/\r?\n/).forEach((line, lineIndex) => {
    const content = line.split('#', 1)[0].trim();
    if (!/^f\s+/.test(content)) {
      return;
    }

    const values = content.slice(1).trim().split(/\s+/).map(Number);
    if (values.some((value) => !Number.isInteger(value))) {
      throw new SyntaxError(`Invalid face index on line ${lineIndex + 1}`);
    }

    faces.push(values);
  });

  return faces;
}
