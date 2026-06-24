// tiny static server for the built spa. serves files from ./dist and falls
// back to index.html for client-side routes (/plan, /today, /progress).
// zero deps so it runs on the box with just node.

const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "dist");
const port = process.env.PORT || 8080;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

function send(res, file, code) {
  const ext = path.extname(file).toLowerCase();
  res.writeHead(code, { "content-type": types[ext] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  // strip query, keep it inside root
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  let file = path.join(root, url);
  if (!file.startsWith(root)) file = root; // no climbing out

  fs.stat(file, (err, stat) => {
    if (!err && stat.isFile()) return send(res, file, 200);
    if (!err && stat.isDirectory()) return send(res, path.join(file, "index.html"), 200);
    // unknown path -> let the spa router handle it
    send(res, path.join(root, "index.html"), 200);
  });
});

server.listen(port, () => console.log("tomoro up on :" + port));
