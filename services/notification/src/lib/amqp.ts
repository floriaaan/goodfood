import { CreateNotification } from "@notifications/handler/create";
import { log } from "@notifications/lib/log";
import plunk from "@notifications/lib/plunk";
import { msg } from "@notifications/middleware/log";
import amqp from "amqplib";

const DEFAULT_QUEUE = "log";
const DEFAULT_SUB_QUEUE = "notification";

async function createQueue(queue = DEFAULT_QUEUE) {
  try {
    const connection = await amqp.connect(process.env.AMQP_URL || "");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });
    return channel;
  } catch (error) {
    return error as Error;
  }
}

async function connectQueue(queue = DEFAULT_QUEUE) {
  try {
    const connection = await amqp.connect(process.env.AMQP_URL || "");
    const channel = await connection.createChannel();
    await channel.assertExchange(queue, "fanout", { durable: true });
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

// Notification from queue not from gRPC so we can have additional fields like email
const toNotification = (message: any) => {
  const {
    email,

    title,
    description,
    icon,
    image,
    callback_url,
    type,

    user_id,
    restaurant_id,
  } = JSON.parse(message.content.toString());
  return {
    email,
    title,
    description,
    icon,
    image,
    callback_url,
    type,

    user_id,
    restaurant_id,
  };
};

export const subscribe = async (queue = DEFAULT_SUB_QUEUE) => {
  const channel = await createQueue(queue);
  if (channel instanceof Error)
    return console.log("Error to create queue: ", channel);

  await channel.consume(
    queue,
    async function (message) {
      const n = toNotification(message);
      await CreateNotification({ request: n }, () => {});

      const { success } = await plunk.emails.send({
        to: n.email,
        subject: n.title,
        body: n.description,
      });

      if (success)
        log.debug(
          msg("AMQP", `${queue} (queue)`, new Date(), new Date()),
          "Email send"
        );
      else
        log.debug(
          msg("AMQP", `${queue} (queue)`, new Date(), new Date()),
          "Email not send"
        );
    },
    {
      noAck: true,
    }
  );
};
