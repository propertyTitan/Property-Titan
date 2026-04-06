export default async function handler(req, res) {
if (req.method !== ‘POST’) {
return res.status(405).json({error: ‘Method not allowed’});
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
return res.status(500).json({error: ‘API key not configured’});
}

try {
const {prompt} = req.body;
if (!prompt) {
return res.status(400).json({error: ‘No prompt provided’});
}

```
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{role: 'user', content: prompt}]
  })
});

if (!response.ok) {
  const err = await response.json();
  return res.status(response.status).json({error: err.error?.message || 'API error'});
}

const data = await response.json();
const text = (data.content || [])
  .filter(b => b.type === 'text')
  .map(b => b.text)
  .join('') || '';

return res.status(200).json({text});
```

} catch (e) {
return res.status(500).json({error: e.message});
}
}
