import { Transformation } from "./Transformation";

export class Engine {
    private gl: WebGL2RenderingContext;
    private index = 0;

    // private mouseX = 0;
    // private mouseY = 0;

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

        if (!(typeof valueX === "number")) {
            valueX = 0;
        }
        if (!(typeof valueY === "number")) {
            valueY = 0;
        }
        if (!(typeof valueZ === "number")) {
            valueZ = 0;
        }

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
        texture: WebGLTexture,
    ) {
        const gl = this.gl;

        gl.clearColor(0, 0, 0.2, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const vtxPositionsAttrb = gl.getAttribLocation(
            program,
            "a_vtx_position",
        );
        const vtxPositionsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vtxPositionsBuffer);

        let vtxPositions = new Float32Array([
            -0.5, 0.5, 0, 
            0.5, -0.5, 0, 
            -0.5, -0.5, 0,

            -0.5, 0.5, 0, 
            0.5, 0.5, 0, 
            0.5, -0.5, 0,
        ]);
        const numberOfDimensions = 3;
        const vtxCount = vtxPositions.length / numberOfDimensions;

        const [centroidX, centroidY] = Transformation.getCentroid(vtxPositions);
        const radians = this.getRotationSlidersValue().map(
            (item) => item * Math.PI * 0.02,
        );

        vtxPositions = Transformation.rotateZ(
            vtxPositions,
            radians,
            centroidX,
            centroidY,
        );

        gl.bufferData(gl.ARRAY_BUFFER, vtxPositions, gl.STATIC_DRAW);
        gl.bindVertexArray(vertexArrayObj);
        gl.enableVertexAttribArray(vtxPositionsAttrb);
        gl.vertexAttribPointer(vtxPositionsAttrb, numberOfDimensions, gl.FLOAT, false, 0, 0);

        const textureUniform = gl.getUniformLocation(program, "u_texture");

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.useProgram(program);

        gl.uniform1i(textureUniform, 0);

        gl.drawArrays(gl.TRIANGLES, 0, vtxCount);

        window.requestAnimationFrame(() =>
            this.render(program, vertexArrayObj, texture),
        );
    }

    private async loadTexture(url: string) {
        const gl = this.gl;

        const texture = gl.createTexture();

        const image = new Image();
        image.src = url;
        await image.decode();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image,
        );
        gl.generateMipmap(gl.TEXTURE_2D);

        return texture;
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
        const texture = this.loadTexture("./images/explosao.jpg");
        this.render(program, vertexArrayObj, await texture);
    }
}
