// Intentionally insecure static-analysis fixture. Do not import into the app.

function acceptUpload(file) {
  return file.originalname.endsWith(".png");
}

module.exports = { acceptUpload };