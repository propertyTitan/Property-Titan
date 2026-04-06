export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { prompt, images } = await req.json();

  var content;
  if (images && images.length > 0) {
    content = [];
    for (var i = 0; i < images.length; i++) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: images[i].media_type || "image/jpeg",
          data: images[i].data
        }
      });
    }
    content.push({ type: "text", text: prompt });
  } else {
    content = prompt;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: content }]
    })
  });

  const data = await response.json();

  if (data.error) {
    return new Response(JSON.stringify({ error: data.error.message || "API error" }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }

  const text = data.content[0].text;

  return new Response(JSON.stringify({ text }), {
    headers: { "content-type": "application/json" }
  });
}
