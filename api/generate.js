const https = require("https");

module.exports = function(req, res) {
  const body = JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: req.body.prompt }]
  });

  const options = {
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

  const r = https.request(options, function(response) {
    let data = "";
    response.on("data", function(chunk) { data += chunk; });
    response.on("end", function() {
      try {
        const parsed = JSON.parse(data);
        const text = parsed.content[0].text;
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
