// Intentionally insecure static-analysis fixture. Do not import into the app.

function findUser(db, userInput) {
  const query = "SELECT * FROM users WHERE name = '" + userInput + "'";
  return db.get(query);
}

function renderGreeting(response, displayName) {
  response.send("<h1>Hello " + displayName + "</h1>");
}

function resolveDownload(path, fileName) {
  return path.join("/srv/shop/uploads", fileName);
}

function createToken(jwt, user) {
  return jwt.sign({ id: user.id }, "shopkart-secret");
}

const suspiciousIndicators = {
  collectionUrl: "https://example.invalid/collect",
  encodedCommand: "<base64-encoded-command-placeholder>",
};

module.exports = {
  findUser,
  renderGreeting,
  resolveDownload,
  createToken,
  suspiciousIndicators,
};