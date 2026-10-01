// Usage: node set-server-url.js https://your-app.onrender.com
// Writes the URL into capacitor.config.json and syncs it into the Android project.
const fs = require("fs");
const { execSync } = require("child_process");
const url = (process.argv[2] || "").replace(/\/+$/, "");
if (!/^https:\/\/.+\..+/.test(url)) {
  console.error("Give your deployed server URL, starting with https://");
  process.exit(1);
}
const file = "capacitor.config.json";
const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
cfg.server = { ...cfg.server, url };
fs.writeFileSync(file, JSON.stringify(cfg, null, 2) + "\n");
console.log("Server URL set to", url);
execSync("npx cap sync android", { stdio: "inherit" });
console.log("Done. Open the android/ folder in Android Studio and build the APK.");
