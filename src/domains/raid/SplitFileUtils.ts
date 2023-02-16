export const Raid5 = {
    /**
     * Assumes a RAID-5 configuration with 3 data and 1 parity part.
     *
     * @param layer Index of the layer (i.e. row of a file part)
     *
     * @returns Index of the part that contains the parity data for the layer
     */
    getParityIndexForLayer(layer: number): number {
        return 3 - (layer % 4);
    },

    /**
     * Assumes a RAID-5 configuration with 3 data and 1 parity part.
     *
     * @param fileSize Total file size in bytes
     *
     * @returns An array of the 4 part sizes in bytes
     */
    getPartsSizes(fileSize: number): number[] {
        const size = fileSize / 3;
        const remainder = fileSize % 3;
        const [lower, upper] = [Math.floor(size), Math.ceil(size)];

        const parts = [
            remainder > 0 ? upper : lower,
            remainder > 1 ? upper : lower,
            lower,
        ];

        const lastParityIndex = Raid5.getParityIndexForLayer(lower);
        parts.splice(lastParityIndex, 0, upper);

        return parts;
    },

    computeParity(data: (number | null)[]): number {
        return data.map((d) => d ?? 0).reduce((acc, d) => acc ^ d, 0);
    },
};
