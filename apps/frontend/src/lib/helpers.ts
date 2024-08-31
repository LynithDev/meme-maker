export function sameKeys(obj1: any, obj2: any): boolean {
    if (obj1 === undefined || obj1 === null || obj2 === undefined || obj2 === null)
        return false;

    if (typeof obj1 !== "object" || typeof obj2 !== "object")
        return obj1 === obj2;

    return Object.keys(obj1).sort().join() === Object.keys(obj2).sort().join();
}

export function sameValues(obj1: any, obj2: any): boolean {
    if (obj1 === undefined || obj1 === null || obj2 === undefined || obj2 === null)
        return false;

    if (typeof obj1 !== "object" || typeof obj2 !== "object")
        return obj1 === obj2;

    return Object.values(obj1).sort().join() === Object.values(obj2).sort().join();
}
