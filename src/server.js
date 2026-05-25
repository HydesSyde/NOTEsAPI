import app from "./app.js";
import http from "http";

const PORT = 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`server is live on http://localhost:${PORT}`);
});
