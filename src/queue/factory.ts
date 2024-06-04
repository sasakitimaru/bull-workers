import {
  BaseJobOptions,
  Job,
  Processor,
  Queue,
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
