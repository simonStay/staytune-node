import {StayTuneApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
const cron = require('node-cron');

import axios from 'axios';

cron.schedule('0 12 * * *', async () => {
  // console.log('running a task every day at 1 pm');
  const result = await axios.get(
    'https://staytune.austinconversionoptimization.com/users/push-notifications',
  );
  console.log('cron result : ', result);
});

cron.schedule('0 22 * * *', async () => {
  // console.log('running a task every day at 1 pm');
  const result = await axios.get(
    'https://staytune.austinconversionoptimization.com/users/push-notifications-for-culniry',
  );
  console.log('cron result : ', result);
});

export {StayTuneApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new StayTuneApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
