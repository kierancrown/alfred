import axios from "axios";
import * as path from "path";
import config from "../constants.js";
import { registerController } from "../utils/logger.js";
import bodyParser from "body-parser";

const baseUrl = `http://${config.HUE_BRIDGE_IP}/api/${config.HUE_USERNAME}`;
const discoveredLights = [];
const log = registerController("Hue Controller");
var jsonParser = bodyParser.json();

const configureRoutes = (app) => {
  app.get("/hue", (req, res) => {
    res.sendFile(path.join(path.resolve(), "web/hue.html"));
  });

  app.get("/hue/status", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json({
      status: "Online",
      bridgeIP: config.HUE_BRIDGE_IP,
      lights: discoveredLights,
    });
  });

  app.put("/hue/light", jsonParser, (req, res) => {
    const body = req.body;
    if (Array.isArray(body)) {
      body.forEach((b) => {
        changeLightState(b.id, { ...b.state });
      });
    } else changeLightState(body.id, { ...body.state });
    res.json(body);
  });
};

export const initController = async (expressServer) => {
  log("Initialising Hue Controller...");
  configureRoutes(expressServer);
  const lights = await getLights();
  for (const id in lights) {
    discoveredLights.push({ id, ...lights[id] });
  }
  log(`Discovered ${discoveredLights.length} lights`);
  return { name: "Hue Controller", discoveredLights };
};

export const getLights = async () => {
  log("Discovering lights...");
  const res = await axios.get(`${baseUrl}/lights`);
  if (res.status === 200) return res.data;
  else return {};
};

export const changeLightState = async (id, state) => {
  log(`Attempting to change light ${id} to state: ${JSON.stringify(state)}`);
  log(`${baseUrl}/lights/${id}/state`);
  const res = await axios.put(
    `${baseUrl}/lights/${id}/state`,
    JSON.stringify(state)
  );
  if (res.status === 200) return res.data;
  else return { error: res.statusText, status: res.status };
};
