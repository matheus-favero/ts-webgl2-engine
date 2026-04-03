import { number } from "astro:schema";

export class Transformation {
    static matrixMultiplication(
        matrix1: number[],
        matrix2: number[],
        numberOfDimensions: number,
    ): number[] {
        let sum: number[] = [];
        let matrix: number[] = [];
        let total = 0;

        for (let l = 0; l < numberOfDimensions; l++) {
            for (let c = 0; c < numberOfDimensions; c++) {
                for (let n = 0; n < numberOfDimensions; n++) {
                    const n1 = matrix1[numberOfDimensions * l + n];
                    const n2 = matrix2[c + n * numberOfDimensions];

                    sum.push(n1 * n2);
                }

                //calculates total of each multiplication
                for (let i = 0; i < numberOfDimensions; i++) {
                    total += sum[i];
                }
                sum.splice(0, sum.length);
                matrix.push(total);
                total = 0;
            }
        }
        return matrix;
    }

    // static organizeMatrix(
    //     matrix: number[],
    //     numberOfDimensions: number,
    //     isLine: boolean,
    // ) {
    //     let fixedMatrix: number[][] = [];

    //     if (isLine) {
    //         for (let n = 0; n < numberOfDimensions; n++) {
    //             let vector: number[] = [];

    //             for (let i = 0; i < numberOfDimensions; i++) {
    //                 vector.push(matrix[i + n * numberOfDimensions]);
    //             }

    //             fixedMatrix.push(vector);
    //         }
    //     } else {
    //         for (let n = 0; n < numberOfDimensions; n++) {
    //             let vector: number[] = [];

    //             for (let i = 0; i < numberOfDimensions; i++) {
    //                 vector.push(matrix[n + i * numberOfDimensions]);
    //             }

    //             fixedMatrix.push(vector);
    //         }
    //     }

    //     return fixedMatrix;
    // }
    // static matrixMultiplication(
    //     matrix1: number[],
    //     matrix2: number[],
    //     numberOfDimensions: number,
    // ): number[] {
    //     let fixedMatrix1: number[][] = this.organizeMatrix(
    //         matrix1,
    //         numberOfDimensions,
    //         true,
    //     );
    //     let fixedMatrix2: number[][] = this.organizeMatrix(
    //         matrix2,
    //         numberOfDimensions,
    //         false,
    //     );

    //     let sum: number[] = [];
    //     let total = 0;

    //     let finalMatrix: number[] = [];

    //     for (let i1 = 0; i1 < fixedMatrix1.length; i1++) {
    //         const vector1 = fixedMatrix1[i1];

    //         for (let i2 = 0; i2 < fixedMatrix2.length; i2++) {
    //             const vector2 = fixedMatrix2[i2];

    //             for (let number = 0; number < numberOfDimensions; number++) {
    //                 const number1 = vector1[number];
    //                 const number2 = vector2[number];

    //                 sum.push(number1 * number2);
    //             }

    //             for (let i = 0; i < numberOfDimensions; i++) {
    //                 total += sum[i];
    //             }
    //             sum.splice(0, sum.length);
    //             finalMatrix.push(total);
    //             total = 0;
    //         }
    //     }
    //     return finalMatrix;
    // }

    static rotate(rotations: number[], numberOfDimensions: number): number[] {
        const [zRotation, yRotation, xRotation] = rotations;

        const sinZ = Math.sin(zRotation);
        const cosZ = Math.cos(zRotation);

        const sinY = Math.sin(yRotation);
        const cosY = Math.cos(yRotation);

        const sinX = Math.sin(xRotation);
        const cosX = Math.cos(xRotation);

        const z = [cosZ, -sinZ, 0, 0, sinZ, cosZ, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        const y = [cosY, 0, sinY, 0, 0, 1, 0, 0, -sinY, 0, cosY, 0, 0, 0, 0, 1];
        const x = [1, 0, 0, 0, 0, cosX, sinX, 0, 0, -sinX, cosX, 0, 0, 0, 0, 1];
        const w = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

        const zy = this.matrixMultiplication(z, y, numberOfDimensions);
        const yx = this.matrixMultiplication(zy, x, numberOfDimensions);
        const xw = this.matrixMultiplication(yx, w, numberOfDimensions);
        return xw;
    }

    static scale(
        vtxPositions: Float32Array<ArrayBuffer>,
        distance: number,
    ): Float32Array<ArrayBuffer> {
        for (let i = 0; i < vtxPositions.length; i++) {
            vtxPositions[i] *= distance;
        }

        return vtxPositions;
    }

    static translation() {}

    static applyPerspective(matrix: number[]): number[] {
        const w = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0.25, 0, 0, 0, 1];
        const appliedPerspective = this.matrixMultiplication(matrix, w, 4);
        return appliedPerspective;
    }

    static transform(
        rotations: number[],
        numberOfDimensions: number,
    ): Float32Array<ArrayBuffer> {
        const rotationMatrix = this.rotate(rotations, numberOfDimensions);
        const perspectiveMatrix = this.applyPerspective(rotationMatrix);

        return new Float32Array(perspectiveMatrix);
    }
}
