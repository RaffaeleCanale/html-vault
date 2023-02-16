import { useAnimatedLabel } from '../../../components/atoms/AnimatedLabel';
import { useFilesPicker } from '../../../components/organisms/FilesPicker';

export function useFilesSlide() {
    useAnimatedLabel('choose-files');

    return useFilesPicker('file-picker');
}
