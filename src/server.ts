import express, { Router } from 'express';
import { formatNumberWithDecimals } from './utils.ts';
import { healthApi } from './healthApi.ts';

const initTimestamp = Temporal.Now.instant();
const PORT = process.env.ENVIRONMENT_PORT || 4000;
const IS_PROD = process.env.NODE_ENV === 'production';

const app = express();

app.use(express.json());

const router = Router();

[healthApi].forEach(api => api(router));

app.use(router);

app.listen(PORT, () => {
  const startupDuration = initTimestamp.until(Temporal.Now.instant()).total({ unit: 'milliseconds' });
  const durationWithOneDecimal = formatNumberWithDecimals(startupDuration, 1);
  const envUrl = IS_PROD ? null : `http://localhost:${PORT}`;

  console.log(`Startup took: ${durationWithOneDecimal}ms`);
  if (envUrl) {
    console.log(`App running on: ${envUrl}`);
  }
});
