import { OpenAI } from "openai";

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

declare function getOpportunitiesInfoFromText(text: string, limit: number): Promise<Opportunity[]>;

declare function getOpportunitiesFromKeywords(keywords: string[], limit: number): Promise<Opportunity[]>;

declare function getOpportunitiesFromKeywords(text: string): Promise<string[]>;

declare function initOpenAI(): void;

declare function listenToDiscordBot(): void;

declare function handleButtons(interaction, client): void;

declare function jobSearch(channel, client): void;  //Add types