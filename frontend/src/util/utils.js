export const compareObjects = (objA, objB) => {
    for (let p in objA) {
        if (objA[p] !== objB[p]) {
            return false;
        }
    }
    return true;
};