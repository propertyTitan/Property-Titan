var https = require(“https”);

module.exports = function(req, res) {
var apiKey = process.env.ANTHROPIC_API_KEY;
var body = JSON.stringify({
model: “claude-sonnet-4-20250514”,
max_tokens: 1024,
messages: [{ role: “user”, content: req.body.prompt }]
});

var options = {
hostname: “api.anthropic.com”,
path: “/v1/messages”,
method: “POST”,
headers: {
“Content-Type”: “application/json”,
“Content-Length”: Buffer.byteLength(body),
“x-api-key”: apiKey,
“anthropic-version”: “2023-06-01”
}
};

var request = https.request(options, function(response) {
var data = “”;
response.on(“data”, function(chunk) { data += chunk; });
response.on(“end”, function() {
try {
var parsed = JSON.parse(data);
var text = “”;
if (parsed.content) {
for (var i = 0; i < parsed.content.length; i++) {
if (parsed.content[i].type === “text”) {
text += parsed.content[i].text;
}
}
}
res.status(200).json({ text: text });
} catch(e) {
res.status(500).json({ error: e.message });
}
});
});

request.on(“error”, function(e) {
res.status(500).json({ error: e.message });
});

request.write(body);
request.end();
};
