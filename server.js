import express from "express";
import ip from "ip";
import AWSIot from "./iot.js";
import { log } from "./utils/logger.js";
import { initController as initHueController } from "./controllers/hueController.js";
import config from "./constants.js";

const app = express();
const controllers = [];

const IOTController = new AWSIot();

app.use("/", express.static("../alfred-ui/"));

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
    IOTController.subscribeToTopic("helloWorld", (payload) => {
      console.log(JSON.parse(payload));
      IOTController.publishToTopic("helloWorldReply", JSON.parse(payload));
    });
  };

  initAlfred();
});
