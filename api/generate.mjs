export default async function handler(req, res) {
const apiKey = process.env.ANTHROPIC_API_KEY;
const prompt = req.body.prompt;
const response = await fetch(“https://api.anthropic.com/v1/messages”, {
method: “POST”,
headers: {
“content-type”: “application/json”,
“x-api-key”: apiKey,
“anthropic-version”: “2023-06-01”
},
body: JSON.stringify({
model: “claude-sonnet-4-20250514”,
max_tokens: 1024,
messages: [{ role: “user”, content: prompt }]
})
});
const data = await response.json();
const text = data.content.filter(b => b.type === “text”).map(b => b.text).join(””);
res.status(200).json({ text });
}
