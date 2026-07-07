/**
 * Entry point for the Employee Self-Evaluation backend service.
 *
 * Imports the Express app from server.ts and binds it to a port.
 * This file is intentionally thin so that server.ts can be imported
 * by tests without side-effects (no port binding).
 */

import { app } from './server.js';

const PORT = Number(process.env['PORT'] ?? 3001);

app.listen(PORT, () => {
  console.log(`[server] Employee Self-Evaluation backend running on port ${PORT}`);
});
