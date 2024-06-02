import { Job } from "bullmq";
import { createQueue, createWorker } from "./workers/factories";
import { startHealthCheck } from "./workers/healthMonitor";

const rarity = ["common", "uncommon", "r", "sr", "ssr"];
const tickets = [
  { id: 1111 },
  { id: 2222 },
  { id: 3333 },
  { id: 4444 },
  { id: 5555 },
];

const queue = createQueue("some-queue");
const someProcessor = async (job: Job) => {
  const { id } = job.data;
  const result = await new Promise<string>((resolve) => {
    setTimeout(() => {
      console.log(`${id} is being processed...`);
      const index = Math.floor(Math.random() * 5);
      resolve(rarity[index]);
    }, 1000);
  });
  return result;
};

createWorker("some-queue", someProcessor, {
  lockDuration: 300000,
  concurrency: 16,
});

async function main() {
  await Promise.all([
    tickets.map(({ id }) => queue.add(`crack-${id}`, { id })),
  ]);
  startHealthCheck(queue);
}
main();
