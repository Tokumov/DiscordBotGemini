import { extractKeywordsFromText } from "./extractKeywordsFromText.js";
import { getOpportunitiesFromKeywords } from "./getOpportunitiesFromKeywords.js";

/**
 * @param {string} text
 * @param {number} limit
 */
export async function getOpportunitiesInfoFromText(text, limit) {
    const { keywords, positions } = await extractKeywordsFromText(text);
    const [opportunitiesByKeywords, opportunitiesByPositions] = await Promise.all([
        getOpportunitiesFromKeywords(keywords, limit),
        getOpportunitiesFromKeywords(positions, limit),
    ]);
    return { opportunitiesByKeywords, opportunitiesByPositions };
}