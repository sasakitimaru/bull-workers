"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factories_1 = require("./workers/factories");
const healthMonitor_1 = require("./workers/healthMonitor");
const rarity = ["common", "uncommon", "r", "sr", "ssr"];
const tickets = [
    { id: 1111 },
    { id: 2222 },
    { id: 3333 },
    { id: 4444 },
    { id: 5555 },
];
const queue = (0, factories_1.createQueue)("some-queue");
const someProcessor = async (job) => {
    const { id } = job.data;
    const result = await new Promise((resolve) => {
        setTimeout(() => {
            console.log(`${id} is being processed...`);
            const index = Math.floor(Math.random() * 5);
            resolve(rarity[index]);
        }, 1000);
    });
    return result;
};
(0, factories_1.createWorker)("some-queue", someProcessor, {
    lockDuration: 300000,
    concurrency: 1,
});
async function main() {
    await Promise.all([
        tickets.map(({ id }) => queue.add(`crack-${id}`, { id })),
    ]);
    (0, healthMonitor_1.startHealthCheck)(queue);
}
main();
