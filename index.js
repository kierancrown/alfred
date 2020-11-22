import express from "express";
import ip from "ip";
import { log } from "./utils/logger.mjs";
import { initController as initHueController } from "./controllers/hueController.mjs";

const app = express();
const controllers = [];

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/status", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({
    status: "Online",
    serverIP: ip.address(),
    controllers,
  });
});

app.listen(80, () => {
  const initAlfred = async () => {
    controllers.push(await initHueController());
    log("Successfully initialised Alfred!");
  };

  initAlfred();
});
