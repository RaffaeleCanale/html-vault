import { useDataReader, useDataWriter } from '../buffer/DataReader';
import { Raid5 } from './SplitFileUtils';

export function useLayeredReader(input: ArrayBuffer) {
    const reader = useDataReader(input);

    let currentLayer = 0;

    return {
        hasMore() {
            return reader.hasMore();
        },

        readLayer(): (number | null)[] {
            if (!this.hasMore()) {
                throw new Error('No more data');
            }

            const data = [reader.read(), reader.read(), reader.read()];

            const parity = Raid5.computeParity(data);
            const parityIndex = Raid5.getParityIndexForLayer(currentLayer);

            data.splice(parityIndex, 0, parity);

            currentLayer += 1;

            return data;
        },
    };
}

export function useLayeredWriter(size: number) {
    const writer = useDataWriter(size);

    let currentLayer = 0;

    return {
        writeLayer(layer: (number | null)[], missingIndex: number): void {
            const parity = Raid5.computeParity(
                layer.filter((_, i) => i !== missingIndex),
            );
            const parityIndex = Raid5.getParityIndexForLayer(currentLayer);

            layer[missingIndex] = parity;

            layer.forEach((value, index) => {
                if (
                    index !== parityIndex &&
                    value !== null &&
                    writer.hasMore()
                ) {
                    writer.write(value);
                }
            });

            currentLayer += 1;
        },

        // eslint-disable-next-line @typescript-eslint/unbound-method
        getData: writer.getData,
    };
}
