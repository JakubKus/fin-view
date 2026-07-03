import express from 'express';
import { formatNumberWithDecimals } from './utils.ts';

const initTimestamp = Temporal.Now.instant();
const PORT = 4000;

const app = express();

app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  const timestamp = Temporal.Now.instant();
  res.json({ status: 'healthy', date: timestamp.toLocaleString(), timestamp: timestamp.epochMilliseconds });
});

app.get('/', (_req, res) => {
  res.json({ hello: 'world' });
});

app.listen(PORT, () => {
  const startupDuration = initTimestamp.until(Temporal.Now.instant()).total({ unit: 'milliseconds' });
  const durationWithOneDecimal = formatNumberWithDecimals(startupDuration, 1);

  console.log(`App running on port: ${PORT} (startup took: ${durationWithOneDecimal}ms)`);
});
