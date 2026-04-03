import { Transformation } from "./Transformation";

export class Engine {
    private gl: WebGL2RenderingContext;
    private numberOfDimensions = 4;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext("webgl2")!;
        if (!this.gl) {
            console.error("Your browser doesn't support webgl2");
            return;
        }
    }

    private getRotationSlidersValue(): number[] {
        let valueX = Number(
            (document.querySelector("#rotX") as HTMLInputElement)?.value,
        );
        let valueY = Number(
            (document.querySelector("#rotY") as HTMLInputElement)?.value,
        );
        let valueZ = Number(
            (document.querySelector("#rotZ") as HTMLInputElement)?.value,
        );

        return [valueX, valueY, valueZ];
    }

    private configureShader(type: number, script: string) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader) {
            console.error("No shader found");
            return;
        }
        gl.shaderSource(shader, script);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    private configureProgram(
        vertexShader: WebGLShader,
        fragmentShader: WebGLShader,
    ) {
        const gl = this.gl;
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    private render(
        program: WebGLProgram,
        vertexArrayObj: WebGLVertexArrayObject,
        rotationUniform: WebGLUniformLocation,
        vtxCount: number,
    ) {
        const gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);

        const rotations = this.getRotationSlidersValue().map(
            (item) => item * Math.PI * 0.02,
        );
        const transfMatrix = Transformation.transform(
            rotations,
            this.numberOfDimensions,
        );
        gl.uniformMatrix4fv(rotationUniform, false, transfMatrix);

        gl.drawArrays(gl.TRIANGLES, 0, vtxCount);

        window.requestAnimationFrame(() =>
            this.render(program, vertexArrayObj, rotationUniform, vtxCount),
        );
    }

    async init() {
        const vertexScript = await fetch("./shaders/vertex.vert");
        const fragmentScript = await fetch("./shaders/fragment.frag");
        const gl = this.gl;

        //enables z index
        gl.enable(gl.DEPTH_TEST);

        const vertexShader = this.configureShader(
            gl.VERTEX_SHADER,
            await vertexScript.text(),
        );
        const fragmentShader = this.configureShader(
            gl.FRAGMENT_SHADER,
            await fragmentScript.text(),
        );
        if (!vertexShader || !fragmentShader) {
            console.error("No fragment or vertex shader");
            return;
        }

        const program = this.configureProgram(vertexShader, fragmentShader);
        if (!program) {
            console.error("Couldn't load program");
            return;
        }

        const vertexArrayObj = gl.createVertexArray();
        gl.bindVertexArray(vertexArrayObj);

        const vtxPositions = new Float32Array([
            //front
            -0.5, 0.5, -0.5, 1, 0.5, -0.5, -0.5, 1, -0.5, -0.5, -0.5, 1, -0.5,
            0.5, -0.5, 1, 0.5, 0.5, -0.5, 1, 0.5, -0.5, -0.5, 1,

            //right
            0.5, 0.5, -0.5, 1, 0.5, 0.5, 0.5, 1, 0.5, -0.5, 0.5, 1, 0.5, 0.5,
            -0.5, 1, 0.5, -0.5, 0.5, 1, 0.5, -0.5, -0.5, 1,

            //left
            -0.5, 0.5, -0.5, 1, -0.5, 0.5, 0.5, 1, -0.5, -0.5, 0.5, 1, -0.5,
            0.5, -0.5, 1, -0.5, -0.5, 0.5, 1, -0.5, -0.5, -0.5, 1,

            //back
            -0.5, 0.5, 0.5, 1, 0.5, -0.5, 0.5, 1, -0.5, -0.5, 0.5, 1, -0.5, 0.5,
            0.5, 1, 0.5, 0.5, 0.5, 1, 0.5, -0.5, 0.5, 1,
        ]);

        const vtxPositionsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vtxPositionsBuffer);

        const vtxPositionsAttrb = gl.getAttribLocation(
            program,
            "a_vtx_position",
        );
        gl.vertexAttribPointer(
            vtxPositionsAttrb,
            this.numberOfDimensions,
            gl.FLOAT,
            false,
            0,
            0,
        );
        gl.enableVertexAttribArray(vtxPositionsAttrb);
        gl.bufferData(gl.ARRAY_BUFFER, vtxPositions, gl.STATIC_DRAW);

        const rotationUniform = gl.getUniformLocation(program, "u_rotations");
        if (!rotationUniform) {
            console.log("NO ROTATION UNIFORM!");
            return;
        }

        const vtxCount = vtxPositions.length / this.numberOfDimensions;

        this.render(program, vertexArrayObj, rotationUniform, vtxCount);
    }
}
