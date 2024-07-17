import { getKeywordsChatGPT } from "./getKeywordsChatGPT.js";
import { getOpportunitiesFromKeywords } from "./getOpportunitiesFromKeywords.js";

/**
 * @param {string} text
 * @param {number} limit
 */
export async function getOpportunitiesInfoFromText(text, limit, page) {
    const { keywords, positions } = await getKeywordsChatGPT(text);
    const [opportunitiesByKeywords, opportunitiesByPositions] = await Promise.all([
        getOpportunitiesFromKeywords(keywords, limit, page),
        getOpportunitiesFromKeywords(positions, limit, page),
    ]);
    return { opportunitiesByKeywords, opportunitiesByPositions };
}