export type ScenarioType = 
    | "best_case"
    | "base_case"
    | "worst_case";

export type Direction = 
    | "strong_positive"
    | "positive"
    | "neutral"
    | "negative"
    | "strong_negative"
    | "uncertain";

export interface OutcomeDimension {
    name: string;
    direction: Direction;
    explanation: string;
}

export interface FutureScenario {
    id: string;
    option: string;
    scenario_type: ScenarioType;
    title: string;
    narrative: string;
    outcome_dimensions: OutcomeDimension[];
    key_drivers: string[];
    assumptions_required: string[];
    warning_signals: string[];

    reversibility: "low" | "medium" | "high";
    uncertainty: "low" | "medium" | "high";
    robustness_score: number;
}

export interface OptionSimulation {
    option: string;
    futures: FutureScenario[];
}

export interface FutureSimulationPayload {
    simulation: {
        simulations: OptionSimulation[];
    };

    inference: {
        tier: string;
        model: string;
        latency_ms: number;

        usage: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
        };
    };
}