// api/generate.js
export default async function handler(req, res) {
  // CORS és Method check (opcionális, de ajánlott)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel serverless függvényeknél a req.body néha string, néha objektum
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { prompt } = body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620", // Figyelj a pontos modell névre!
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Az Anthropic válasz szerkezete: data.content[0].text
    return res.status(200).json({ text: data.content[0].text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
