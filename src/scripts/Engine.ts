import { ModelInterpreter3D } from "./ModelInterpreter3D";
import { Transformation } from "./Transformation";

export class Engine {
    private gl: WebGL2RenderingContext;
    private numberOfDimensions = 4;
    private povDirection = [0, 0];

    constructor(canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext("webgl2")!;
        if (!this.gl) {
            console.error("Your browser doesn't support webgl2");
            return;
        }

        //add listeners to get buttons
        document.addEventListener("keydown", (e) => {
            if (e.key === "a") {
                this.povDirection[0] = -1;
            }
            if (e.key === "d") {
                this.povDirection[0] = 1;
            }
            if (e.key === "s") {
                this.povDirection[1] = -1;
            }
            if (e.key === "w") {
                this.povDirection[1] = 1;
            }
        });
        document.addEventListener("keyup", (e) => {
            if (e.key === "a") {
                this.povDirection[0] = 0;
            }
            if (e.key === "d") {
                this.povDirection[0] = 0;
            }
            if (e.key === "s") {
                this.povDirection[1] = 0;
            }
            if (e.key === "w") {
                this.povDirection[1] = 0;
            }
        });
    }

    private getRotationSlidersValue(): number[] {
        const valueX = Number(
            (document.querySelector("#rotX") as HTMLInputElement)?.value,
        );
        const valueY = Number(
            (document.querySelector("#rotY") as HTMLInputElement)?.value,
        );
        const valueZ = Number(
            (document.querySelector("#rotZ") as HTMLInputElement)?.value,
        );

        return [valueX, valueY, valueZ].map((item) => item * Math.PI * 0.02);
    }

    private getTranslationSlidersValue(): number[] {
        const valueX = Number(
            (document.querySelector("#transX") as HTMLInputElement)?.value,
        );
        const valueY = Number(
            (document.querySelector("#transY") as HTMLInputElement)?.value,
        );
        const valueZ = Number(
            (document.querySelector("#transZ") as HTMLInputElement)?.value,
        );

        return [valueX, valueY, valueZ].map((item) => item * 0.02);
    }
    private getTranslationSlidersValue2(): number[] {
        const valueX = Number(
            (document.querySelector("#trans2X") as HTMLInputElement)?.value,
        );
        const valueY = Number(
            (document.querySelector("#trans2Y") as HTMLInputElement)?.value,
        );
        const valueZ = Number(
            (document.querySelector("#trans2Z") as HTMLInputElement)?.value,
        );

        return [valueX, valueY, valueZ].map((item) => item * 0.02);
    }

    private getScaleSlidersValue(): number[] {
        const valueX = Number(
            (document.querySelector("#scaleX") as HTMLInputElement)?.value,
        );
        const valueY = Number(
            (document.querySelector("#scaleY") as HTMLInputElement)?.value,
        );
        const valueZ = Number(
            (document.querySelector("#scaleZ") as HTMLInputElement)?.value,
        );

        return [valueX, valueY, valueZ].map((item) => item * 0.05);
    }

    private getLightSlidersValue(): number[] {
        const valueX = Number(
            (document.querySelector("#lightX") as HTMLInputElement)?.value,
        );
        const valueY = Number(
            (document.querySelector("#lightY") as HTMLInputElement)?.value,
        );
        const valueZ = Number(
            (document.querySelector("#lightZ") as HTMLInputElement)?.value,
        );

        return [valueX, valueY, valueZ].map((item) => item * 0.01);
    }

    private getPOVMatrix(
        originalPosition: number[],
        translation: number[],
    ): number[] {
        const [transX, transY] = translation;
        const POVMatrix = Transformation.applyTranslation(originalPosition, [
            transX,
            transY,
            0,
        ]);
        return POVMatrix;
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

    private getTransfMatrix(
        scaling: number[],
        rotation: number[],
        translation: number[],
    ) {
        let transfMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

        transfMatrix = Transformation.applyScaling(transfMatrix, scaling);
        transfMatrix = Transformation.applyRotation(transfMatrix, rotation);
        transfMatrix = Transformation.applyTranslation(
            transfMatrix,
            translation,
        );
        transfMatrix = Transformation.applyPerspective(transfMatrix);

        return transfMatrix;
    }

    private render(
        program: WebGLProgram,
        transformationUniform: WebGLUniformLocation,
        colorUniform: WebGLUniformLocation,
        lightningUniform: WebGLUniformLocation,
        vtxCount: number,
    ) {
        const gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);

        const [lightningX, lightningY, lightningZ] =
            this.getLightSlidersValue();
        const player1TransfMatrix = this.getTransfMatrix(
            this.getScaleSlidersValue(),
            this.getRotationSlidersValue(),
            this.getTranslationSlidersValue(),
        );
        gl.uniformMatrix4fv(transformationUniform, false, player1TransfMatrix);
        gl.uniform4f(colorUniform, 1, 0.5, 0.1, 1.0);
        gl.uniform3f(lightningUniform, lightningX, lightningY, lightningZ);

        gl.drawArrays(gl.TRIANGLES, 0, vtxCount);
        
        //player2
        const player2TransfMatrix = this.getTransfMatrix(
            this.getScaleSlidersValue(),
            this.getRotationSlidersValue(),
            this.getTranslationSlidersValue2(),
        );
        gl.uniformMatrix4fv(transformationUniform, false, player2TransfMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, vtxCount);

        window.requestAnimationFrame(() =>
            this.render(
                program,
                transformationUniform,
                colorUniform,
                lightningUniform,
                vtxCount,
            ),
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

        const model3DObj = await fetch("./3d/Caveira_fudida.obj");
        const model3DText = await model3DObj.text();

        const modelInterpreter3D = new ModelInterpreter3D(model3DText);
        const vtxPositions = modelInterpreter3D.getVertexPositions();
        const vtxNormals = modelInterpreter3D.getNormalsPositions();

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

        const vtxNormalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vtxNormalsBuffer);
        const vtxNormalsAttrb = gl.getAttribLocation(program, "a_vtx_normals");
        gl.vertexAttribPointer(vtxNormalsAttrb, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vtxNormalsAttrb);
        gl.bufferData(gl.ARRAY_BUFFER, vtxNormals, gl.STATIC_DRAW);

        //UNIFORMS AREA
        const transformationUniform = gl.getUniformLocation(
            program,
            "u_transformations",
        );
        const colorUniform = gl.getUniformLocation(program, "u_colors");
        const lightningUniform = gl.getUniformLocation(program, "u_lightning");

        if (!transformationUniform || !colorUniform || !lightningUniform) {
            console.log("MISSING UNIFORM!");
            return;
        }

        const vtxCount = vtxPositions.length / this.numberOfDimensions;

        this.render(
            program,
            transformationUniform,
            colorUniform,
            lightningUniform,
            vtxCount,
        );
    }
}
