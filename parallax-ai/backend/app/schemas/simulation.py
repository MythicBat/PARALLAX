from typing import Literal

from pydantic import BaseModel, Field


ConfidenceLevel = Literal[
    "low",
    "medium",
    "high",
]

ScenarioType = Literal[
    "best_case",
    "base_case",
    "worst_case",
]

EvidenceType = Literal[
    "known",
    "inferred",
    "assumed",
    "unknown",
]


class OutcomeDimension(BaseModel):
    name: str
    direction: Literal[
        "strong_positive",
        "positive",
        "neutral",
        "negative",
        "strong_negative",
        "uncertain",
    ]
    explanation: str


class FutureScenario(BaseModel):
    id: str
    option: str
    scenario_type: ScenarioType
    title: str

    narrative: str

    outcome_dimensions: list[OutcomeDimension]

    key_drivers: list[str]
    assumptions_required: list[str]
    warning_signals: list[str]

    reversibility: Literal[
        "low",
        "medium",
        "high",
    ]

    uncertainty: ConfidenceLevel

    robustness_score: float = Field(
        ge=0,
        le=100,
        description=(
            "Comparative PARALLAX scenario robustness score. "
            "Not a probability."
        ),
    )


class OptionSimulation(BaseModel):
    option: str
    futures: list[FutureScenario]


class SimulationResult(BaseModel):
    simulations: list[OptionSimulation]


class AssumptionItem(BaseModel):
    id: str
    statement: str
    category: EvidenceType

    source: str | None = None

    confidence: ConfidenceLevel

    impact: Literal[
        "low",
        "medium",
        "high",
        "critical",
    ]

    affected_options: list[str]

    validation_question: str | None = None


class AssumptionLedger(BaseModel):
    items: list[AssumptionItem]


class BlindSpot(BaseModel):
    id: str
    title: str
    explanation: str

    severity: Literal[
        "low",
        "medium",
        "high",
        "critical",
    ]

    affected_options: list[str]

    why_it_matters: str

    validation_action: str


class BlindSpotReport(BaseModel):
    blind_spots: list[BlindSpot]


class StressScenario(BaseModel):
    id: str
    name: str
    description: str

    severity: Literal[
        "moderate",
        "severe",
        "extreme",
    ]


class StressImpact(BaseModel):
    option: str
    scenario_id: str

    impact: Literal[
        "benefits",
        "minor_damage",
        "moderate_damage",
        "major_damage",
        "failure",
        "uncertain",
    ]

    explanation: str

    survives: bool


class StressTestResult(BaseModel):
    scenarios: list[StressScenario]
    impacts: list[StressImpact]

    most_resilient_option: str | None

    explanation: str


class CounterfactualCondition(BaseModel):
    variable: str
    required_change: str
    explanation: str


class CounterfactualResult(BaseModel):
    current_preference: str
    challenger: str

    conditions: list[CounterfactualCondition]

    plausible: bool

    summary: str


class InformationValueItem(BaseModel):
    question: str
    reason: str

    decision_impact: Literal[
        "low",
        "medium",
        "high",
        "critical",
    ]

    effort_to_obtain: Literal[
        "low",
        "medium",
        "high",
    ]

    affected_options: list[str]


class InformationValueResult(BaseModel):
    highest_value_question: str
    items: list[InformationValueItem]