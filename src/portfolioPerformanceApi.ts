import Sqlite from 'node:sqlite';
import type { Router } from 'express';
import z from 'zod';

export const portfolioPerformanceApi = (router: Router): void => {
  router.get('/portfolio-performance', (_req, res) => {
    const navSchema = z.object({
      date: z.string(),
      cash: z.number(),
      stock: z.number(),
    });
    type NAV = z.infer<typeof navSchema>;

    const database = new Sqlite.DatabaseSync('./db.sqlite');

    const query = database.prepare('SELECT date, cash, stock FROM nav ORDER BY date');
    const navResult = query.all();

    const checkIfNav = (data: unknown): data is NAV[] => Array.isArray(data) && navSchema.safeParse(data[0]).success;
    if (!checkIfNav(navResult)) {
      res.send('');
      return;
    }

    const createNavRow = (row: NAV) => `
      <tr>
        <td>${row.date}</td>
        <td>${row.stock} zł</td>
        <td>${row.cash} zł</td>
      </tr>
    `;

    const navRows = navResult.map(navRow => createNavRow(navRow)).join('');

    res.send(`
      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Stock</td>
            <td>Cash</td>
          </tr>
        </thead>
        <tbody>${navRows}</tbody>
      </table>
    `);
  });
};
