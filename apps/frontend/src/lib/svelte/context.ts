import { randomString } from "$lib/utils/helpers";
import { getContext, setContext } from "svelte";

export interface Context<T> {
    get: () => T;
    set: (ctx: T) => T;
}

function randomContextName() {
    return `$$context_${randomString()}`;
}

export function createContext<T>(key: any = randomContextName()): Context<T> {
    return {
        get: () => getContext<T>(key),
        set: (ctx: T) => setContext(key, ctx),
    };
}
