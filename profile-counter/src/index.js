export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const username = (url.searchParams.get("username") || "sakilahmed-git").trim();

    if (username !== "sakilahmed-git") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    let views;
    try {
      await env.DB.prepare(
        "INSERT INTO profile_views (username, views) VALUES (?, 1) " +
        "ON CONFLICT(username) DO UPDATE SET views = views + 1"
      ).bind(username).run();

      const row = await env.DB.prepare(
        "SELECT views FROM profile_views WHERE username = ?"
      ).bind(username).first();

      views = Number(row?.views || 1);
    } catch {
      return new Response("Counter temporarily unavailable", {
        status: 503,
        headers: { "Cache-Control": "no-store" }
      });
    }

    const label = escapeXml(url.searchParams.get("label") || "PROFILE VIEWS");
    const value = views.toLocaleString("en-US");
    const labelWidth = Math.max(94, label.length * 6.5 + 14);
    const valueWidth = Math.max(34, value.length * 7 + 14);
    const width = labelWidth + valueWidth;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="${width}" height="20" rx="3"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#334155"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="#2563EB"/>
    <rect width="${width}" height="20" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
  </g>
</svg>`;

    return new Response(request.method === "HEAD" ? null : svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Access-Control-Allow-Origin": "*",
        "X-Content-Type-Options": "nosniff"
      }
    });
  }
};

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  })[char]);
}
