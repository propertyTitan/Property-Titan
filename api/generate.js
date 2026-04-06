var https = require("https");

module.exports = function(req, res) {
var prompt = req.body.prompt || "";
var images = req.body.images || [];

var content;
if (images.length > 0) {
content = [];
for (var i = 0; i < images.length; i++) {
var img = images[i];
content.push({
type: "image",
source: {
type: "base64",
media_type: img.media_type || "image/jpeg",
data: img.data
}
});
}
content.push({ type: "text", text: prompt });
} else {
content = prompt;
}

var body = JSON.stringify({
model: "claude-sonnet-4-20250514",
max_tokens: 2048,
messages: [{ role: "user", content: content }]
});

var options = {
hostname: "api.anthropic.com",
path: "/v1/messages",
method: "POST",
headers: {
"Content-Type": "application/json",
"Content-Length": Buffer.byteLength(body),
"x-api-key": process.env.ANTHROPIC_API_KEY,
"anthropic-version": "2023-06-01"
}
};

var r = https.request(options, function(response) {
var data = "";
response.on("data", function(chunk) { data += chunk; });
response.on("end", function() {
try {
var parsed = JSON.parse(data);
if (parsed.error) {
res.status(400).json({ error: parsed.error.message || "API error" });
return;
}
var text = parsed.content[0].text;
res.status(200).json({ text: text });
} catch(e) {
res.status(500).json({ error: e.message });
}
});
});

r.on("error", function(e) {
res.status(500).json({ error: e.message });
});

r.write(body);
r.end();
};
