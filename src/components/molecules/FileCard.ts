import { FileData, formatBytes } from '../../utils/FileUtils';
import DeleteIcon from '../icons/DeleteIcon.svg';
import UploadIcon from '../icons/UploadIcon.svg';

interface Props {
    name: string;
    size: number;
    onClick?: (event: MouseEvent) => void;
    suffix?: HTMLElement;
    onSuffixClick?: (event: MouseEvent) => void;
}

export function renderClosableFileCard(
    file: File,
    onSuffixClick: VoidFunction,
) {
    const suffix = document.createElement('div');
    // suffix.setAttribute('href', downloadUrl);
    // suffix.setAttribute('download', file.name);
    suffix.innerHTML = DeleteIcon;

    return renderFileCard({
        name: file.name,
        size: file.size,
        suffix: suffix.firstChild as HTMLElement,
        onSuffixClick,
    });
}

export function renderDownloadFileCard(
    file: FileData,
    onClick?: VoidFunction,
): HTMLElement {
    const blob = new Blob([file.data], { type: file.type });
    const downloadUrl = URL.createObjectURL(blob);

    const suffix = document.createElement('a');
    suffix.setAttribute('href', downloadUrl);
    suffix.setAttribute('download', file.name);
    suffix.innerHTML = UploadIcon;

    return renderFileCard({
        name: file.name,
        size: blob.size,
        onClick() {
            if (onClick) {
                return onClick();
            }
            suffix.click();
        },
        suffix,
    });
}

function renderFileCard({
    name,
    size,
    onClick,
    suffix,
    onSuffixClick,
}: Props): HTMLElement {
    loadCssIfNeeded();

    const card = document.createElement('div');
    card.classList.add('file-card', '--dark');

    const details = document.createElement('div');
    details.classList.add('file-card__details');
    if (onClick) {
        details.classList.add('--clickable');
        details.addEventListener('click', onClick);
    }
    details.appendChild(document.createElement('h3')).textContent = name;
    details.appendChild(document.createElement('span')).textContent =
        formatBytes(size);
    card.appendChild(details);

    if (suffix !== undefined) {
        const suffixEl = document.createElement('div');
        suffixEl.classList.add('file-card__suffix', '--clickable');
        if (onSuffixClick) {
            suffixEl.addEventListener('click', onSuffixClick);
        }

        suffixEl.appendChild(suffix);
        card.appendChild(suffixEl);
    }

    return card;
}

let cssLoaded = false;
function loadCssIfNeeded(): void {
    if (cssLoaded) {
        return;
    }
    cssLoaded = true;

    const style = document.createElement('style');
    // TODO Limit width of file name
    style.innerHTML = `
.file-card h3 {
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.file-card {
    display: flex;
    flex-direction: row;
    background-color: var(--background-color);
    color: var(--font-color);
    animation: appear 0.3s ease-in-out;
    height: 5rem;
    max-width: 100%;
}

.--disappear {
    animation: disappear 0.3s ease-in-out forwards;
}

.file-card__details {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 0.2rem;
    padding: 1rem;

    overflow: hidden;
    white-space: nowrap;
}

.file-card__suffix {
    padding: 1rem;
    display: flex;
    align-items: center;
}

@keyframes disappear {
    0% {
        opacity: 1;
        height: 5rem;
        transform: scale(1);
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 0;
        height: 0;
        transform: scale(0);
    }
}

@keyframes appear {
    0% {
        opacity: 0;
        height: 0;
        transform: scale(0);
    }
    100% {
        opacity: 1;
        height: 5rem;
        transform: scale(1);
    }
}
`;

    document.getElementsByTagName('head')[0]?.appendChild(style);
}
