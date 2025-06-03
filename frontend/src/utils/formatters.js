/**
 * Formats the trading volume.
 * @param {number|null|undefined} volume - The trading volume.
 * @returns {string} - The formatted volume string.
 */
export function formatVolume(volume) {
    if (volume === null || volume === undefined || isNaN(parseFloat(volume))) {
        return 'N/A';
    }

    const numVolume = parseFloat(volume);

    if (numVolume >= 1000000000) {
        return `$${Math.round(numVolume / 1000000000)} млрд`;
    } else if (numVolume >= 1000000) {
        return `$${Math.round(numVolume / 1000000)} млн`;
    } else {
        return `$${numVolume.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
}
