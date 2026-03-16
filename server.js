/**
 * Simple HTTP server for the DORA Major Incident Assessment Tool
 *
 * This script creates a local HTTP server to serve the tool's files.
 * It automatically finds an available port if the default port is in use.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

// Default port to try
let port = 8080;

// Create server
const server = http.createServer((req, res) => {
  // Get the file path and prevent path traversal
  let filePath = "." + req.url;
  if (filePath === "./") {
    filePath = "./index.html";
  }
  filePath = path.normalize(filePath);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve("."))) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  // Get the file extension
  const extname = path.extname(filePath);
  let contentType = "text/html";

  // Set the content type based on the file extension
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // File not found
        fs.readFile("./404.html", (err404, content404) => {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(content404 || "<h1>404 - Not Found</h1>", "utf-8");
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end("Internal Server Error");
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

// Function to try starting the server on a specific port
function tryStartServer(port) {
  server
    .listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
      console.log("Press Ctrl+C to stop the server");
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        tryStartServer(port + 1);
      } else {
        console.error("Server error:", err);
      }
    });
}

// Start the server
tryStartServer(port);
