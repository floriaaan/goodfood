import amqplib from 'amqplib';

export async function sendMessage(...args: String[]){
	const queue = 'tasks';
	const conn = await amqplib.connect('amqp://localhost');
	const ch = await conn.createChannel();

	args.map( arg => {
		ch.sendToQueue(queue, Buffer.from(JSON.stringify({"event_message": arg, "metadata": null})));
	});
}