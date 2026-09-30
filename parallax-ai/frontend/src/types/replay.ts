export interface ReplayDifference {
    type:
        | "preference"
        | "confidence"
        | "assumption"
        | "blind-spot"
        | "routing";
    
    label: string;
    before: string | null;
    after: string | null;
    changed: boolean;
}

export interface ReplayComparison {
    preferenceChanged: boolean;
    previousPreference: string | null;
    newPreference: string | null;
    previousConfidence: string | number | null;
    newConfidence: string | number | null;
    assumptionsAdded: string[];
    assumptionsRemoved: string[];
    blindSpotsAdded: string[];
    blindSpotsRemoved: string[];
    previousModelCalls: number;
    newModelCalls: number;
    previousTokens: number;
    newTokens: number; 
}