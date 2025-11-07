import cron from 'node-cron';
import { fetchRates } from './fetchrates.js';

console.log('Starting cron runner — fetching rates once at startup...');
fetchRates().catch(err => console.error('Startup fetch failed:', err));

// Nepal Time schedules (Asia/Kathmandu)
cron.schedule('0 0 * * *', () => { // 00:00 NPT
  console.log('⏰ 00:00 NPT fetch');
  fetchRates().catch(console.error);
}, { timezone: 'Asia/Kathmandu' });

cron.schedule('1 10 * * *', () => { // 10:01 NPT
  console.log('⏰ 10:01 NPT fetch');
  fetchRates().catch(console.error);
}, { timezone: 'Asia/Kathmandu' });

cron.schedule('1 11 * * *', () => { // 11:01 NPT
  console.log('⏰ 11:01 NPT fetch');
  fetchRates().catch(console.error);
}, { timezone: 'Asia/Kathmandu' });

cron.schedule('1 12 * * *', () => { // 12:01 NPT
  console.log('⏰ 12:01 NPT fetch');
  fetchRates().catch(console.error);
}, { timezone: 'Asia/Kathmandu' });