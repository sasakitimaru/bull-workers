import { Queue, QueueEvents } from "bullmq";

export function startHealthCheck(queue: Queue) {
  const queueEvent = new QueueEvents(queue.name);
  queueEvent.on("active", (jobId) => {
    console.log(`[${queue.name}] active job: ${jobId}`);
  });

  queueEvent.on("waiting", () => {
    const count = queue.getWaitingCount();
    console.log(`[${queue.name}] waiting job: ${count}`);
  });

  queueEvent.on("completed", (jobId, returnvalue) => {
    console.log(
      `[${queue.name}] completed job: ${jobId} with return value: ${returnvalue}`
    );
  });

  queueEvent.on("error", (error) => {
    console.error("QueueEvents error:", error);
  });
}
