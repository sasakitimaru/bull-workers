import { createQueue } from "./workers/factory";
import { listenQueueEvent } from "./workers/monitor";

const concurrentQueue = createQueue("concurrent-queue");
const singleQueue = createQueue("single-queue");

export async function addJobs(messages: { message: string }[]) {
  await Promise.all(
    messages.map(async ({ message }) => {
      concurrentQueue.add("message", { message });
      singleQueue.add("message", { message });
    })
  );

  listenQueueEvent(concurrentQueue);
  listenQueueEvent(singleQueue);
}
