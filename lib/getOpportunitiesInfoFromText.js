import { extractKeywordsFromText } from "./extractKeywordsFromText.js";
import { getOpportunitiesFromKeywords } from "./getOpportunitiesFromKeywords.js";

/**
 * @param {import(".").Opportunity} opportunity
 * @return {string[]}
 */
function format(opportunity) {
    const organizationName = opportunity.organizationBaseDtos
        .map((org) => org.organizationName)
        .join(" ");
    return [`${opportunity.opportunityName} (${organizationName.trim()})\n`,
    `${opportunity.opportunityDescription ? opportunity.opportunityDescription.slice(0, 100) : ""}`,
    opportunity.opportunityTechReq,
    (opportunity.opportunityExtLink ? `More info: ${opportunity.opportunityExtLink}` : "")];
}

/**
 * @param {string} text
 */
export async function getOpportunitiesInfoFromText(text, limit) {
    const { keywords, positions } = await extractKeywordsFromText(text);
    const [opportunitiesByKeywords, opportunitiesByPositions] = await Promise.all([
        getOpportunitiesFromKeywords(keywords, limit),
        getOpportunitiesFromKeywords(positions, limit),
    ]);
    return { opportunitiesByKeywords, opportunitiesByPositions };
}