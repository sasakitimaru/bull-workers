import { Job } from "bullmq";
import { createWorker } from "./workers/factory";
import { listenWorkerEvents } from "./workers/monitor";

async function messageProcessor(job: Job) {
  const { message } = job.data;
  const result = await new Promise<string>((resolve) => {
    setTimeout(() => {
      const now = new Date().toISOString();
      const post = `[${now}] ${message}`;
      resolve(post);
    }, 1000);
  });
  return result;
}

export async function addWorkers() {
  const concurrentWorker = createWorker("concurrent-queue", messageProcessor, {
    lockDuration: 300000,
    concurrency: 4,
  });
  const singleWorker = createWorker("single-queue", messageProcessor, {
    lockDuration: 300000,
    concurrency: 1,
  });

  listenWorkerEvents(concurrentWorker);
  listenWorkerEvents(singleWorker);
}
