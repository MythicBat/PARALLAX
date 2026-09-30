import type { SimulationResponse } from "@/store/parallax-store";
import type { DecisionRequest } from "./decision";

export interface DecisionHistoryItem {
    id: string;
    title: string;
    
    createdAt: string;
    updatedAt: string;
    question: string;
    optionNames: string[];
    preferredOption: string | null;
    confidence: string | number | null;
    simulation: SimulationResponse;
    request: DecisionRequest;
}