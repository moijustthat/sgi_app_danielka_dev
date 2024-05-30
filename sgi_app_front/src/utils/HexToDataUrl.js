export function base64(string) {
    return `data:image/jpeg;base64,${string}`
}

export function hexToBase64(hexString) {

    // Remove the '0x' prefix if present
    if (hexString.startsWith('0x')) {
        hexString = hexString.slice(2);
    }

    const binaryString = hexString.match(/.{1,2}/g).map(byte => {
        return String.fromCharCode(parseInt(byte, 16));
    }).join('');

    return btoa(binaryString);
}

export function base64ToHex(base64) {
    const raw = atob(base64);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex); // Asegura que cada byte sea representado por dos dígitos
    }
    return result.toUpperCase();
}

export function isHex(img) {
    return /^0x[0-9A-Fa-f]+$/.test(img)
}

export default function hexToDataURL(hexString) {
    if (!hexString) hexString = ''
    const base64String = hexToBase64(hexString);
    return `data:image/png;base64,${base64String}`;
}