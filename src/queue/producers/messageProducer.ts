import { createQueue, MessageQueueReq, QueueName } from "../factory";
import { listenQueueEvent } from "../listener";

const concurrentQueue = createQueue(QueueName.CONCURRENT_QUEUE);
const singleQueue = createQueue(QueueName.SINGLE_QUEUE);

export async function addJobs(messages: MessageQueueReq[]) {
  await Promise.all(
    messages.map(async ({ message }) => {
      concurrentQueue.add("message", { message });
      singleQueue.add("message", { message });
    })
  );

  listenQueueEvent(concurrentQueue);
  listenQueueEvent(singleQueue);
}
