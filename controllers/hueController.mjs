import axios from "axios";
import config from "../constants.mjs";
import { registerController } from "../utils/logger.mjs";

const baseUrl = `http://${config.HUE_BRIDGE_IP}/api/${config.HUE_USERNAME}`;
const discoveredLights = [];
const log = registerController("Hue Controller");

export const initController = async () => {
  log("Initialising Hue Controller...");
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
  const res = await axios.put(
    `${baseUrl}/lights/${id}/state`,
    JSON.stringify(state)
  );
  if (res.status === 200) return res.data;
  else return { error: res.statusText, status: res.status };
};
