module.exports = [
  {
    name: "AWS credential pattern",
    file: "config.js: module constants",
    source: String.raw`const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY";`,
  },
  {
    name: "Private key pattern",
    file: "keys.js: PEM declaration",
    source: String.raw`const PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----
<TRUNCATED PUBLIC TEST FIXTURE>
-----END RSA PRIVATE KEY-----";`,
  },
  {
    name: "Backdoor-like authentication branch",
    file: "routes/auth.js: login handler",
    source: String.raw`if (req.body.password === "backdoor_override_9921_supersecret") {
  return res.status(200).json({ token: "SUPER_ADMIN_JWT_TOKEN", role: "admin" });
}`,
  },
];