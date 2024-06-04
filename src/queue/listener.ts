import { Queue, QueueEvents, Worker } from "bullmq";
import { connection } from "../config";

export function listenQueueEvent(queue: Queue) {
  const queueEvent = new QueueEvents(queue.name, { connection });
  queueEvent.on("active", (job) => {
    console.log(`[${queue.name}] active job: ${job.jobId}`);
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
    console.log(
      `[${worker.name}][pid:${process.pid}] completed job: ${job.returnvalue}`
    );
  });

  worker.on("failed", (_, error) => {
    console.error(
      `[${worker.name}][pid:${process.pid}] failed job: ${error.message}`
    );
  });

  process.on("SIGINT", async () => await gracefulShutdown(worker));
  process.on("SIGTERM", async () => await gracefulShutdown(worker));
}

async function gracefulShutdown(worker: Worker) {
  await worker.close();
  process.exit(0);
}
