import throng from "throng";
import os from "os";
import { messageConsumer } from "./queue/consumers/messageConsumer";

const count = os.cpus().length;
void throng({
  worker: messageConsumer,
  count,
});
