import md5File from "md5-file";

function isValidSsbmIso(isoFile) {
  const validMD5Hashes = ["0e63d4223b01d9aba596259dc155a174"];
  return md5File(isoFile).then((received) => {
    if (validMD5Hashes.includes(received)) {
      window.log.info("good");
      return Promise.resolve(true);
    } else {
      return Promise.reject(false);
    }
  });
}

export { isValidSsbmIso };
