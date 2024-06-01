import { Job } from "bullmq";
import { createQueue, createWorker } from "./workers/fuctories";
import { crackHash } from "./workers/tasks/hashCracker.task";

const targetHashes = [
  "3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b",
  "0f78fcc486f5315418fbf095e71c0675ee07d318e5ac4d150050cd8e57966496",
  "85356064d03872ac4bed179b8bbe8318ab67a9626be55d0d72288ee14e165265",
  "9209526aaa61b0709dbb838e14686a26c4a03b53e8eedf34c7e5f6f606110d8c",
  "f464d7d71c06e47a535ce441aa202aa717cddeab902a45b0c283aac7a9a090d7",
];

const queue = createQueue("hash-cracker");

const crackProcessor = async (job: Job) => {
  const { targetHash } = job.data;
  const result = crackHash(targetHash);
  return result;
};
const worker = createWorker("hash-cracker", crackProcessor, {
  lockDuration: 300000,
  concurrency: 5,
});

worker.on("completed", (job) => {
  console.log(`Cracked hash: ${job.returnvalue}`);
});
worker.on("failed", (_, err) => {
  console.error(`Failed to crack hash: ${err}`);
});

function main() {
  console.log("Cracking the hash...");
  console.time("Cracking time");
  targetHashes.forEach((targetHash, index) => {
    queue.add(`crack-${index}`, { targetHash });
  });
  console.timeEnd("Cracking time");
}
main();
