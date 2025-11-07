// fetchrates.js
import fs from "fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { fileURLToPath } from "url";

const url = "https://www.ashesh.com.np/gold/widget.php?api=7700y5p514&header_color=0077e5";

/**
 * Fetches gold/silver rates from Ashesh and saves to rates.json
 */
export async function fetchRates() {
  try {
    console.log("⏳ Fetching gold and silver rates...");
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();

    // Save HTML for inspection (useful for debugging)
    try {
      fs.writeFileSync("./last.html", html);
      console.log("📝 Saved fetched HTML to last.html for inspection.");
    } catch (err) {
      console.warn("⚠️ Could not write last.html:", err.message);
    }

    const dom = new JSDOM(html);
    const document = dom.window.document;
    const rates = [];

    // ✅ 1. Preferred parser: div.country blocks
    const countryNodes = document.querySelectorAll(".country");
    if (countryNodes.length > 0) {
      countryNodes.forEach((node) => {
        const name = node.querySelector(".name")?.textContent.trim();
        const unit = node.querySelector(".unit")?.textContent.trim();
        const rate =
          node.querySelector(".rate_buying")?.textContent.trim() ||
          node.querySelector(".rate_selling")?.textContent.trim();
        if (name && rate) rates.push({ item: name, unit, rate });
      });
    }

    // ✅ 2. Fallback: older <table> format
    if (rates.length === 0) {
      const rows = document.querySelectorAll("table tr");
      rows.forEach((row) => {
        const cols = row.querySelectorAll("td");
        if (cols.length >= 2) {
          const item = cols[0].textContent.trim();
          const rate = cols[1].textContent.trim();
          if (item && rate) rates.push({ item, rate });
        }
      });
    }

    // ✅ 3. Debug info if still no data found
    if (rates.length === 0) {
      console.log("⚠️ No valid rate rows found. Attempting fallbacks...");
      const tables = document.querySelectorAll("table");
      console.log(`Found ${tables.length} <table> elements.`);
      const numericMatches = html.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?/g) || [];
      console.log(`Found ${numericMatches.length} numeric-like values in HTML.`);
    }

    // ✅ Save result
    const data = {
      lastUpdated: new Date().toISOString(),
      rates,
    };

    fs.writeFileSync("./rates.json", JSON.stringify(data, null, 2));
    console.log("✅ Gold & silver rates updated successfully!");
  } catch (error) {
    console.error("❌ Error fetching rates:", error.message || error);
  }
}

// Run automatically if called directly via CLI
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  fetchRates();
}
