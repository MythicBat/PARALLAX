export interface DecisionOption {
    name: string;
    description: string;
}

export interface DecisionRequest {
    question: string;
    options: DecisionOption[];
    goals: string[];
    constraints: string[];
    context?: string;
}