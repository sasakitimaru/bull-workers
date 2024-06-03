import { Queue, QueueEvents, Worker } from "bullmq";

export function listenQueueEvent(queue: Queue) {
  const queueEvent = new QueueEvents(queue.name);
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

  process.on("SIGINT", async (signal) => await gracefulShutdown(worker));
  process.on("SIGTERM", async (signal) => await gracefulShutdown(worker));
}

async function gracefulShutdown(worker: Worker) {
  await worker.close();
  process.exit(0);
}
