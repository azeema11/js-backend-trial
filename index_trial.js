console.log("Hello from Node!");

import { writeFile, readFile } from "fs/promises";

async function run() {
  await writeFile("greeting.txt", "Hello from Node.js!");
  const content = await readFile("greeting.txt", "utf-8");
  console.log(content); // → Hello from Node.js!
}

run();

import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from a Node server!");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});