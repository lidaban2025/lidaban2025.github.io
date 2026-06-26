export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const mode = safeText(payload.mode, 20);
    const platform = safeText(payload.platform, 30) || 'Google Sheets';
    const formula = safeText(payload.formula, 4000);
    const context = safeText(payload.context, 4000);

    if (!['fix', 'explain', 'generate'].includes(mode)) {
      return json({ error: 'Invalid mode' }, 400);
    }

    if (!formula && !context) {
      return json({ error: 'Formula or context is required' }, 400);
    }

    if (!env.OPENAI_API_KEY) {
      return json({ error: 'OPENAI_API_KEY is not configured' }, 500);
    }

    const system = [
      'You are a careful spreadsheet formula assistant.',
      'Return concise, practical help for Google Sheets or Excel.',
      'Never claim you accessed the user spreadsheet.',
      'Always include a copy-ready formula when fixing or generating.',
      'Call out assumptions and test-on-copy warnings.',
      'Do not invent unavailable columns; ask the user to adapt ranges when needed.'
    ].join(' ');

    const user = [
      `Mode: ${mode}`,
      `Platform: ${platform}`,
      formula ? `Formula: ${formula}` : '',
      context ? `Context: ${context}` : '',
      'Format the answer with these labels when relevant: Formula, Explanation, Assumptions, Test notes.'
    ].filter(Boolean).join('\n');

    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 700,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });

    if (!upstream.ok) {
      const body = await upstream.text();
      return json({ error: 'AI provider error', detail: body.slice(0, 500) }, 502);
    }

    const data = await upstream.json();
    const result = data?.choices?.[0]?.message?.content?.trim();
    if (!result) {
      return json({ error: 'AI provider returned no result' }, 502);
    }

    return json({ result });
  }
};

function safeText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders()
    }
  });
}
