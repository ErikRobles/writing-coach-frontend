export const API_BASE_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:8080";

export interface PracticeResult {
  scores: {
    spelling: number;
    grammar: number;
    style: number;
    detected_style: string;
  };
  feedback: string;
  common_mistakes: string[];
  tips: string[];
}

export async function startPracticeSession(text: string): Promise<PracticeResult> {
  const token = localStorage.getItem('token');
  const url = new URL(`${API_BASE_URL}/practice`);
  url.searchParams.append('text', text);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) throw new Error('Failed to start practice session');
  return response.json();
}

export async function getPracticeHistory() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/user/me/practice-history`, {
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) throw new Error('Failed to fetch practice history');
  return response.json();
}

export async function analyzeText(text: string, onChunk: (chunk: string) => void) {
  try {
    // FastAPI expects the parameter as a query param based on the provided boilerplate.
    const url = new URL(`${API_BASE_URL}/analyze`);
    url.searchParams.append('text', text);

    const token = localStorage.getItem('token');

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Accept': 'text/event-stream',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) throw new Error("No response body from server");
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            const content = parsed.choices?.[0]?.delta?.content;
            if (typeof content === 'string') {
              onChunk(content);
            }
          } catch (e) {
            if (!(e instanceof SyntaxError)) {
              throw e;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in analyzeText', error);
    throw error;
  }
}

export async function upgradeTier(tier: string) {
  const token = localStorage.getItem('token');
  const url = new URL(`${API_BASE_URL}/user/me/upgrade`);
  url.searchParams.append('tier', tier);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to upgrade tier');
  }
  return response.json();
}

export async function getUserStats() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/user/me/stats`, {
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) throw new Error('Failed to fetch user stats');
return response.json();
}

export async function createPaypalOrder(tier: string) {
  const token = localStorage.getItem('token');
  const url = new URL(`${API_BASE_URL}/payments/paypal/create-order`);
  url.searchParams.append('tier', tier);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) throw new Error('Failed to create PayPal order');
  return response.json();
}

export async function capturePaypalOrder(orderID: string, tier: string) {
  const token = localStorage.getItem('token');
  const url = new URL(`${API_BASE_URL}/payments/paypal/capture-order`);
  url.searchParams.append('orderID', orderID);
  url.searchParams.append('tier', tier);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) throw new Error('Failed to capture PayPal order');
  return response.json();
}

export async function createMPPreference(tier: string) {
  const token = localStorage.getItem('token');
  const url = new URL(`${API_BASE_URL}/payments/mercadopago/create-preference`);
  url.searchParams.append('tier', tier);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) throw new Error('Failed to create Mercado Pago preference');
  return response.json();
}
