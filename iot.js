import awsIot from "aws-iot-device-sdk";
import { registerController } from "./utils/logger.js";
import * as path from "path";

const log = registerController("AWS IOT");

export default class AWSIot {
  device;
  topics = [];

  constructor() {
    this.topics = [];
    this.device = awsIot.device({
      keyPath: path.join(path.resolve(), "certs/fbf7a3e981-private.pem.key"),
      certPath: path.join(
        path.resolve(),
        "certs/fbf7a3e981-certificate.pem.crt"
      ),
      caPath: path.join(path.resolve(), "certs/AmazonRootCA1.pem"),
      clientId: "alfred-001",
      host: "a2n6zesp9ud7lr-ats.iot.eu-west-1.amazonaws.com",
    });

    this.device.on("connect", function () {
      log("Connected to AWS");
    });

    this.device.on("message", (topic, payload) => {
      const foundTopics = this.topics.filter((t) => {
        return t.name === topic;
      });
      if (foundTopics.length) {
        foundTopics.forEach((topic) => {
          log(`Topic ${topic} triggered handler`);
          topic.handler(payload.toString());
        });
      } else {
        log(`Topic ${topic} not found`);
      }
    });
  }

  subscribeToTopic(topicName, handler) {
    if (!typeof handler === "function") {
      log("Handler not a function");
      return;
    }
    this.device.subscribe(topicName);
    this.topics.push({ name: topicName, handler });
    log(`Subscribed to topic ${topicName}`);
  }

  publishToTopic(topicName, payload) {
    log(`Publishing to topic ${topicName}`);
    this.device.publish(topicName, JSON.stringify(payload));
  }
}
