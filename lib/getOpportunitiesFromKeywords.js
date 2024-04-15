import fetch from 'node-fetch';

export async function getOpportunitiesFromKeywords(keywords, limit) {
    const query = keywords.join(',');
    const url = `https://experts.ai/ai.unico.platform.rest/api/common/widgets/organizations/314353/opportunity/recombee?query=${query}&page=1&limit=${limit}`;

    try {

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.opportunityPreviewDtos;

    } catch (error) {
        console.error("Failed to fetch opportunities:", error);
        return [];
    }
}