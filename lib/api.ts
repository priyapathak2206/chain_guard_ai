const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export async function getShipments() {
  const response = await fetch(`${API_URL}/shipments`);

  if (!response.ok) {
    throw new Error("Failed to fetch shipments");
  }

  return response.json();
}

export async function getShipment(shipmentId: string) {
  const response = await fetch(
    `${API_URL}/shipments/${shipmentId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shipment");
  }

  return response.json();
}

export async function getFleet() {
  const response = await fetch(`${API_URL}/fleet`)

  if (!response.ok) {
    throw new Error('Failed to fetch fleet')
  }

  return response.json()
}

export async function getDisruptions() {
  const response = await fetch(`${API_URL}/disruptions`)

  if (!response.ok) {
    throw new Error('Failed to fetch disruptions')
  }

  return response.json()
}

export async function getColdChain() {
  const response = await fetch(`${API_URL}/cold-chain`)

  if (!response.ok) {
    throw new Error('Failed to fetch cold-chain data')
  }

  return response.json()
}

export async function getDashboard() {
  const response = await fetch(`${API_URL}/dashboard`)

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard')
  }

  return response.json()
}

export async function rerouteShipment(
  shipmentId: string,
  newRoute: string
) {
  const response = await fetch(`${API_URL}/recommendations/reroute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      shipmentId,
      newRoute,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to reroute shipment')
  }

  return response.json()
}