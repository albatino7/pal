import ImagekitIO from "@imagekit/nodejs";

import config from "../config/config.js";

const imageKitio = new ImagekitIO({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export default imageKitio;
