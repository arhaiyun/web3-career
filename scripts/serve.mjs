import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const PORT = 4174;
const URL = `http://localhost:${PORT}/`;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const server = spawn("python3", ["-m", "http.server", String(PORT)], {
  cwd: root,
  stdio: "inherit",
});

function openBrowser() {
  const platform = process.platform;
  let cmd;
  let args;
  if (platform === "darwin") {
    cmd = "open";
    args = [URL];
  } else if (platform === "win32") {
    cmd = "cmd";
    args = ["/c", "start", "", URL];
  } else {
    cmd = "xdg-open";
    args = [URL];
  }
  spawn(cmd, args, { detached: true, stdio: "ignore" }).unref();
}

setTimeout(() => {
  openBrowser();
  console.log(`\n已在浏览器打开 ${URL}`);
}, 600);

function shutdown() {
  server.kill("SIGTERM");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

server.on("exit", (code) => process.exit(code ?? 0));
