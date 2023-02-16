import type { UploadedFile } from '../../utils/FileUtils';
import type { FilePickerId } from '../atoms/FilePicker';
import { useCardsList } from '../molecules/CardsList';
import { useDragAndDropContainer } from '../molecules/DragAndDropContainer';
import { renderClosableFileCard } from '../molecules/FileCard';

export function useFilesPicker(id: FilePickerId) {
    const list = useCardsList(`${id}-list`);
    const picker = useDragAndDropContainer(id);

    let filesList: UploadedFile[] = [];

    picker.onChange((files) => {
        for (let i = 0; i < files.length; i += 1) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const file = files.item(i)!;

            const uploadedFile: UploadedFile = {
                name: file.name,
                type: file.type,
                data: file.arrayBuffer(),
            };
            const card = renderClosableFileCard(file, () => {
                list.removeCard(card);
                filesList = filesList.filter((f) => f !== uploadedFile);
            });

            list.addCard(card);
            filesList.push(uploadedFile);
        }

        // const cards = [...files].map((file) => {
        //     const card = renderClosableFileCard(file, () => {
        //         list.removeCard(card);
        //     });
        //     return card;
        // });

        // list.setCards(cards);

        // filesList = [...files].map((file) => ({
        //     name: file.name,
        //     type: file.type,
        //     data: file.arrayBuffer(),
        // }));
    });

    return {
        getFiles() {
            return filesList;
        },
    };
}
