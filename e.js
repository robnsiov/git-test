
const http = require("node:http");

const HOST = "127.0.0.1";
const PORT = 5050;
const API_KEY = "123";

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  // Only allow POST requests
  if (req.method !== "POST") {
    res.writeHead(405, { Allow: "POST" });
    return res.end(JSON.stringify({ error: "POST only" }));
  }

  // Validate API key
  if (req.headers["x-api-key"] !== API_KEY) {
    res.writeHead(401);
    return res.end(JSON.stringify({ error: "Invalid API key" }));
  }

  let body = "";
  let size = 0;
  const MAX_BODY_SIZE = 1024 * 1024; // 1 MB

  req.on("data", (chunk) => {
    size += chunk.length;

    if (size > MAX_BODY_SIZE) {
      res.writeHead(413);
      res.end(JSON.stringify({ error: "Body too large" }));
      req.destroy();
      return;
    }

    body += chunk.toString("utf8");
  });

  req.on("end", () => {
    console.log("Received POST body:");
    console.log(body);

    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      received: body
    }));
  });

  req.on("error", (err) => {
    console.error("Request error:", err.message);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
