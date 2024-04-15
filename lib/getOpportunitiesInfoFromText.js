import { extractKeywordsFromText } from "./extractKeywordsFromText.js";
import { getOpportunitiesFromKeywords } from "./getOpportunitiesFromKeywords.js";

/**
 * @param {import(".").Opportunity} opportunity
 * @return {string}
 */
function format(opportunity) {
    const organizationName = opportunity.organizationBaseDtos
        .map((org) => org.organizationName)
        .join(" ");

    return `${opportunity.opportunityName} (${organizationName.trim()})\n` +
        `${opportunity.opportunityDescription ? opportunity.opportunityDescription.slice(0, 100) + "\n" : ""}` +
        (opportunity.opportunityTechReq + "\n" || "") +
        (opportunity.opportunityExtLink ? `More info: ${opportunity.opportunityExtLink}\n` : "");
}

/**
 * @param {string} text
 */
export async function getOpportunitiesInfoFromText(text) {
    const keywords = await extractKeywordsFromText(text);
    const opportunities = await getOpportunitiesFromKeywords(keywords);
    return opportunities.map(format);
}