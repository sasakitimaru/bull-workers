import throng from "throng";
import os from "os";
import { initiateMessageConsumers } from "./queue/consumers/messageConsumer";

const count = os.cpus().length;
void throng({
  worker: initiateMessageConsumers,
  count,
});
