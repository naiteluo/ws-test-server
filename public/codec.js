(function (global) {
  const proto = `
    syntax = "proto3";

    message MessageData {
        string text = 1;
        uint32 seed = 2;
    }
    `;

  const root = protobuf.parse(proto, { keepCase: true }).root;

  const MessageData = root.lookup("MessageData");

  class Codec {
    constructor() {
      return;
    }

    pack(message) {
      const buffer = MessageData.encode({
        text: message,
        seed: +new Date(),
      }).finish();
      return buffer;
    }

    unpack(buffer) {
      try {
        var decodedMessageData = MessageData.decode(buffer);
        return decodedMessageData.text;
      } catch (e) {
        if (e instanceof protobuf.util.ProtocolError) {
          // e.instance holds the so far decoded message with missing required fields
        } else {
          // wire format is invalid
        }
        console.error(e);
      }
    }
  }
  global["Codec"] = Codec;
})(globalThis);
