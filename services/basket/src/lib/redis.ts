import {createClient} from "redis";

const client = createClient();

client.on('error', (err: any) => {
    console.log('could not establish a connection with redis. ' + err);
});
client.on('connect', (err: any) => {
    console.log('connected to redis successfully');
});

client.connect();
export default client;