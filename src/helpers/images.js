import { encode } from "base64-arraybuffer";

export function processImageContent(files) {
  if (files && files.length) {
    return files[0].arrayBuffer().then(encode);
  } else {
    return Promise.resolve(null);
  }
}