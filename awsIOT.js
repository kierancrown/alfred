var awsIot = require("aws-iot-device-sdk");

export default function () {
  var device = awsIot.device({
    keyPath: path.join(path.resolve(), "certs/fbf7a3e981-private.pem.key"),
    certPath: path.join(path.resolve(), "certs/fbf7a3e981-certificate.pem.crt"),
    caPath: path.join(path.resolve(), "certs/AmazonRootCA1.pem"),
    clientId: "alfred-001",
    host: "alfred",
  });

  //
  // Device is an instance returned by mqtt.Client(), see mqtt.js for full
  // documentation.
  //
  device.on("connect", function () {
    console.log("connect");
    device.subscribe("topic_1");
    device.publish("topic_2", JSON.stringify({ test_data: 1 }));
  });

  device.on("message", function (topic, payload) {
    console.log("message", topic, payload.toString());
  });
}
