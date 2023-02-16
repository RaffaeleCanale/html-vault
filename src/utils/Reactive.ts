type Listener<T> = (newValue: T) => void;

export interface Reactive<T> {
    value(): T;
    set(value: T): void;
    subscribe(listener: Listener<T>): { stop(): void };
}

export function useReactive<T>(value: T): Reactive<T> {
    let listeners: Listener<T>[] = [];

    return {
        value() {
            return value;
        },

        set(newValue) {
            value = newValue;
            listeners.forEach((l) => l(newValue));
        },

        subscribe(listener) {
            listeners.push(listener);
            return {
                stop() {
                    listeners = listeners.filter((l) => l !== listener);
                },
            };
        },
    };
}

export interface ReactiveArray<T> extends Reactive<T[]> {
    append(item: T): void;
    remove(index: number): void;

    subscribeAppend(listener: Listener<T>): { stop(): void };
    subscribeRemove(listener: Listener<{ value: T; index: number }>): {
        stop(): void;
    };
}

export function useReactiveArray<T>(value: T[]): ReactiveArray<T> {
    let listeners: Listener<T[]>[] = [];
    let addListeners: Listener<T>[] = [];
    let removeListener: Listener<{ value: T; index: number }>[] = [];

    return {
        value() {
            return value;
        },

        set(newValue) {
            value = newValue;
            listeners.forEach((l) => l(newValue));
        },

        append(item) {
            value.push(item);
            listeners.forEach((l) => l(value));
            addListeners.forEach((l) => l(item));
        },

        remove(index: number) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const item = value[index]!;
            value.splice(index, 1);

            listeners.forEach((l) => l(value));
            removeListener.forEach((l) => l({ value: item, index }));
        },

        subscribe(listener) {
            listeners.push(listener);
            return {
                stop() {
                    listeners = listeners.filter((l) => l !== listener);
                },
            };
        },

        subscribeAppend(listener) {
            addListeners.push(listener);
            return {
                stop() {
                    addListeners = addListeners.filter((l) => l !== listener);
                },
            };
        },

        subscribeRemove(listener) {
            removeListener.push(listener);
            return {
                stop() {
                    removeListener = removeListener.filter(
                        (l) => l !== listener,
                    );
                },
            };
        },
    };
}
