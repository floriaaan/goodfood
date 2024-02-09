import {createClient} from "redis";

const client = createClient({url: process.env.REDIS_URL});

client.on('error', (err: any) => {
    console.log('could not establish a connection with redis. ' + err);
});
client.on('connect', () => {
    console.log('connected to redis successfully');
});

client.connect();
export default client;