const http = require("http");
http.createServer((req, res) => {
  res.end("Web Docker is running!");
}).listen(4000, () => console.log("Listening on 4000"));
