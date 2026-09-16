export type ModelTier = 
    | "lighting"
    | "super"
    | "nano"
    | "ultra"
    | "unknown";

export type AgentStatus = 
    | "queued"
    | "running"
    | "complete"
    | "failed";

export interface TokenUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

export interface InferenceTrace {
    id: string;
    agent: string;
    role: string;
    stage: string;

    tier: ModelTier;
    model: string;
    latency_ms: number;
    usage: TokenUsage;
    status: AgentStatus;

    escalated: boolean;
    escalation_reason?: string | null;
}

export interface ObservatorySummary {
    total_calls: number;
    total_tokens: number;
    total_latency_ms: number;

    lighting_calls: number;
    nano_calls: number;
    super_calls: number;
    ultra_calls: number;

    escalation_count: number;
}

export interface ObservatoryPayload {
    provider: string;
    traces: InferenceTrace[];
    summary: ObservatorySummary;
}