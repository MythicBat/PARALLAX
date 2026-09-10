const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface HealthResponse {
    status: string;
}

export async function getHealth(): Promise<HealthResponse> {
    const response = await fetch(
        `${API_BASE_URL}/health`,
        {
            cache: "no-store",
        },
    );

    if (!response.ok) {
        throw new Error("PARALLAX backend unavailable.");
    }

    return response.json();
}

export async function simulateDecision(payload: unknown) {
    const response = await fetch(`${API_BASE_URL}/decisions/simulate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const text = await response.text();

        throw new Error(text || `Simulation failed: ${response.status}`);
    }

    return response.json();
}