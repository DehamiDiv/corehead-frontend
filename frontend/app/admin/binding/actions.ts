"use server";

const BASE_URL = 'http://localhost:5000/api';

export async function saveBindings(mode: string, selected: Record<string, boolean>) {
  try {
    const res = await fetch(`${BASE_URL}/bindings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, selected })
    });
    
    if (!res.ok) {
        throw new Error('Failed to save bindings');
    }
    
    return { success: true };
  } catch (error) {
    console.error("Failed to save bindings:", error);
    return { success: false, error: "Failed to save bindings" };
  }
}

export async function getBindings() {
  try {
    const res = await fetch(`${BASE_URL}/bindings`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch bindings');
    }
    return await res.json();
  } catch (error) {
    return null;
  }
}
