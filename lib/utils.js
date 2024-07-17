/**
 * @param {string} text
 */
export function isTextInEnglish(text) {
    return !/[čšřžýáíéůďťňóúČŠŘŽÝÁÍÉŮĎŤŇÓÚ]/.test(text);
}