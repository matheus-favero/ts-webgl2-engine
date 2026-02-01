function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  script: string,
) {
  const shader = gl.createShader(type);
  if (!shader) {
    console.log("Couldn't load shader");
    return;
  }
  gl.shaderSource(shader, script);
  gl.compileShader(shader);
  const statusSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (statusSuccess) {
    return shader;
  }
  console.error("Error while compiling shader: ", gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const statusSuccess = gl.getProgramParameter(program, gl.COMPILE_STATUS);
  if (statusSuccess) {
    return program;
  }
  console.error(
    "Error while compiling shader: ",
    gl.getProgramInfoLog(program),
  );
  gl.deleteProgram(program);
}

async function main() {
  const canvas = document.querySelector("canvas");
  const gl = canvas?.getContext("webgl2");

  if (!gl) {
    alert("Your browser doesn't support webgl2!");
    return;
  }

  const vertexScript = await fetch("./shaders/vertex.glsl");
  const fragmentScript = await fetch("./shaders/fragment.glsl");

  const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    await vertexScript.text(),
  );
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    await fragmentScript.text(),
  );

  if (!vertexShader || !fragmentShader) {
    console.error("No vertex or fragment shader");
    return;
  }

  const program = createProgram(gl, vertexShader, fragmentShader);

  const vao = gl.createVertexArray();
}

try {
  main();
} catch (e) {
  console.error(e);
}
