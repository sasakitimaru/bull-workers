import { addJobs } from "./queue";
import throng from "throng";
import { addWorkers } from "./worker";

const messages = [
  { message: "hello" },
  { message: "good morning!" },
  { message: "good afternoon!" },
  { message: "good evening!" },
  { message: "good night!" },
];

async function master() {
  await addJobs(messages);
}

async function startWorker() {
  await addWorkers();
}

void throng({
  master,
  worker: startWorker,
  count: 8,
});
