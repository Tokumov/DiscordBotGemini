import { Interaction, Client, Channel } from "discord.js"

export interface Opportunity {
    opportunityId: string
    opportunityName: string
    opportunityDescription: string
    opportunityKw: string[]
    opportunitySignupDate: number
    opportunityLocation: string
    opportunityWage: string
    opportunityTechReq: string
    opportunityFormReq: string
    opportunityOtherReq: string
    opportunityBenefit: string
    opportunityJobStartDate: number
    opportunityExtLink: string
    opportunityHomeOffice: string
    hidden: boolean
    opportunityType: number
    jobTypes: number[]
    expertPreviews: any[]
    organizationBaseDtos: OrganizationBaseDto[]
}

export interface OrganizationBaseDto {
    organizationId: number
    organizationName: string
    organizationAbbrev: any
    visible: boolean
    active: boolean
}

export interface SessionData {
    isEnglish: boolean;
    currentPage: number;
    hasStarted: boolean;
}

export let sessionsData: Map<number, SessionData>;


declare function getOpportunitiesInfoFromText(text: string, limit: number, page: number): Promise<{
    opportunitiesByKeywords: Opportunity[],
    opportunitiesByPositions: Opportunity[]
}>;

declare function getOpportunitiesFromKeywords(keywords: string[], limit: number, page: number): Promise<Opportunity[]>;

declare function getOpportunitiesFromKeywords(text: string): Promise<string[]>;

declare function initOpenAI(): void;

declare function listenToDiscordBot(): void;

declare function handleButtons(interaction: Interaction, client: Client): Promise<unknown>;

declare function jobSearch(channel: Channel, client: Client): void;
