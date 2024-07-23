/**
 * @param {string} text
 */
export function isTextInEnglish(text) {
    return !/[čšřžýáíéůďťňóúČŠŘŽÝÁÍÉŮĎŤŇÓÚ]/.test(text);
}

export const validOpportunity = (opportunity, usingEnglishMode) => {
    return ! usingEnglishMode || (
        isTextInEnglish(opportunity.opportunityName) &&
        isTextInEnglish(shorten(opportunity.opportunityDescription, 100))
    );
};

export function shorten(text, num) {
    // Split the text into an array of words
    const words = text.split(/\s+/);

    // Slice the array to get the first 100 words
    const first100Words = words.slice(0, num);

    // Join the first 100 words back into a single string
    return first100Words.join(' ');
}
