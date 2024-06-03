export function isJSON(str) {
    if (typeof str !== 'string') {
        return false;
    }
    try {
        const obj = JSON.parse(str);
        return obj && typeof obj === 'object' && !Array.isArray(obj);
    } catch (e) {
        return false;
    }
}

export function isObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}