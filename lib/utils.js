/**
 * @param {string} text
 */
export function inEnglish(text) {
    return !/[čšřžýáíéůďťňóúČŠŘŽÝÁÍÉŮĎŤŇÓÚ]/.test(text);
}