importScripts("patcher.js");

self.addEventListener(
  "message",
  (e) => {
    var payload = e.data;

    var outputBuffer = RomPatcher.applyPatch(
      new Uint8Array(payload.deltaBuffer),
      payload.isoFileBuffer
    );
    postMessage(outputBuffer, [outputBuffer.buffer]);
  },
  false
);
