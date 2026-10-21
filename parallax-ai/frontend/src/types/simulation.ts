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

/*Assumption, blind spots, and stress tests types*/
export type EvidenceCategory =
  | "known"
  | "inferred"
  | "assumed"
  | "unknown";

export interface AssumptionItem {
  id: string;
  statement: string;
  category: EvidenceCategory;
  source: string | null;
  confidence:
    | "low"
    | "medium"
    | "high";
  impact:
    | "low"
    | "medium"
    | "high"
    | "critical";
  affected_options: string[];
  validation_question: string | null;
}

export interface AssumptionLedgerPayload {
  ledger: {
    items: AssumptionItem[];
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

export interface BlindSpot {
  id: string;
  title: string;
  explanation: string;
  severity:
    | "low"
    | "medium"
    | "high"
    | "critical";
  affected_options: string[];
  why_it_matters: string;
  validation_action: string;
}

export interface BlindSpotPayload {
  report: {
    blind_spots: BlindSpot[];
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

export interface StressScenario {
  id: string;
  name: string;
  description: string;
  severity:
    | "moderate"
    | "severe"
    | "extreme";
}

export interface StressImpact {
  option: string;
  scenario_id: string;

  impact:
    | "benefits"
    | "neutral"
    | "minor_damage"
    | "moderate_damage"
    | "major_damage"
    | "failure"
    | "uncertain";

  explanation: string;

  survives: boolean;
}

export interface StressTestPayload {
  stress_test: {
    scenarios: StressScenario[];
    impacts: StressImpact[];
    most_resilient_option:
      | string
      | null;
    explanation: string;
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

/** Counter-factual, Information, AI Jury */
export interface CounterfactualCondition {
  variable: string;
  required_change: string;
  explanation: string;
}

export interface CounterfactualPayload {
  counterfactual: {
    current_preference: string;
    challenger: string;
    conditions: CounterfactualCondition[];
    plausible: boolean;
    summary: string;
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


export interface InformationItem {
  question: string;
  reason: string;

  decision_impact:
    | "low"
    | "medium"
    | "high"
    | "critical";

  effort_to_obtain:
    | "low"
    | "medium"
    | "high";

  affected_options: string[];
}

export interface InformationValuePayload {
  information_value: {
    items: InformationItem[];
    highest_value_question: string
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


export interface JuryVote {
  agent: string;
  preferred_option: string;
  confidence: number;
  rationale: string;
  strongest_argument: string;
  biggest_concern: string;
}

export interface JuryPayload {
  jury: {
    votes: JuryVote[];

    consensus_option:
      | string
      | null;

    agreement_score: number;

    disagreement_summary: string;

    minority_report:
      | string
      | null;
  };

  inference?: {
    tier: string;
    model: string;
    latency_ms: number;

    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}

/* Custom targeted stress testing */

export interface CustomStressObservatory {
  provider: string;

  traces: unknown[];

  summary: {
    total_calls: number;
    total_tokens: number;
    total_latency_ms: number;

    lightning_calls: number;
    nano_calls: number;
    super_calls: number;
    ultra_calls: number;

    escalation_count: number;

    simulation_duration_ms?: number;
  };
}

export interface CustomStressResponse {
  result: StressTestPayload;

  observatory?: CustomStressObservatory;
}