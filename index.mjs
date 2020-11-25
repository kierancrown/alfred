import express from "express";
import ip from "ip";
import * as path from "path";
import { log } from "./utils/logger.mjs";
import { initController as initHueController } from "./controllers/hueController.mjs";
import config from "./constants.mjs";

const app = express();
const controllers = [];

app.get("/", function (req, res) {
  res.redirect("/status");
});

app.get("/style.css", (req, res) => {
  res.sendFile(path.join(path.resolve(), "web/style.css"));
});

app.get("/status", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({
    status: "Online",
    serverIP: ip.address(),
    controllers,
  });
});

log("Starting Alfred server...");
app.listen(config.SERVER_PORT, () => {
  log(`Alfred server is running on port ${config.SERVER_PORT}`);
  const initAlfred = async () => {
    controllers.push(await initHueController(app));
    log("Successfully initialised Alfred!");
  };

  initAlfred();
});
