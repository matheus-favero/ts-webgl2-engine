export class Transformation {
    static getCentroid(vtxPositions: Float32Array<ArrayBuffer>): number[] {
        let xs = [];
        let ys = [];

        for (let i = 0; i < vtxPositions.length; i++) {
            if (i % 3 == 0) {
                xs.push(vtxPositions[i]);
            } else if ((i-1) % 3 == 0)  {
                ys.push(vtxPositions[i]);
            }
        }
        console.log(ys);
        
        //sum every x and every y
        let centroidX = 0;
        let centroidY = 0;
        for (let i = 0; i < xs.length; i++) {
            centroidX += xs[i];
            centroidY += ys[i];
        }

        centroidX = centroidX / 3;
        centroidY = centroidY / 3;

        return [centroidX, centroidY];
    }

    static rotateZ(
        vtxPositions: Float32Array<ArrayBuffer>,
        radians: number[],
        centroidX: number,
        centroidY: number,
    ): Float32Array<ArrayBuffer> {
        const [radianX, radianY, radianZ] = radians;
        for (let i = 0; i < vtxPositions.length - 2; i++) {
            if (i % 3 == 0) {
                const x = vtxPositions[i] - centroidX;
                const y = vtxPositions[i + 1] - centroidY;
                const z = vtxPositions[i + 2];

                //rotating using Z axis
                const newXinZ = x * Math.cos(radianX) + y * -Math.sin(radianX);
                const newYinZ = x * Math.sin(radianX) + y * Math.cos(radianX);
                vtxPositions[i]     = newXinZ;
                vtxPositions[i + 1] = newYinZ;

                //rotating using Y axis
                // const newXinY = x * Math.cos(radianX) + z * Math.sin(radianX);
                // const newYinY = x * -Math.sin(radianX) + z * Math.cos(radianX);
                // vtxPositions[i]     = newXinY;
                // vtxPositions[i + 1] = newYinY;
            }
        }
        return vtxPositions;
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
}
