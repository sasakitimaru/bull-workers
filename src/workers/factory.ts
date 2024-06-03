import {
  BaseJobOptions,
  Job,
  Processor,
  Queue,
  Worker,
  WorkerOptions,
} from "bullmq";
import { REDIS_HOST, REDIS_PORT } from "../env";

const connection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

export type MessageQueueReq = { message: string };
export type MessageQueueRes = string;

type QueueName = keyof QueueConfig;
type QueueItem<T, R> = {
  data: T;
  return: R;
};
type QueueConfig = {
  "concurrent-queue": QueueItem<MessageQueueReq, MessageQueueRes>;
  "single-queue": QueueItem<MessageQueueReq, MessageQueueRes>;
};

type DataType<T extends QueueName> = QueueConfig[T]["data"];
type ReturnType<T extends QueueName> = QueueConfig[T]["return"];

export const createQueue = <T extends QueueName>(
  queueName: T,
  defaultJobOptions?: BaseJobOptions
) => {
  return new Queue<DataType<T>, ReturnType<T>>(queueName, {
    connection,
    defaultJobOptions,
  });
};

export const processorAdapter = <T extends QueueName>(
  processor: Processor<DataType<T>, ReturnType<T>>
) => {
  return async (job: Job<DataType<T>>) => {
    const result = await processor(job);
    return result;
  };
};

export const createWorker = <T extends QueueName>(
  queueName: T,
  processor: Processor<DataType<T>, ReturnType<T>>,
  workerOptions?: Omit<WorkerOptions, "connection">
) => {
  return new Worker<DataType<T>, ReturnType<T>>(queueName, processor, {
    ...workerOptions,
    connection,
  });
};
