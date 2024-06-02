"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHealthCheck = void 0;
const bullmq_1 = require("bullmq");
function startHealthCheck(queue) {
    const queueEvent = new bullmq_1.QueueEvents(queue.name);
    queueEvent.on("active", (jobId) => {
        console.log(`[${queue.name}] active job: ${jobId}`);
    });
    queueEvent.on("waiting", () => {
        const count = queue.getWaitingCount();
        console.log(`[${queue.name}] waiting job: ${count}`);
    });
    queueEvent.on("completed", (jobId, returnvalue) => {
        console.log(`[${queue.name}] completed job: ${jobId} with return value: ${returnvalue}`);
    });
    queueEvent.on("error", (error) => {
        console.error("QueueEvents error:", error);
    });
}
exports.startHealthCheck = startHealthCheck;
