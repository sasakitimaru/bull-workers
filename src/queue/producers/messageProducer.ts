import { MessageQueueReq, Producer, QueueName } from "../factory";

export async function enqueueMessages(messages: MessageQueueReq[]) {
  const concurrentQueueProducer = new Producer(QueueName.CONCURRENT_QUEUE);
  const singleQueueProducer = new Producer(QueueName.SINGLE_QUEUE);
  concurrentQueueProducer.start();
  singleQueueProducer.start();

  await Promise.all(
    messages.map(async ({ message }) => {
      concurrentQueueProducer.add("message", { message });
      singleQueueProducer.add("message", { message });
    })
  );
}
