"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorker = exports.createQueue = void 0;
const bullmq_1 = require("bullmq");
const env_1 = require("../env");
const connection = {
    host: env_1.REDIS_HOST,
    port: env_1.REDIS_PORT,
};
const createQueue = (queueName, defaultJobOptions) => {
    return new bullmq_1.Queue(queueName, {
        connection,
        defaultJobOptions,
    });
};
exports.createQueue = createQueue;
const createWorker = (queueName, processor, workerOptions) => {
    return new bullmq_1.Worker(queueName, processor, {
        ...workerOptions,
        connection,
    });
};
exports.createWorker = createWorker;
