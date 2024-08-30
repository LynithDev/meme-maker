export function sameKeys(obj1: Record<string, any> | undefined | null, obj2: Record<string, any> | undefined | null): boolean {
    if (obj1 === undefined || obj1 === null || obj2 === undefined || obj2 === null)
        return false;
    return Object.keys(obj1).sort().join() === Object.keys(obj2).sort().join();
}

export function sameValues(obj1: Record<string, any> | undefined | null, obj2: Record<string, any> | undefined | null): boolean {
    if (obj1 === undefined || obj1 === null || obj2 === undefined || obj2 === null)
        return false;
    return Object.values(obj1).sort().join() === Object.values(obj2).sort().join();
}
