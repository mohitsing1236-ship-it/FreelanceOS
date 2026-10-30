export interface ReservationRequest {
  name: string;
  email: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm, 24-hour */
  time: string;
  guests: number;
  notes?: string;
}

export interface ReservationResult {
  reference: string;
}

/**
 * Sends a booking to your backend.
 *
 * Set VITE_RESERVATIONS_URL in a .env file (for example
 * VITE_RESERVATIONS_URL=https://your-api.example.com/reservations) and this
 * will POST the request as JSON and expect { "reference": "..." } back.
 *
 * Until then it simulates a successful booking so the form can be tried out.
 */
export async function submitReservation(
  request: ReservationRequest,
): Promise<ReservationResult> {
  const endpoint = import.meta.env.VITE_RESERVATIONS_URL as string | undefined;

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Reservation request failed with status ${response.status}`);
    }
    return (await response.json()) as ReservationResult;
  }

  await new Promise((resolve) => setTimeout(resolve, 700));
  return { reference: `TW-${Math.random().toString(36).slice(2, 7).toUpperCase()}` };
}
