const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const app = next({ dev, hostname, port });
const { initialize, isEnabled } = require("unleash-client");

const handle = app.getRequestHandler();

initialize({
  url: " http://localhost:4242/api/",
  appName: "default",
  environment: "development",
  customHeaders: {
    Authorization: "default:development.unleash-insecure-api-token",
  },
});

app.prepare().then(() => {
  const server = express();

  console.log('isEnabled("toggleTeste1")', isEnabled("toggleTeste1"));

  // Unleash middleware
  server.use((req, res, nextCall) => {
    req.toggles = {
      toggleTeste1: isEnabled("toggleTeste1"),
    };
    nextCall();
  });

  server.get("*", (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
