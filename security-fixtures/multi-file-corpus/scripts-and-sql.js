module.exports = [
  {
    name: "Ordinary build lifecycle hook",
    file: "package.json: scripts.postinstall",
    source: String.raw`{
  "scripts": {
    "postinstall": "node ./scripts/build-native.js"
  }
}`,
  },
  {
    name: "SQL string concatenation",
    file: "routes/users.js: query construction",
    source: String.raw`const query = "SELECT * FROM users WHERE id = '" + req.query.id + "'";
db.query(query, (err, result) => res.json(result));`,
  },
];