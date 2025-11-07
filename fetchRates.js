// fetchRates.js
import fs from 'fs';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

const url = "https://www.ashesh.com.np/gold/widget.php?api=7700y5p514&header_color=0077e5";

export async function fetchRates() {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Save raw HTML for debugging so we can inspect why no rows are found
    try {
      fs.writeFileSync('./last.html', html);
      console.log('Saved fetched HTML to last.html for inspection');
    } catch (err) {
      console.warn('Could not write last.html:', err.message);
    }

    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Parse rates
    let rates = [];

    // Primary parser: the widget HTML uses div.country blocks with nested
    // .name, .unit and .rate_buying (or .rate_selling) elements — prefer that.
    const countryNodes = document.querySelectorAll('.country');
    if (countryNodes && countryNodes.length > 0) {
      countryNodes.forEach(node => {
        const nameEl = node.querySelector('.name');
        const unitEl = node.querySelector('.unit');
        // rate_buying is the numeric value shown in the examples
        const rateEl = node.querySelector('.rate_buying') || node.querySelector('.rate_selling');
        const item = nameEl ? nameEl.textContent.trim() : null;
        const unit = unitEl ? unitEl.textContent.trim() : null;
        const rate = rateEl ? rateEl.textContent.trim() : null;
        if (item && rate) {
          rates.push({ item, unit, rate });
        }
      });
    }

    // Fallback: older approach looking for table rows (kept for backward-compat)
    if (rates.length === 0) {
      const rows = document.querySelectorAll("table tr");
      rows.forEach(row => {
        const cols = row.querySelectorAll("td");
        if (cols.length >= 2) {
          const item = cols[0].textContent.trim();
          const rate = cols[1].textContent.trim();
          rates.push({ item, rate });
        }
      });
    }

    // If we didn't find any rates with the simple table selector,
    // try a couple of fallbacks and log helpful debugging info.
    if (rates.length === 0) {
      console.log('No table rows found with selector "table tr". Trying fallbacks...');

      // 1) Try to find any table and inspect its HTML
      const tables = document.querySelectorAll('table');
      console.log(`Found ${tables.length} <table> elements in the document.`);

      // 2) Try to extract simple numeric patterns from the whole HTML as a last resort
      const numericMatches = html.match(/[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?/g) || [];
      console.log(`Found ${numericMatches.length} numeric-like values in fetched HTML.`);
      // but don't automatically push them — keep rates as-is for now so we can inspect last.html
    }

    const data = {
      lastUpdated: new Date().toISOString(),
      rates
    };

    fs.writeFileSync('./rates.json', JSON.stringify(data, null, 2));
    console.log("✅ Gold rates updated successfully!");
  } catch (error) {
    console.error("❌ Error fetching rates:", error);
  }
}

// If this file is executed directly (node fetchrates.js), run fetchRates().
// If imported, the caller can invoke fetchRates() (useful for scheduled runs).
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  fetchRates();
}
