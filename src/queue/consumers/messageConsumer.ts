import { createWorker, processorAdapter, QueueName } from "../factory";
import { listenWorkerEvents } from "../listener";

const messageProcessor = processorAdapter<QueueName.CONCURRENT_QUEUE>(
  async (job) => {
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
);

export async function messageConsumer() {
  const concurrentWorker = createWorker(
    QueueName.CONCURRENT_QUEUE,
    messageProcessor,
    {
      lockDuration: 300000,
      concurrency: 4,
    }
  );
  const singleWorker = createWorker(QueueName.SINGLE_QUEUE, messageProcessor, {
    lockDuration: 300000,
    concurrency: 1,
  });

  listenWorkerEvents(concurrentWorker);
  listenWorkerEvents(singleWorker);
}
