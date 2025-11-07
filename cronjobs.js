import cron from 'node-cron';
import { fetchRates } from './fetchrates.js';

function logWithTime(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Run once at startup
logWithTime('Starting cron runner — fetching rates once at startup...');
fetchRates()
  .then(() => logWithTime('✅ Gold & silver rates updated successfully!'))
  .catch(err => logWithTime(`❌ Startup fetch failed: ${err}`));

// Nepal Time schedules (Asia/Kathmandu)
cron.schedule('0 0 * * *', () => { // 00:00 NPT
  logWithTime('⏰ 00:00 NPT fetch');
  fetchRates()
    .then(() => logWithTime('✅ Scheduled fetch succeeded'))
    .catch(err => logWithTime(`❌ Scheduled fetch failed: ${err}`));
}, { timezone: 'Asia/Kathmandu' });

cron.schedule('1 10 * * *', () => { // 10:01 NPT
  logWithTime('⏰ 10:01 NPT fetch');
  fetchRates()
    .then(() => logWithTime('✅ Scheduled fetch succeeded'))
    .catch(err => logWithTime(`❌ Scheduled fetch failed: ${err}`));
}, { timezone: 'Asia/Kathmandu' });

cron.schedule('1 11 * * *', () => { // 11:01 NPT
  logWithTime('⏰ 11:01 NPT fetch');
  fetchRates()
    .then(() => logWithTime('✅ Scheduled fetch succeeded'))
    .catch(err => logWithTime(`❌ Scheduled fetch failed: ${err}`));
}, { timezone: 'Asia/Kathmandu' });

cron.schedule('1 12 * * *', () => { // 12:01 NPT
  logWithTime('⏰ 12:01 NPT fetch');
  fetchRates()
    .then(() => logWithTime('✅ Scheduled fetch succeeded'))
    .catch(err => logWithTime(`❌ Scheduled fetch failed: ${err}`));
}, { timezone: 'Asia/Kathmandu' });