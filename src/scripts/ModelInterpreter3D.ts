export class ModelInterpreter3D {
    private static dimensions = 3;

    private vertices: number[][];
    private verticesIndex: number[][];
    private normalsIndex: number[];
    private normals: number[][];

    constructor(text: string) {
        const [verticesText, facesText, normalsText] =
            ModelInterpreter3D.getSubstring(text);
        this.vertices = ModelInterpreter3D.getVertices(verticesText);
        [this.verticesIndex, this.normalsIndex] =
            ModelInterpreter3D.getIndices(facesText);
        this.normals = ModelInterpreter3D.getNormals(normalsText);
    }
    getRandomColors(
        vtxPositions: Float32Array<ArrayBuffer>,
    ): Float32Array<ArrayBuffer> {
        const colors: number[] = [];
        let count = 0;
        for (let i = 0; i < vtxPositions.length; i++) {
            if (count === 3) {
                count = 0;
            } else {
                const random = Math.random() * 1;
                colors.push(random);
                count++;
            }
        }

        return new Float32Array(colors);
    }
    private static getSubstring(text: string): string[] {
        const verticesSubString = text.substring(
            text.indexOf("v "),
            text.indexOf("vn"),
        );
        let verticesCleanString = verticesSubString.replaceAll("v ", " ");
        verticesCleanString = verticesCleanString.replaceAll(/\r?\n|\r/g, "");

        const cleanText = text.replace(verticesSubString, "");

        const facesSubString = cleanText.substring(
            cleanText.indexOf("f "),
            cleanText.lastIndexOf("\n"),
        );
        let facesCleanString = facesSubString.replaceAll("f ", " ");
        facesCleanString = facesCleanString.replaceAll(/\r?\n|\r/g, "");

        const subString = text.substring(
            text.indexOf("vn "),
            text.indexOf("vt"),
        );
        let normalsCleanString = subString.replaceAll("vn", "");
        normalsCleanString = normalsCleanString.replaceAll(/\r?\n|\r/g, "");

        return [verticesCleanString, facesCleanString, normalsCleanString];
    }
    private static getVertices(text: string): number[][] {
        const dimensions = this.dimensions;

        const separatedStr = text.split(" ");
        separatedStr.splice(0, 1);

        //organizing by 3 items
        const vertices: number[][] = [];
        for (let line = 0; line < separatedStr.length / dimensions; line++) {
            const numbers: number[] = [];
            for (let number = 0; number < dimensions; number++) {
                numbers.push(Number(separatedStr[number + line * dimensions]));
            }
            vertices.push(numbers);
        }
        return vertices;
    }
    private static getIndices(text: string): [number[][], number[]] {
        const dimensions = this.dimensions;

        const separatedStr = text.split(" ");
        separatedStr.splice(0, 1);

        const onlyVertices: number[] = [];
        const onlyNormals: number[] = [];

        let i = 0;
        for (let number = 0; number < separatedStr.length; number++) {
            const numbersInString = separatedStr[number];

            const verticesIndex = numbersInString.split("/")[0];
            const verticesAsNum = Number(verticesIndex);
            onlyVertices.push(verticesAsNum);

            if (i === 2) {
                const normalsIndex = numbersInString.split("/")[2];
                const normalsAsNum = Number(normalsIndex);
                onlyNormals.push(normalsAsNum);
                i = 0;
            } else {
                i++;
            }
        }

        //organizing by 3 items
        const verticesIndex: number[][] = [];
        for (let line = 0; line < onlyVertices.length / dimensions; line++) {
            const numbers: number[] = [];
            for (let number = 0; number < dimensions; number++) {
                numbers.push(Number(onlyVertices[number + line * dimensions]));
            }
            verticesIndex.push(numbers);
        }

        return [verticesIndex, onlyNormals];
    }
    private static getNormals(text: string): number[][] {
        const dimensions = this.dimensions;

        const separatedStr = text.split(" ");
        separatedStr.splice(0, 1);

        //organizing by 3 items
        const vertices: number[][] = [];
        for (let line = 0; line < separatedStr.length / dimensions; line++) {
            const numbers: number[] = [];
            for (let number = 0; number < dimensions; number++) {
                numbers.push(Number(separatedStr[number + line * dimensions]));
            }
            vertices.push(numbers);
        }

        return vertices;
    }

    getVertexPositions(): Float32Array<ArrayBuffer> {
        const verticesIndex = this.verticesIndex;
        const vertices = this.vertices;

        //combine faces and vertices
        const vertexPositions: number[] = [];
        for (let line = 0; line < verticesIndex.length; line++) {
            const actualLineFace = verticesIndex[line];

            const indexSequence: number[] =
                actualLineFace.length < 4
                    ? [actualLineFace[0], actualLineFace[1], actualLineFace[2]]
                    : [
                          actualLineFace[0],
                          actualLineFace[1],
                          actualLineFace[2],
                          actualLineFace[2],
                          actualLineFace[3],
                          actualLineFace[0],
                      ];

            for (let i = 0; i < indexSequence.length; i++) {
                const selectedFaceIndex = indexSequence[i];

                const selectedVertex = vertices[selectedFaceIndex - 1];

                for (let i = 0; i < selectedVertex.length; i++) {
                    vertexPositions.push(selectedVertex[i]);
                }
                //make an artificial w dimension
                vertexPositions.push(1);
            }
        }

        return new Float32Array(vertexPositions);
    }

    getNormalsPositions(): Float32Array<ArrayBuffer> {
        const normalsIndex = this.normalsIndex;
        const normals = this.normals;

        const normalsPositions: number[] = [];
        for (let line = 0; line < normalsIndex.length; line++) {
            const selectedLine = normalsIndex[line];
            //console.log(selectedLine);
            const selectedNormal = normals[selectedLine - 1];
            for (let x = 0; x < selectedNormal.length; x++) {
                for (let i = 0; i < selectedNormal.length; i++) {
                    normalsPositions.push(selectedNormal[i]);
                }
            }
        }
        console.log(normalsPositions);

        return new Float32Array(normalsPositions);
    }
}
