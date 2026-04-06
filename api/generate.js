export default async function handler(req, res) {
const response = await fetch(“https://api.anthropic.com/v1/messages”, {
method: “POST”,
headers: {
“content-type”: “application/json”,
“x-api-key”: process.env.ANTHROPIC_API_KEY,
“anthropic-version”: “2023-06-01”
},
body: JSON.stringify({
model: “claude-sonnet-4-20250514”,
max_tokens: 1024,
messages: [{ role: “user”, content: req.body.prompt }]
})
});
const data = await response.json();
const text = data.content[0].text;
res.json({ text });
}
