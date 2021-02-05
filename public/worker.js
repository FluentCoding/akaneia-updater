importScripts("patcher.js");

self.addEventListener(
  "message",
  (e) => {
    var payload = e.data;
    console.log("got the payload");

    var outputBuffer = RomPatcher.applyPatch(
      new Uint8Array(payload.deltaBuffer),
      payload.isoFileBuffer
    );
    console.log("got the outputbuffer");
    postMessage(outputBuffer, [outputBuffer.buffer]);
  },
  false
);
