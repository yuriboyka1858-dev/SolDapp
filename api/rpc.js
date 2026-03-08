module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, solana-client');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RPC_URL = process.env.HELIUS_RPC_URL;
  if (!RPC_URL) {
    console.error('HELIUS_RPC_URL env var not set');
    return res.status(500).json({ error: 'RPC not configured' });
  }

  try {
    const body = JSON.stringify(req.body);
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('RPC proxy error:', err.message);
    return res.status(502).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'RPC proxy error: ' + err.message },
      id: req.body?.id || null
    });
  }
};
