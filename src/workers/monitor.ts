import { Queue, QueueEvents, Worker } from "bullmq";

export function listenQueueEvent(queue: Queue) {
  const queueEvent = new QueueEvents(queue.name);
  queueEvent.on("active", (jobId) => {
    console.log(`[${queue.name}] active job: ${jobId}`);
  });

  queueEvent.on("waiting", () => {
    const count = queue.getWaitingCount();
    console.log(`[${queue.name}] waiting job: ${count}`);
  });

  queueEvent.on("completed", async (result) => {
    console.log(`[${queue.name}] completed job: ${result.returnvalue}`);
  });

  queueEvent.on("error", (error) => {
    console.error(`[${queue.name}] error: ${error}`);
  });
}

export function listenWorkerEvents(worker: Worker) {
  worker.on("completed", (job) => {
    console.log(`[${worker.name}] completed job: ${job.returnvalue}`);
  });

  worker.on("failed", (_, error) => {
    console.error(`[${worker.name}] failed job: ${error.message}`);
  });

  process.on(
    "SIGINT",
    async (signal) => await gracefulShutdown(signal, worker)
  );
  process.on(
    "SIGTERM",
    async (signal) => await gracefulShutdown(signal, worker)
  );
}

async function gracefulShutdown(signal: string, worker: Worker) {
  console.log(`received signal: ${signal}`);
  await worker.close();
  process.exit(0);
}
