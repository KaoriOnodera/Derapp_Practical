const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

// デバッグ: ファイル構造を確認
console.log("=== DEBUG: Current directory ===");
console.log("__dirname:", __dirname);
console.log("process.cwd():", process.cwd());
console.log("\n=== Files in current directory ===");
try {
  const files = fs.readdirSync(process.cwd());
  console.log(files);
} catch (e) {
  console.error("Cannot read directory:", e.message);
}
console.log("\n=== Files in __dirname ===");
try {
  const files = fs.readdirSync(__dirname);
  console.log(files);
} catch (e) {
  console.error("Cannot read directory:", e.message);
}
console.log("\n=== Check .next directory ===");
const nextDir = path.join(__dirname, ".next");
console.log(".next path:", nextDir);
console.log(".next exists:", fs.existsSync(nextDir));
if (fs.existsSync(__dirname)) {
  const dirFiles = fs.readdirSync(__dirname);
  console.log("Files in __dirname:", dirFiles);
}
console.log("================================\n");

// .next ディレクトリの場所を明示的に指定
const app = next({
  dev,
  hostname,
  port,
  dir: __dirname, // ← 追加
  conf: {
    distDir: ".next", // ← 追加
  },
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
