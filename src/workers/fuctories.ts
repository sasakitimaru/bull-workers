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

export const createQueue = (
  queueName: string,
  defaultJobOptions?: BaseJobOptions
) => {
  return new Queue(queueName, {
    connection,
    defaultJobOptions,
  });
};

export const createWorker = (
  queueName: string,
  processor: Processor,
  workerOptions?: Omit<WorkerOptions, "connection">
) => {
  return new Worker(queueName, processor, {
    ...workerOptions,
    connection,
  });
};
