const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");
const gl = canvas?.getContext("webgl2");

if (!gl) {
  console.error("Webgl2 is not supported by this browser.");
} else {
  try {
    main();
  } catch (e) {
    console.error("Error while compiling: ", e);
  }
}

function main() {
    alert("atasdw");
}
