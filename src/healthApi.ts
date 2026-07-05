import type { Router } from 'express';

export const healthApi = (router: Router): void => {
  router.get(['/', '/health'], (_req, res) => {
    const timestamp = Temporal.Now.instant();
    res.json({ status: 'healthy', date: timestamp.toLocaleString(), timestamp: timestamp.epochMilliseconds });
  });
};
