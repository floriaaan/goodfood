import {log} from "@basket/lib/log";
import {Data} from "@basket/types";
import {UserId} from "@basket/types/basket";
import client from "@basket/lib/redis";

export const Reset = async (
    {request}: Data<UserId>,
    callback: (err: any, response: any) => void
) => {
    try {
        const {id} = request;
        if (!id) {
            throw new Error("Invalid request");
        }

        await client.del(`user:${id}`);
        callback(null, {});
    } catch (error) {
        log.error(error);
        callback(error, null);
    }
};
