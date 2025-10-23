/* Fetches published CSVs from Google Sheets and returns parsed arrays. */
const Sheets = (() => {
  // Replace these with your published CSV URLs
  const CSV = {
    events: "https://docs.google.com/spreadsheets/d/REPLACE/pub?output=csv",
    sponsors: "https://docs.google.com/spreadsheets/d/REPLACE/pub?output=csv",
    enrollments: "https://docs.google.com/spreadsheets/d/REPLACE/pub?output=csv",
    users: "https://docs.google.com/spreadsheets/d/REPLACE/pub?output=csv",
    ad_config: "https://docs.google.com/spreadsheets/d/REPLACE/pub?output=csv",
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return [];
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map(row => {
      const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const obj = {};
      headers.forEach((h, i) => {
        let v = (values[i] || "").trim();
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1,-1);
        obj[h] = v;
      });
      return obj;
    });
  };

  const fetchCSV = async (url) => {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("CSV fetch failed");
    const text = await res.text();
    return parseCSV(text);
  };

  const get = async (key) => {
    try {
      const data = await fetchCSV(CSV[key]);
      localStorage.setItem(`SS_CACHE_${key}`, JSON.stringify({ data, ts: Date.now() }));
      return data;
    } catch (e) {
      const fallback = localStorage.getItem(`SS_CACHE_${key}`);
      if (fallback) {
        try { return JSON.parse(fallback).data; } catch {}
      }
      return window.SS_FALLBACK?.[key] || [];
    }
  };

  return { get };
})();

<script src="scripts/fallback.js"></script>
