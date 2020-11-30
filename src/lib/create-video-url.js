import { SERVER_URL } from "../http/constants";

export default function createVideoUrl(filename, token) {
  return `${SERVER_URL}/incidents/video/${filename}?token=${token}`;
}
