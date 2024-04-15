import { Client } from "discord.js";

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

declare function getOpportunitiesInfoFromText(text: string): Promise<Opportunity[]>;

declare function getOpportunitiesFromKeywords(keywords: string[]): Promise<Opportunity[]>;

declare function extractKeywordsFromText(text: string): Promise<string[]>;

declare function listenToDiscordBot(): void;