import { getKeywordsChatGPT } from "./getKeywordsChatGPT.js";
import { getOpportunitiesFromKeywords } from "./getOpportunitiesFromKeywords.js";

/**
 * @param {string} text
 * @param {number} limit
 */
export async function getOpportunitiesInfoFromText(text, limit, page) {
    const { keywords } = await getKeywordsChatGPT(text);

    const [opportunitiesByKeywords] = await Promise.all([
        getOpportunitiesFromKeywords(keywords, limit, page)
    ]);
    return { opportunitiesByKeywords, keywords };
}