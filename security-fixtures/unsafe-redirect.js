// Intentionally insecure static-analysis fixture. Do not import into the app.

function redirectAfterLogin(response, nextUrl) {
  response.redirect(nextUrl);
}

module.exports = { redirectAfterLogin };