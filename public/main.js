(function () {
  // doms
  const $sectionOffline = document.getElementById("section-offline");
  const $sectionOnline = document.getElementById("section-online");
  const $connectBtn = document.getElementById("connect-btn");
  const $disconnectBtn = document.getElementById("disconnect-btn");
  const $messageInput = document.getElementById("message");
  const $sendBtn = document.getElementById("send-btn");
  const $messageList = document.getElementById("message-list");

  function toggleOnlineStatus(isOnline) {
    $sectionOffline.hidden = isOnline;
    $sectionOnline.hidden = !isOnline;
  }

  function appendMessage(message) {
    const $li = document.createElement("li");
    $li.innerText = message;
    $messageList.appendChild($li);
  }

  // socket
  let socket = io({
    autoConnect: false,
  });

  // codec
  const codec = new Codec();

  // global status
  let isConnecting = false;
  let isConnected = false;

  toggleOnlineStatus(isConnected);

  // bind events
  $connectBtn.addEventListener("click", (e) => {
    if (isConnecting || isConnected) {
      return;
    }
    isConnecting = true;
    socket.connect();
  });

  // bind events
  $disconnectBtn.addEventListener("click", (e) => {
    if (!isConnected) {
      return;
    }
    socket.disconnect();
  });

  // bind events
  $sendBtn.addEventListener("click", (e) => {
    socket.emit("msg", codec.pack($messageInput.value));
    $messageInput.value = "";
  });

  socket.on("connect", () => {
    appendMessage(`connect: ${socket.id}`);
    isConnecting = false;
    isConnected = true;
    toggleOnlineStatus(isConnected);
  });

  socket.on("disconnect", () => {
    appendMessage(`disconnect: ${socket.id}`);
    isConnected = false;
    toggleOnlineStatus(isConnected);
  });

  socket.on("msg", (data) => {
    // data receive is just arraybuffer, should transform to uint8array before decode
    appendMessage(`msg: ${codec.unpack(new Uint8Array(data))}`);
  });
})();
