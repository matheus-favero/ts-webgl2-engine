export class Transformation {
    private static numberOfDimensions = 4;

    static matrixMult(
        matrix1: number[],
        matrix2: number[],
    ): number[] {
        const numberOfDimensions = this.numberOfDimensions;
        let matrix: number[] = [];

        for (let l = 0; l < numberOfDimensions; l++) {
            for (let c = 0; c < numberOfDimensions; c++) {
                let total = 0;
                for (let n = 0; n < numberOfDimensions; n++) {
                    const n1 = matrix1[numberOfDimensions * l + n];
                    const n2 = matrix2[c + n * numberOfDimensions];

                    total += n1 * n2;
                }
                matrix.push(total);
            }
        }
        return matrix;
    }

    static applyRotation(matrix: number[], rotations: number[]): number[] {
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

        const zy = this.matrixMult(z, y);
        const yx = this.matrixMult(zy, x);
        
        const finalMatrix = this.matrixMult(yx, w);

        return this.matrixMult(matrix, finalMatrix);
    }

    static applyScaling(
        matrix: number[],
        scaling: number[],
    ): number[] {
        const [distanceX, distanceY, distanceZ] = scaling;

        const transformation = [
            distanceX, 0, 0, 0, 
            0, distanceY, 0, 0, 
            0, 0, distanceZ, 0, 
            0, 0, 0, 1
        ];

        const appliedScaling = this.matrixMult(matrix, transformation);

        return appliedScaling;
    }

    static applyTranslation(matrix: number[], translation: number[]): number[] {
        const [distanceX, distanceY, distanceZ] = translation;
        
        const transformation = [
            1, 0, 0, 0, 
            0, 1, 0, 0, 
            0, 0, 1, 0, 
            distanceX, distanceY, distanceZ, 1
        ];

        const appliedTransl = this.matrixMult(matrix, transformation);
        
        return appliedTransl;
    }

    static applyPerspective(matrix: number[]): number[] {
        const w = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1];
        const appliedPerspective = this.matrixMult(matrix, w);
        return appliedPerspective;
    }

}
