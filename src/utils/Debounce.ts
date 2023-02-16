export async function debounced<R>(
    promise: Promise<R>,
    waitTime: number,
): Promise<R> {
    const result = await Promise.allSettled([
        promise,
        // Minimal wait time
        new Promise((resolve) => setTimeout(resolve, waitTime)),
    ]);
    if (result[0].status === 'rejected') {
        throw result[0].reason;
    }
    return result[0].value;
}
