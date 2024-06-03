import {
  BaseJobOptions,
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

type QueueName = keyof QueueConfig;

type QueueConfig = {
  "concurrent-queue": {
    data: { message: string };
    return: string;
  };
  "single-queue": {
    data: { message: string };
    return: string;
  };
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
