export async function fetchTemplate(): Promise<string> {
    const response = await fetch('/vault-template');

    if (!response.ok) {
        throw new Error('Failed to fetch template');
    }

    return response.text();
}
