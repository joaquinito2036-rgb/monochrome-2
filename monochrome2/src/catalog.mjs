const ARCHIVE_SEARCH = "https://archive.org/advancedsearch.php";
const ALLOWED_LICENSES = [
  "publicdomain", "creativecommons.org/publicdomain",
  "creativecommons.org/licenses/by/", "creativecommons.org/licenses/by-sa/",
  "creativecommons.org/licenses/by-nd/", "creativecommons.org/licenses/by-nc/",
  "creativecommons.org/licenses/by-nc-sa/", "creativecommons.org/licenses/by-nc-nd/"
];

function scalar(value) {
  return Array.isArray(value) ? value[0] : value;
}

export function hasReusableLicense(record) {
  const license = String(scalar(record.licenseurl) || "").toLowerCase();
  return ALLOWED_LICENSES.some((allowed) => license.includes(allowed));
}

export async function searchInternetArchive(query, { rows = 20, fetchImpl = fetch } = {}) {
  const params = new URLSearchParams({
    q: `(${query}) AND mediatype:(audio OR movies)`,
    fl: "identifier,title,creator,mediatype,licenseurl,date,description",
    rows: String(Math.min(Math.max(Number(rows) || 20, 1), 50)),
    page: "1",
    output: "json"
  });
  const response = await fetchImpl(`${ARCHIVE_SEARCH}?${params}`);
  if (!response.ok) throw new Error(`Internet Archive returned ${response.status}`);
  const body = await response.json();
  return (body.response?.docs || []).filter(hasReusableLicense).map((item) => ({
    provider: "internet_archive",
    id: item.identifier,
    title: scalar(item.title) || item.identifier,
    creator: scalar(item.creator) || null,
    mediaType: item.mediatype,
    licenseUrl: scalar(item.licenseurl),
    detailsUrl: `https://archive.org/details/${encodeURIComponent(item.identifier)}`
  }));
}

export function validateAdminManifest(input) {
  if (!input || typeof input !== "object") throw new TypeError("Manifest must be an object");
  const required = ["title", "sourceUrl", "rightsBasis"];
  for (const field of required) {
    if (!String(input[field] || "").trim()) throw new TypeError(`Missing ${field}`);
  }
  if (!/^https?:\/\//i.test(input.sourceUrl)) throw new TypeError("sourceUrl must use HTTP(S)");
  if (String(input.rightsBasis).trim().length < 12) throw new TypeError("rightsBasis is too vague");
  return {
    provider: input.provider === "rutracker" ? "rutracker_manifest" : "admin_manifest",
    title: String(input.title).trim(),
    creator: input.creator ? String(input.creator).trim() : null,
    sourceUrl: String(input.sourceUrl),
    rightsBasis: String(input.rightsBasis).trim(),
    approved: false,
    submittedAt: new Date().toISOString()
  };
}
