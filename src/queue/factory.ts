import {
  BaseJobOptions,
  Job,
  Processor,
  Queue,
  QueueEvents,
  Worker,
  WorkerOptions,
} from "bullmq";
import { connection } from "../config";

export type MessageQueueReq = { message: string };
export type MessageQueueRes = string;

export enum QueueName {
  CONCURRENT_QUEUE = "concurrent-queue",
  SINGLE_QUEUE = "single-queue",
}
type QueueItem<T, R> = {
  data: T;
  return: R;
};
type QueueConfig = {
  [QueueName.CONCURRENT_QUEUE]: QueueItem<MessageQueueReq, MessageQueueRes>;
  [QueueName.SINGLE_QUEUE]: QueueItem<MessageQueueReq, MessageQueueRes>;
};

type DataType<T extends QueueName> = QueueConfig[T]["data"];
type ReturnType<T extends QueueName> = QueueConfig[T]["return"];

export class Producer<T extends QueueName> {
  private queue: Queue<DataType<T>, ReturnType<T>>;
  private queueEvent: QueueEvents;

  constructor(queueName: T, defaultJobOptions?: BaseJobOptions) {
    this.queue = new Queue<DataType<T>, ReturnType<T>>(queueName, {
      connection,
      defaultJobOptions,
    });
    this.queueEvent = new QueueEvents(queueName, { connection });
  }

  start() {
    this.queueEvent = new QueueEvents(this.queue.name, { connection });
    this.queueEvent.on("active", (job) => {
      console.log(`[${this.queue.name}] active job: ${job.jobId}`);
    });

    this.queueEvent.on("waiting", () => {
      const count = this.queue.getWaitingCount();
      console.log(`[${this.queue.name}] waiting job: ${count}`);
    });

    this.queueEvent.on("completed", async (result) => {
      console.log(`[${this.queue.name}] completed job: ${result.returnvalue}`);
    });

    this.queueEvent.on("error", (error) => {
      console.error(`[${this.queue.name}] error: ${error}`);
    });
  }

  async add(name: string, data: DataType<T>) {
    await this.queue.add(name, data);
  }
}

export class Consumer<T extends QueueName> {
  private worker: Worker<DataType<T>, ReturnType<T>>;

  constructor(
    queueName: T,
    processor: Processor<DataType<T>, ReturnType<T>>,
    workerOptions?: Omit<WorkerOptions, "connection">
  ) {
    this.worker = new Worker<DataType<T>, ReturnType<T>>(queueName, processor, {
      ...workerOptions,
      connection,
    });
  }

  start() {
    this.worker.on("completed", (job) => {
      console.log(
        `[${this.worker.name}][pid:${process.pid}] completed job: ${job.returnvalue}`
      );
    });

    this.worker.on("failed", (_, error) => {
      console.error(
        `[${this.worker.name}][pid:${process.pid}] failed job: ${error.message}`
      );
    });

    process.on("SIGINT", async () => await this.gracefulShutdown());
    process.on("SIGTERM", async () => await this.gracefulShutdown());
  }

  private async gracefulShutdown() {
    await this.worker.close();
    process.exit(0);
  }
}

export const processorAdapter = <T extends QueueName>(
  processor: Processor<DataType<T>, ReturnType<T>>
) => {
  return async (job: Job<DataType<T>>) => {
    const result = await processor(job);
    return result;
  };
};
