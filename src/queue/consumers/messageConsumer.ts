import { Job } from "bullmq";
import { Consumer, processorAdapter, QueueName } from "../factory";

const concurrentMessageProcessor = processorAdapter<QueueName.CONCURRENT_QUEUE>(
  async (job: Job) => {
    const { message } = job.data;
    const result = await new Promise<string>((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const post = `[${now}] ${message} by concurrent queue`;
        resolve(post);
      }, 1000);
    });
    return result;
  }
);

const singleMessageProcessor = processorAdapter<QueueName.SINGLE_QUEUE>(
  async (job: Job) => {
    const { message } = job.data;
    const result = await new Promise<string>((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const post = `[${now}] ${message} by single queue`;
        resolve(post);
      }, 1000);
    });
    return result;
  }
);

export async function initiateMessageConsumers() {
  const concurrentMessageConsumer = new Consumer(
    QueueName.CONCURRENT_QUEUE,
    concurrentMessageProcessor,
    { concurrency: 4 }
  );
  const singleMessageConsumer = new Consumer(
    QueueName.SINGLE_QUEUE,
    singleMessageProcessor
  );

  concurrentMessageConsumer.start();
  singleMessageConsumer.start();
}
