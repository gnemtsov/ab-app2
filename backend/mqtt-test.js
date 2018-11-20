var mqtt = require("mqtt-packet");

const net = require("net");
const server = net.createServer(c => {
    // 'connection' listener
    console.log("client connected");
    c.on("end", () => {
        console.log("client disconnected");
    });

    const connack = {
        cmd: "connack",
        returnCode: 0
    };
    mqtt.writeToStream(connack, c);
});

server.on("error", err => {
    throw err;
});

server.listen(8124, () => {
    console.log("server bound");
});
