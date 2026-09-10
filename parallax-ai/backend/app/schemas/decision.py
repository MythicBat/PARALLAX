from typing import Any
from pydantic import BaseModel, Field

class DecisionOption(BaseModel):
    name: str
    description: str | None = None

class DecisionCreateRequest(BaseModel):
    question: str
    options: list[DecisionOption] = Field(
        min_length=2,
        max_length=8,
    )

    goals: list[str] = []
    constraints: list[str] = []
    context: str | None = None

class DecisionFactor(BaseModel):
    name: str
    description: str
    importance: float
    reason: str

class DecisionArchitecture(BaseModel):
    title: str
    decision_type: str
    core_question: str
    factors: list[DecisionFactor]
    known_facts: list[str]
    assumptions: list[str]
    unknowns: list[str]
    potential_blind_spots: list[str]
    recommended_agents: list[str]
    simulation_dimensions: list[str]