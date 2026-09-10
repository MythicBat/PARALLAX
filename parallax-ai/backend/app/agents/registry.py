from app.agents.specialists import (
    CareerAgent,
    ContrarianAgent,
    EvidenceAgent,
    FinancialAgent,
    OptimistAgent,
    PessimistAgent,
    RiskAgent,
)

AGENT_REGISTRY = {
    "optimist": OptimistAgent(),
    "pessimist": PessimistAgent(),
    "risk_analyst": RiskAgent(),
    "financial_analyst": FinancialAgent(),
    "evidence_auditor": EvidenceAgent(),
    "contrarian": ContrarianAgent(),
    "career_strategist": CareerAgent(),
}

DEFAULT_AGENT_TEAM = [
    "optimist",
    "pessimist",
    "risk",
    "evidence",
]