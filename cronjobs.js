// cronjobs.js
import cron from 'node-cron';
import { fetchRates } from './fetchrates.js';

// Run once at startup
console.log('Starting cron runner — fetching rates once at startup...');
fetchRates().catch(err => console.error('Startup fetch failed:', err));

// Schedule: runs at minute 0 of every hour
cron.schedule('0 * * * *', () => {
  console.log('⏰ Running scheduled rate fetch...');
  fetchRates().catch(err => console.error('Scheduled fetch failed:', err));
});
