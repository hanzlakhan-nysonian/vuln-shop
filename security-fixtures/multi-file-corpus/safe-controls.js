module.exports = [
  {
    name: "Public test API key",
    file: "config.js: test configuration",
    source: String.raw`const STRIPE_TEST_KEY = "pk_test_51Mz...EXAMPLE1234567890";`,
  },
  {
    name: "Base64 image data",
    file: "public/styles.js: embedded logo",
    source: String.raw`const LOGO_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGJg==";`,
  },
];