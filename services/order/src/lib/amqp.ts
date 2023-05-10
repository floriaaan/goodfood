import amqp from "amqplib";
import { msg } from "@order/middleware/log";
import { log } from "@order/lib/log";

const DEFAULT_QUEUE = "log";

async function connectQueue(queue = DEFAULT_QUEUE) {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();

    await channel.assertQueue(queue);
    return channel;
  } catch (error) {
    return error as Error;
  }
}

const toLog = (message: any) => {
  const { request, path } = message;
  return { event_message: path, metadata: { request } };
};

export const publish = async (message: any, queue = DEFAULT_QUEUE) => {
  const channel = await connectQueue(queue);
  if (channel instanceof Error)
    return console.log("Error to connect to queue: ", channel);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(toLog(message))));
  log.debug(
    msg("AMQP", `${queue} (queue)`, new Date(), new Date()),
    JSON.stringify(message)
  );
};
