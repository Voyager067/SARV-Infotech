import { createApp } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

const start = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[server] listening on port ${env.port}`);
  });
};

start().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});
