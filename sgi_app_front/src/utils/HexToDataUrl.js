function hexToBase64(hexString) {

    // Remove the '0x' prefix if present
    if (hexString.startsWith('0x')) {
        hexString = hexString.slice(2);
    }

    const binaryString = hexString.match(/.{1,2}/g).map(byte => {
        return String.fromCharCode(parseInt(byte, 16));
    }).join('');

    return btoa(binaryString);
}

export default function hexToDataURL(hexString) {
    const base64String = hexToBase64(hexString);
    return `data:image/png;base64,${base64String}`;
}