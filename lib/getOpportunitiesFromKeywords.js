export async function getOpportunitiesFromKeywords(keywords, limit, page = 1) {
    if (keywords.length === 0) {
        return [];
    }

    // Encode each keyword and join them with commas
    const query = keywords.map(encodeURIComponent).join(',');

    // Construct URL with encoded parameters
    const url = `https://experts.ai/ai.unico.platform.rest/api/common/widgets/organizations/314353/opportunity/recombee?query=${query}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`;

    console.log(`Fetching opportunities from: ${url}`);

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status} ${data}`);
            return [];
        }
        return data.opportunityPreviewDtos;
    } catch (error) {
        console.error("Failed to fetch opportunities:", error);
        return [];
    }
}