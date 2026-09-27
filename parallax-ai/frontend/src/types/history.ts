import type { SimulationResponse } from "@/store/parallax-store";

export interface DecisionHistoryItem {
    id: string;
    title: string;
    
    createdAt: string;
    updatedAt: string;
    question: string;
    optionNames: string[];
    preferredOptions: string | null;
    confidence: string | number | null;
    simulation: SimulationResponse;
}