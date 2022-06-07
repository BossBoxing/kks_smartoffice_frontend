const PROXY_CONFIG = {
  "/api": {
    target: "https://localhost:5001",
    secure: false,
    "changeOrigin": true,
    "logLevel": "warn"
  }
};
module.exports = PROXY_CONFIG;
