import http from "node:http";
import { searchInternetArchive, validateAdminManifest } from "./catalog.mjs";
import { audioProfiles, videoCodecs, videoLadder } from "./profiles.mjs";
import { searchYouTube } from "./youtube.mjs";

const json = (res, status, data) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" });
  res.end(JSON.stringify(data));
};
const readJson = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (Buffer.concat(chunks).length > 1_000_000) throw new Error("Request too large");
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
};

export const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "GET" && url.pathname === "/api/profiles")
      return json(res, 200, { audioProfiles, videoCodecs, videoLadder });
    if (req.method === "GET" && url.pathname === "/api/search/archive") {
      const q = url.searchParams.get("q")?.trim();
      if (!q) return json(res, 400, { error: "q is required" });
      return json(res, 200, { items: await searchInternetArchive(q) });
    }
    if (req.method === "GET" && url.pathname === "/api/search/youtube") {
      const q = url.searchParams.get("q")?.trim();
      if (!q) return json(res, 400, { error: "q is required" });
      return json(res, 200, { items: await searchYouTube(q) });
    }
    if (req.method === "POST" && url.pathname === "/api/catalog/manifest")
      return json(res, 202, { item: validateAdminManifest(await readJson(req)), status: "pending_rights_review" });
    return json(res, 404, { error: "Not found" });
  } catch (error) {
    return json(res, 400, { error: error.message });
  }
});

if (process.env.NODE_ENV !== "test") {
  server.listen(Number(process.env.PORT || 8787), () => console.log("Monochrome 2 API listening"));
}
